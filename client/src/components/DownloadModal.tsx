
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseTitle: string;
}

export default function DownloadModal({ open, onOpenChange, courseId, courseTitle }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const data = await response.json();
      
      if (data.fileUrl) {
        // Open the file URL in a new tab
        window.open(data.fileUrl, '_blank');
        toast({
          title: "Download Started",
          description: "Your course materials are being downloaded.",
        });
      } else {
        throw new Error('No file URL provided');
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download course materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Course Materials</DialogTitle>
          <DialogDescription>
            Download materials for {courseTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to download all course materials.
          </p>
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
