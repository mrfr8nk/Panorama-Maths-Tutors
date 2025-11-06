import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Courses"
        value="24"
        icon={BookOpen}
        trend="+3 this month"
      />
      <StatCard
        title="Students Enrolled"
        value="156"
        icon={Users}
        trend="+12 this week"
      />
      <StatCard
        title="Revenue"
        value="$2,450"
        icon={DollarSign}
        trend="+18% from last month"
      />
      <StatCard
        title="Completion Rate"
        value="87%"
        icon={TrendingUp}
        trend="+5% improvement"
      />
    </div>
  );
}
