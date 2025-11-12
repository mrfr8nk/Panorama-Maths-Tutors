import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  educationLevel?: 'High School' | 'University' | 'College' | 'Other';
  phoneNumber?: string;
  address?: string;
  school?: string;
  gradeLevel?: string;
  guardianName?: string;
  guardianContact?: string;
  enrolledCourses?: string[];
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  type: 'ZIMSEC' | 'Cambridge' | 'Tertiary';
  status: 'Free' | 'Premium';
  price?: number;
  fileUrl?: string;
  youtubeLink?: string;
  coverPhotoUrl?: string;
  resourceType: 'PDF' | 'Video' | 'Image' | 'Audio' | 'Lesson';
  enrollments: number;
  uploadedAt?: Date;
  createdAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaymentResponse {
  paymentId: string;
  pollUrl: string;
  instructions: string;
}

export const authApi = {
  register: async (name: string, email: string, password: string, educationLevel?: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password, educationLevel });
    return data;
  },
  
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
  
  getMe: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  }
};

export const courseApi = {
  getAll: async (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const { data } = await api.get<Course[]>(`/courses?${params.toString()}`);
    return data;
  },
  
  getById: async (id: string) => {
    const { data } = await api.get<Course>(`/courses/${id}`);
    return data;
  },
  
  create: async (formData: FormData) => {
    const { data } = await api.post<Course>('/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  
  update: async (id: string, updates: Partial<Course>) => {
    const { data } = await api.put<Course>(`/courses/${id}`, updates);
    return data;
  },
  
  delete: async (id: string) => {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  },
  
  enroll: async (id: string) => {
    const { data } = await api.post(`/courses/${id}/enroll`);
    return data;
  }
};

export const paymentApi = {
  createMobilePayment: async (courseId: string, phoneNumber: string) => {
    const { data } = await api.post<PaymentResponse>('/paynow/create-mobile-payment', { 
      courseId, 
      phoneNumber 
    });
    return data;
  },
  
  checkStatus: async (paymentId: string) => {
    const { data } = await api.get<{ status: string }>(`/payments/${paymentId}/status`);
    return data;
  }
};

export const analyticsApi = {
  getStats: async () => {
    const { data } = await api.get('/analytics/stats');
    return data;
  }
};

export const usersApi = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  }
};

export default api;
