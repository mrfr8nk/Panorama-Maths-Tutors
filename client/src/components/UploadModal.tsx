import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, File } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseType: "ZIMSEC",
    status: "Free",
    price: "",
    youtubeLink: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Upload:", { formData, file: selectedFile });
    toast({ title: "Content uploaded successfully!" });
    onOpenChange(false);
    setFormData({ title: "", description: "", courseType: "ZIMSEC", status: "Free", price: "", youtubeLink: "" });
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-card/95 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Upload Course Content</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Course description"
              rows={3}
              data-testid="input-upload-description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type</Label>
              <Select 
                value={formData.courseType} 
                onValueChange={(value) => setFormData({ ...formData, courseType: value })}
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
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {formData.status === "Premium" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="25.00"
                type="number"
                step="0.01"
                data-testid="input-price"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File (PDF/Video)</Label>
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center hover-elevate cursor-pointer">
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                accept=".pdf,.mp4,.mov"
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
                    <span className="text-sm">Click to upload or drag and drop</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube Link (Optional)</Label>
            <Input
              id="youtube"
              value={formData.youtubeLink}
              onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
              placeholder="https://youtube.com/..."
              data-testid="input-youtube"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-upload-submit">
              Upload Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
