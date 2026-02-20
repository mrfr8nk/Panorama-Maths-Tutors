import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Megaphone, Trash2, Edit2, X, Check } from "lucide-react";
import { format } from "date-fns";

export default function AdminUpdates() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"announcement" | "feature" | "alert">("announcement");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", type: "announcement" as any });

  const { data: updates, isLoading } = useQuery<any[]>({
    queryKey: ["/api/updates"],
  });

  const mutation = useMutation({
    mutationFn: async (newUpdate: any) => {
      const res = await apiRequest("POST", "/api/updates", newUpdate);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
      toast({ title: "Update posted successfully" });
      setTitle("");
      setContent("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to post update", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await apiRequest("PATCH", `/api/updates/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
      toast({ title: "Update modified successfully" });
      setEditingId(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/updates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/updates"] });
      toast({ title: "Update deleted" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content, type });
  };

  const startEditing = (update: any) => {
    setEditingId(update._id);
    setEditForm({
      title: update.title,
      content: update.content,
      type: update.type
    });
  };

  const handleUpdate = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: editForm });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-accent" />
            Post New Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Update title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="feature">New Feature</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Write your update here..."
                className="min-h-[100px]"
                required
              />
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Update
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-heading">Recent Updates</h3>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : updates?.length === 0 ? (
          <p className="text-center text-muted-foreground p-8 border rounded-lg border-dashed">
            No updates posted yet.
          </p>
        ) : (updates?.map((update) => (
          <Card key={update._id} className="overflow-hidden border-l-4 border-l-accent">
            <CardContent className="p-4">
              {editingId === update._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <Select 
                      value={editForm.type}
                      onValueChange={(v: any) => setEditForm({ ...editForm, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="feature">New Feature</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea 
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>
                      <Check className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent px-2 py-0.5 bg-accent/10 rounded mb-2 inline-block">
                        {update.type}
                      </span>
                      <h4 className="font-bold text-lg">{update.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(update.createdAt), "MMM d, yyyy")}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => startEditing(update)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this update?")) {
                            deleteMutation.mutate(update._id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{update.content}</p>
                </>
              )}
            </CardContent>
          </Card>
        )))}
      </div>
    </div>
  );
}
