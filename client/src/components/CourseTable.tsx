
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CourseTable() {
  const { data: courses, isLoading } = useQuery<any[]>({
    queryKey: ['/api/courses'],
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseApi.delete(id),
    onSuccess: () => {
      toast({ title: "Course deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setDeleteId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.response?.data?.error || "Failed to delete course",
        variant: "destructive"
      });
    }
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => courseApi.update(id, data),
    onSuccess: () => {
      toast({ title: "Course updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setEditCourse(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.error || "Failed to update course",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border backdrop-blur-sm bg-card/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Enrollments</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses && courses.length > 0 ? (
              courses.map((course: any) => (
                <TableRow key={course._id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.status === 'Free' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${course.price || 0}</TableCell>
                  <TableCell>{course.enrollments || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {course.fileUrl && (
                        <a href={course.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      {course.youtubeLink && (
                        <a href={course.youtubeLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            YT <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditCourse(course)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(course._id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No courses available. Upload your first course!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent className="backdrop-blur-xl bg-card/95 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Edit Course</DialogTitle>
          </DialogHeader>
          {editCourse && <EditCourseForm course={editCourse} onSubmit={(data) => editMutation.mutate({ id: editCourse._id, data })} isPending={editMutation.isPending} onCancel={() => setEditCourse(null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditCourseForm({ course, onSubmit, isPending, onCancel }: { course: any; onSubmit: (data: any) => void; isPending: boolean; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: course.title || '',
    description: course.description || '',
    type: course.type || 'ZIMSEC',
    status: course.status || 'Free',
    resourceType: course.resourceType || 'PDF',
    price: course.price || '',
    youtubeLink: course.youtubeLink || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      resourceType: formData.resourceType,
    };
    if (formData.price) {
      data.price = parseFloat(formData.price as any);
    }
    if (formData.youtubeLink) {
      data.youtubeLink = formData.youtubeLink;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title *</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          data-testid="input-edit-title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description *</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
          data-testid="input-edit-description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Course Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger data-testid="select-edit-type">
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
          <Label>Resource Type *</Label>
          <Select value={formData.resourceType} onValueChange={(value) => setFormData({ ...formData, resourceType: value })}>
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
        <Label>Course Status *</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger data-testid="select-edit-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Premium">Premium (Paid)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-price">Price (USD)</Label>
        <Input
          id="edit-price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="25.00"
          data-testid="input-edit-price"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-youtube">YouTube Link</Label>
        <Input
          id="edit-youtube"
          value={formData.youtubeLink}
          onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          data-testid="input-edit-youtube"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isPending}
          data-testid="button-edit-submit"
        >
          {isPending ? "Updating..." : "Update Course"}
        </Button>
      </div>
    </form>
  );
}
