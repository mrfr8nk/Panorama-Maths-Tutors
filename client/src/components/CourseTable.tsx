import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  type: string;
  status: string;
  price?: string;
  enrollments: number;
}

const mockCourses: Course[] = [
  { id: "1", title: "ZIMSEC O Level Algebra", type: "ZIMSEC", status: "Free", enrollments: 45 },
  { id: "2", title: "Cambridge Calculus I", type: "Cambridge", status: "Premium", price: "$25", enrollments: 32 },
  { id: "3", title: "Tertiary Linear Algebra", type: "Tertiary", status: "Premium", price: "$35", enrollments: 18 },
];

export default function CourseTable() {
  const handleEdit = (id: string) => {
    console.log("Edit course:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete course:", id);
  };

  return (
    <div className="rounded-md border border-border backdrop-blur-sm bg-card/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCourses.map((course) => (
            <TableRow key={course.id} data-testid={`row-course-${course.id}`}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{course.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={course.status === "Free" ? "default" : "secondary"}>
                  {course.status}
                </Badge>
              </TableCell>
              <TableCell>{course.price || "-"}</TableCell>
              <TableCell data-testid={`enrollments-${course.id}`}>{course.enrollments}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(course.id)}
                    data-testid={`button-edit-${course.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(course.id)}
                    data-testid={`button-delete-${course.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
