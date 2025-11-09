import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, DollarSign, TrendingUp, Eye, UserPlus, Globe, FileUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

interface AnalyticsStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  recentUsers: number;
  totalUploads: number;
  uploadSizeMB: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<AnalyticsStats>({
    queryKey: ['/api/analytics/stats'],
  });

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Registered users"
    },
    {
      title: "Active Courses",
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      description: "Available courses"
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      description: "Real revenue from payments"
    },
    {
      title: "Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      description: "Total course enrollments"
    },
    {
      title: "Website Visitors",
      value: stats?.totalVisitors || 0,
      icon: Globe,
      description: `${stats?.uniqueVisitors || 0} unique visitors`
    },
    {
      title: "Today's Traffic",
      value: stats?.todayVisitors || 0,
      icon: Eye,
      description: "Visitors today"
    },
    {
      title: "New Users (30d)",
      value: stats?.recentUsers || 0,
      icon: UserPlus,
      description: "Last 30 days"
    },
    {
      title: "Files Uploaded",
      value: stats?.totalUploads || 0,
      icon: FileUp,
      description: `${stats?.uploadSizeMB || 0}MB total`
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value.toString()}
          icon={stat.icon}
          trend={stat.description}
        />
      ))}
    </div>
  );
}