import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/analytics/stats'],
  });

  const displayStats = [
    {
      title: "Total Courses",
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      trend: "Active courses"
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: `+${stats?.recentUsers || 0} this month`
    },
    {
      title: "Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      trend: "Total earnings"
    },
    {
      title: "Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      trend: `+${stats?.recentEnrollments || 0} this month`
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {displayStats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value.toString()}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}