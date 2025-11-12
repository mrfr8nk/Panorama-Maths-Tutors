import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

interface Payment {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  courseId: {
    title: string;
  };
  amount: number;
  phoneNumber: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  paynowReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function PaymentTracker() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      processing: "secondary",
      failed: "destructive",
      pending: "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/80">
        <CardContent className="py-12 text-center text-muted-foreground">
          No payment transactions yet
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: payments.length,
    success: payments.filter(p => p.status === 'success').length,
    pending: payments.filter(p => p.status === 'pending' || p.status === 'processing').length,
    failed: payments.filter(p => p.status === 'failed').length,
    revenue: payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${stats.revenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.slice(0, 20).map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
                data-testid={`payment-${payment._id}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(payment.status)}
                  <div className="flex-1">
                    <div className="font-medium">{payment.courseId.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.userId.name} ({payment.userId.email})
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {payment.phoneNumber}
                      {payment.paynowReference && ` • Ref: ${payment.paynowReference}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">${payment.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
