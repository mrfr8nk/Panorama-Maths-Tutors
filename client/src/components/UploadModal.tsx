import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { courseApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "ZIMSEC",
    status: "Free",
    price: "",
    youtubeLink: "",
    resourceType: "PDF"
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setUploadProgress(0);

      // Upload cover photo first if provided
      let coverPhotoUrl: string | undefined;
      const coverFile = data.get('coverPhoto') as File | null;
      if (coverFile && coverFile.size > 0) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);

        const coverUploadRes = await fetch("/api/courses/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          },
          body: coverFormData
        });

        if (coverUploadRes.ok) {
          const coverData = await coverUploadRes.json();
          coverPhotoUrl = coverData.url;
        }
        setUploadProgress(15);
      }

      // If we have files, upload them to get CDN URLs
      const fileUrls: string[] = [];
      const files = data.getAll('file') as File[];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const uploadRes = await fetch("/api/courses/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          },
          body: fileFormData
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || "Failed to upload file");
        }

        const uploadData = await uploadRes.json();
        fileUrls.push(uploadData.url);

        // Update progress
        setUploadProgress(15 + ((i + 1) / files.length) * 60);
      }

      // Now create the course with the CDN URLs
      const courseData: any = {
        title: data.get('title') as string,
        description: data.get('description') as string,
        type: data.get('type') as string,
        status: data.get('status') as string,
        resourceType: data.get('resourceType') as string
      };

      if (data.get('price')) {
        courseData.price = parseFloat(data.get('price') as string);
      }

      if (data.get('youtubeLink')) {
        courseData.youtubeLink = data.get('youtubeLink') as string;
      }

      // Use the first uploaded file URL for the course
      if (fileUrls.length > 0) {
        courseData.fileUrl = fileUrls[0];
      }

      // Add cover photo URL if uploaded
      if (coverPhotoUrl) {
        courseData.coverPhotoUrl = coverPhotoUrl;
      }

      setUploadProgress(85);

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(courseData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create course");
      }

      setUploadProgress(100);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({ title: "Content uploaded successfully!" });
      setTimeout(() => {
        onOpenChange(false);
        setFormData({ title: "", description: "", type: "ZIMSEC", status: "Free", price: "", youtubeLink: "", resourceType: "PDF" });
        setSelectedFiles([]);
        setCoverPhoto(null);
        setUploadProgress(0);
      }, 500);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to upload content";
      toast({
        title: "Upload failed",
        description: errorMsg,
        variant: "destructive"
      });
      setUploadProgress(0);
      console.error('Upload error:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('type', formData.type);
    submitData.append('status', formData.status);
    submitData.append('resourceType', formData.resourceType);

    if (formData.status === "Premium" && formData.price) {
      submitData.append('price', formData.price);
    }

    if (formData.youtubeLink) {
      submitData.append('youtubeLink', formData.youtubeLink);
    }

    selectedFiles.forEach(file => {
      submitData.append('file', file);
    });

    if (coverPhoto) {
      submitData.append('coverPhoto', coverPhoto);
    }

    uploadMutation.mutate(submitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter(file => file.name !== fileName));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-card/95 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Upload Course Content</DialogTitle>
        </DialogHeader>

        {uploadProgress > 0 && (
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={uploadProgress} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Course title"
              required
              data-testid="input-upload-title"
              disabled={uploadMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course description"
              rows={3}
              required
              data-testid="input-upload-description"
              disabled={uploadMutation.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                disabled={uploadMutation.isPending}
              >
                <SelectTrigger data-testid="select-course-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZIMSEC">ZIMSEC</SelectItem>
                  <SelectItem value="Cambridge">Cambridge</SelectItem>
                  <SelectItem value="Tertiary">Tertiary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resourceType">Resource Type *</Label>
              <Select
                value={formData.resourceType}
                onValueChange={(value) => setFormData({ ...formData, resourceType: value })}
                disabled={uploadMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF Document</SelectItem>
                  <SelectItem value="Video">Video File</SelectItem>
                  <SelectItem value="Image">Image File</SelectItem>
                  <SelectItem value="Audio">Audio File</SelectItem>
                  <SelectItem value="Lesson">YouTube Lesson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Course Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={uploadMutation.isPending}
            >
              <SelectTrigger data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium (Paid)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "Premium" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="25.00"
                type="number"
                step="0.01"
                required={formData.status === "Premium"}
                data-testid="input-price"
                disabled={uploadMutation.isPending}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="coverPhoto">Cover Photo (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-md p-4 text-center hover-elevate cursor-pointer">
              <input
                type="file"
                id="coverPhoto"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCoverPhoto(e.target.files[0]);
                  }
                }}
                accept=".jpg,.jpeg,.png,.gif,.webp"
                data-testid="input-cover-photo"
                disabled={uploadMutation.isPending}
              />
              <label htmlFor="coverPhoto" className="cursor-pointer w-full h-full flex items-center justify-center">
                {coverPhoto ? (
                  <div className="flex items-center gap-2 text-primary">
                    <File className="w-5 h-5" />
                    <span className="text-sm font-medium">{coverPhoto.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setCoverPhoto(null);
                      }}
                      disabled={uploadMutation.isPending}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload cover image</span>
                  </div>
                )}
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Recommended size: 1200x630px. Supported formats: JPG, PNG, GIF, WebP</p>
          </div>

          {formData.resourceType !== "Lesson" && (
            <div className="space-y-2">
              <Label htmlFor="file">Upload File(s) ({formData.resourceType}) *</Label>
              <div className="border-2 border-dashed border-border rounded-md p-6 text-center hover-elevate cursor-pointer">
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={
                    formData.resourceType === "PDF" ? ".pdf" :
                    formData.resourceType === "Video" ? ".mp4,.mov,.avi,.mkv,.webm,.flv" :
                    formData.resourceType === "Image" ? ".jpg,.jpeg,.png,.gif,.webp" :
                    formData.resourceType === "Audio" ? ".mp3,.wav,.ogg,.m4a,.aac,.flac" :
                    "*"
                  }
                  multiple={true}
                  required={selectedFiles.length === 0}
                  data-testid="input-file"
                  disabled={uploadMutation.isPending}
                />
                <label htmlFor="file" className="cursor-pointer w-full h-full flex items-center justify-center">
                  {selectedFiles.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Click to upload {formData.resourceType}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                      {selectedFiles.map((file) => (
                        <div key={file.name} className="flex items-center justify-between w-full text-primary">
                          <div className="flex items-center gap-2">
                            <File className="w-5 h-5" />
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(file.name)}
                            disabled={uploadMutation.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </div>
              {selectedFiles.length > 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  {selectedFiles.length} file(s) selected.
                </div>
              )}
            </div>
          )}

          {formData.resourceType === "Lesson" && (
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube Link *</Label>
              <Input
                id="youtube"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                required={formData.resourceType === "Lesson"}
                data-testid="input-youtube"
                disabled={uploadMutation.isPending}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={uploadMutation.isPending || uploadProgress > 0}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={uploadMutation.isPending || (uploadProgress > 0 && uploadProgress < 100)}
              data-testid="button-upload-submit"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : uploadProgress === 100 ? (
                "Uploaded"
              ) : (
                "Upload Content"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}