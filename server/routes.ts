import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import User from "./models/User";
import Course from "./models/Course";
import Payment from "./models/Payment";
import FileUpload from "./models/FileUpload";
import Visitor from "./models/Visitor";
import { generateToken, authenticateToken, requireAdmin, requireTutorOrAdmin, AuthRequest } from "./middleware/auth";
import { uploadToCatbox } from "./utils/catbox";
import { initiateMobilePayment, checkPaymentStatus } from "./utils/paynow";
import { connectDB } from "./db";
import { registerSchema, loginSchema, courseSchema, paymentSchema } from "./validation";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDB();

  // Visitor tracking middleware (track all page visits)
  app.use((req, res, next) => {
    // Only track GET requests to main pages (not API or assets)
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
      const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent') || 'unknown';
      const page = req.path;

      // Save visitor asynchronously (don't block the request)
      const visitor = new Visitor({
        ipAddress,
        userAgent,
        page
      });
      visitor.save().catch(err => console.error('Visitor tracking error:', err));
    }
    next();
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { name, email, password, educationLevel } = validatedData;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: 'student',
        educationLevel
      });

      await user.save();

      const token = generateToken(String(user._id), user.role);
      res.json({
        token,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          educationLevel: user.educationLevel
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      if (email === 'admin@gmail.com' && password === 'admin123') {
        let adminUser = await User.findOne({ email: 'admin@gmail.com' });
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          adminUser = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'admin'
          });
          await adminUser.save();
        }

        const token = generateToken(String(adminUser._id), adminUser.role);
        return res.json({
          token,
          user: {
            id: String(adminUser._id),
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            educationLevel: adminUser.educationLevel,
            enrolledCourses: adminUser.enrolledCourses
          }
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken(String(user._id), user.role);
      res.json({
        token,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          educationLevel: user.educationLevel,
          enrolledCourses: user.enrolledCourses
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId).select('-password').populate('enrolledCourses');
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { type, status } = req.query;
      const filter: any = {};
      if (type) filter.type = type;
      if (status) filter.status = status;

      const courses = await Course.find(filter).populate('createdBy', 'name email');
      res.json(courses);
    } catch (error) {
      console.error("Fetch courses error:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate('createdBy', 'name email');
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Upload course content
  app.post('/api/courses/upload', authenticateToken, requireTutorOrAdmin, (req: AuthRequest, res, next) => {
    upload.single('file')(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ 
            error: 'File too large. Maximum file size is 200MB.' 
          });
        }
        return res.status(400).json({ 
          error: `Upload error: ${err.message}` 
        });
      } else if (err) {
        return res.status(500).json({ 
          error: 'Failed to process upload' 
        });
      }
      next();
    });
  }, async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('Uploading file:', req.file.originalname, 'Size:', req.file.size, 'bytes');

      // Get custom filename from request body (if provided)
      const customName = req.body.filename || req.file.originalname;

      const result = await uploadToCatbox(
        req.file.buffer, 
        customName,
        req.file.mimetype
      );

      if (!result.success) {
        console.error('Catbox upload failed:', result.error);
        return res.status(500).json({ error: result.error || 'Failed to upload file to CDN' });
      }

      // Save file metadata to MongoDB
      const fileUpload = new FileUpload({
        fileId: result.fileId,
        originalName: req.file.originalname,
        customName: customName,
        mimeType: req.file.mimetype,
        size: req.file.size,
        catboxUrl: result.cdnUrl || '',
        uploadedBy: req.userId
      });

      await fileUpload.save();
      console.log('File metadata saved to MongoDB:', result.fileId);

      res.json({ 
        success: true,
        url: result.cdnUrl,
        fileId: result.fileId,
        originalName: req.file.originalname,
        customName: customName,
        size: req.file.size,
        mimeType: req.file.mimetype
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
  });

  app.post("/api/courses", authenticateToken, requireTutorOrAdmin, async (req: AuthRequest, res) => {
    try {
      const { createCourseSchema } = await import("./validation");
      const dataToValidate = {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        youtubeLink: req.body.youtubeLink || ''
      };
      const validatedData = createCourseSchema.parse(dataToValidate);
      const { title, description, type, status, price, youtubeLink, resourceType } = validatedData;

      let fileUrl = req.body.fileUrl || '';
      
      // If it's a video lesson and youtubeLink is provided, use that
      if (resourceType === 'Lesson' && youtubeLink) {
        fileUrl = youtubeLink;
      }

      const course = new Course({
        title,
        description,
        type,
        status,
        price,
        fileUrl,
        youtubeLink,
        resourceType,
        createdBy: req.userId
      });

      await course.save();
      res.json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", authenticateToken, requireTutorOrAdmin, async (req: AuthRequest, res) => {
    try {
      const { updateCourseSchema } = await import("./validation");
      const dataToValidate = {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        youtubeLink: req.body.youtubeLink || ''
      };
      const validatedData = updateCourseSchema.parse(dataToValidate);
      
      const course = await Course.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true }
      );
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // Payment routes
  app.post("/api/paynow/create-mobile-payment", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = paymentSchema.parse(req.body);
      const { courseId, phoneNumber } = validatedData;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      if (course.status !== 'Premium') {
        return res.status(400).json({ error: "This course is free" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const payment = new Payment({
        userId: req.userId,
        courseId,
        amount: course.price || 0,
        phoneNumber,
        status: 'pending'
      });

      await payment.save();

      try {
        const paynowResponse = await initiateMobilePayment(
          user.email,
          phoneNumber,
          course.title,
          course.price || 0
        );

        if (paynowResponse.success) {
          payment.status = 'processing';
          payment.paynowReference = paynowResponse.reference;
          payment.paynowPollUrl = paynowResponse.pollUrl;
          await payment.save();

          res.json({
            paymentId: payment._id,
            pollUrl: paynowResponse.pollUrl,
            instructions: paynowResponse.instructions
          });
        } else {
          payment.status = 'failed';
          await payment.save();
          res.status(500).json({ error: "Failed to initiate payment" });
        }
      } catch (paynowError) {
        console.error("Paynow error:", paynowError);
        payment.status = 'failed';
        await payment.save();
        res.status(500).json({ error: "Payment service unavailable. Please try again later." });
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  app.get("/api/payments/:id/status", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const payment = await Payment.findById(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      if (payment.userId.toString() !== req.userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (payment.status === 'success') {
        return res.json({ status: 'success' });
      }

      if (payment.paynowPollUrl) {
        try {
          const status = await checkPaymentStatus(payment.paynowPollUrl);

          if (status.paid) {
            payment.status = 'success';
            await payment.save();

            // Enroll user in course
            const user = await User.findById(payment.userId);
            if (user && !user.enrolledCourses.includes(payment.courseId)) {
              user.enrolledCourses.push(payment.courseId);
              await user.save();
            }

            // Increment course enrollments
            await Course.findByIdAndUpdate(payment.courseId, { $inc: { enrollments: 1 } });

            return res.json({ status: 'success' });
          } else {
            return res.json({ status: payment.status });
          }
        } catch (statusError) {
          console.error("Status check error:", statusError);
          return res.json({ status: payment.status });
        }
      }

      res.json({ status: payment.status });
    } catch (error) {
      console.error("Payment status error:", error);
      res.status(500).json({ error: "Failed to check payment status" });
    }
  });

  app.post("/api/paynow/result", express.urlencoded({ extended: true }), async (req, res) => {
    try {
      const { reference, paynowreference, status } = req.body;

      const payment = await Payment.findOne({ paynowReference: reference });
      if (payment) {
        if (status === 'Paid') {
          payment.status = 'success';
          await payment.save();

          // Enroll user
          const user = await User.findById(payment.userId);
          if (user && !user.enrolledCourses.includes(payment.courseId)) {
            user.enrolledCourses.push(payment.courseId);
            await user.save();
          }

          // Increment enrollments
          await Course.findByIdAndUpdate(payment.courseId, { $inc: { enrollments: 1 } });
        } else {
          payment.status = 'failed';
          await payment.save();
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error("Paynow result error:", error);
      res.status(200).send('OK');
    }
  });

  // Users route for admin
  app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password').populate('enrolledCourses', 'title');
      res.json(users);
    } catch (error) {
      console.error("Fetch users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Analytics endpoint
  app.get('/api/analytics/stats', authenticateToken, requireAdmin, async (_req: AuthRequest, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const totalPayments = await Payment.countDocuments();
      const completedPayments = await Payment.countDocuments({ status: 'completed' });

      const revenueResult = await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      const enrollmentResult = await User.aggregate([
        { $unwind: '$enrolledCourses' },
        { $count: 'total' }
      ]);

      const totalEnrollments = enrollmentResult.length > 0 ? enrollmentResult[0].total : 0;

      // Get recent activity counts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentUsers = await User.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo } 
      });

      const recentEnrollments = await Payment.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo },
        status: 'completed'
      });

      // Website traffic insights
      const totalVisitors = await Visitor.countDocuments();
      
      // Unique visitors (by IP)
      const uniqueVisitorsResult = await Visitor.aggregate([
        { $group: { _id: '$ipAddress' } },
        { $count: 'total' }
      ]);
      const uniqueVisitors = uniqueVisitorsResult.length > 0 ? uniqueVisitorsResult[0].total : 0;

      // Recent visitors (last 30 days)
      const recentVisitors = await Visitor.countDocuments({ 
        visitedAt: { $gte: thirtyDaysAgo } 
      });

      // Today's visitors
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayVisitors = await Visitor.countDocuments({ 
        visitedAt: { $gte: today } 
      });

      // Most visited pages
      const topPages = await Visitor.aggregate([
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Total file uploads
      const totalUploads = await FileUpload.countDocuments();
      const totalUploadSize = await FileUpload.aggregate([
        { $group: { _id: null, total: { $sum: '$size' } } }
      ]);
      const uploadSizeBytes = totalUploadSize.length > 0 ? totalUploadSize[0].total : 0;

      res.json({
        totalUsers,
        totalCourses,
        totalPayments: completedPayments,
        pendingPayments: totalPayments - completedPayments,
        totalRevenue,
        totalEnrollments,
        recentUsers,
        recentEnrollments,
        // Traffic insights
        totalVisitors,
        uniqueVisitors,
        recentVisitors,
        todayVisitors,
        topPages,
        // Upload insights
        totalUploads,
        uploadSizeMB: Math.round(uploadSizeBytes / (1024 * 1024))
      });
    } catch (error: any) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Enrollment route (for free courses)
  app.post("/api/courses/:id/enroll", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      if (course.status === 'Premium') {
        return res.status(400).json({ error: "This is a premium course. Payment required." });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const courseId = course._id as any;
      if (user.enrolledCourses.some(id => String(id) === String(courseId))) {
        return res.status(400).json({ error: "Already enrolled in this course" });
      }

      user.enrolledCourses.push(courseId);
      await user.save();

      course.enrollments += 1;
      await course.save();

      res.json({ message: "Successfully enrolled in course" });
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}