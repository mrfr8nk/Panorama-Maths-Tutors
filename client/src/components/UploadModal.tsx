
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, File, Loader2 } from "lucide-react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await courseApi.create(data);
    },
    onSuccess: () => {
      toast({ title: "Content uploaded successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      onOpenChange(false);
      setFormData({ title: "", description: "", type: "ZIMSEC", status: "Free", price: "", youtubeLink: "", resourceType: "PDF" });
      setSelectedFile(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Upload failed", 
        description: error.response?.data?.error || "Failed to upload content",
        variant: "destructive" 
      });
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
    
    if (selectedFile) {
      submitData.append('file', selectedFile);
    }

    uploadMutation.mutate(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-card/95 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Upload Course Content</DialogTitle>
        </DialogHeader>
        
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
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
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
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF Document</SelectItem>
                  <SelectItem value="Video">Video File</SelectItem>
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
                required
                data-testid="input-price"
              />
            </div>
          )}
          
          {(formData.resourceType === "PDF" || formData.resourceType === "Video") && (
            <div className="space-y-2">
              <Label htmlFor="file">Upload File (PDF/Video) *</Label>
              <div className="border-2 border-dashed border-border rounded-md p-6 text-center hover-elevate cursor-pointer">
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept={formData.resourceType === "PDF" ? ".pdf" : ".mp4,.mov,.avi"}
                  required
                  data-testid="input-file"
                />
                <label htmlFor="file" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <File className="w-5 h-5" />
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Click to upload {formData.resourceType}</span>
                    </div>
                  )}
                </label>
              </div>
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
                required
                data-testid="input-youtube"
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={uploadMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={uploadMutation.isPending}
              data-testid="button-upload-submit"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
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
