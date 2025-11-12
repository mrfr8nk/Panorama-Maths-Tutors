import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { paymentApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  courseId: string;
  price: string;
}

export default function PaymentModal({ open, onOpenChange, courseName, courseId, price }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const { toast } = useToast();
  const [instructions, setInstructions] = useState(''); // Added for instructions
  const [isProcessing, setIsProcessing] = useState(false); // Added for processing state

  // Mock checkPaymentStatus function for demonstration
  const checkPaymentStatus = async (paymentId: string) => {
    let interval: NodeJS.Timeout;
    const checkStatus = async () => {
      try {
        const result = await paymentApi.checkStatus(paymentId);
        if (result.status === "success") {
          setStatus("success");
          clearInterval(interval);
          setTimeout(() => {
            onOpenChange(false);
            setStatus("idle");
            setPhoneNumber("");
            setPaymentId(null);
            setInstructions('');
            setIsProcessing(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Status check error:", error);
        // Optionally, handle errors more gracefully here
      }
    };
    interval = setInterval(checkStatus, 3000);
    checkStatus(); // Initial check
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (paymentId && status === "processing") {
      interval = setInterval(async () => {
        try {
          const result = await paymentApi.checkStatus(paymentId);
          if (result.status === "success") {
            setStatus("success");
            clearInterval(interval);
            setTimeout(() => {
              onOpenChange(false);
              setStatus("idle");
              setPhoneNumber("");
              setPaymentId(null);
            }, 2000);
          }
        } catch (error) {
          console.error("Status check error:", error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentId, status, onOpenChange]);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number (e.g., 0771234567)");
      return;
    }

    setIsProcessing(true);
    setInstructions('Initiating payment...');

    try {
      const response = await fetch('/api/paynow/create-mobile-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          courseId,
          phoneNumber: phoneNumber.startsWith('0') ? phoneNumber : `0${phoneNumber}`
        })
      });

      const data = await response.json();

      if (response.ok && data.paymentId) {
        setPaymentId(data.paymentId);
        setInstructions(data.instructions || 'Please check your phone to approve the payment on your mobile money app (EcoCash/OneMoney)');
        checkPaymentStatus(data.paymentId);
      } else {
        alert(data.error || 'Payment initiation failed. Please check your phone number and try again.');
        setIsProcessing(false);
        setInstructions('');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment service unavailable. Please try again later.');
      setIsProcessing(false);
      setInstructions('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-card/95">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Ecocash Payment</DialogTitle>
          <DialogDescription>
            Complete your payment to access this course
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">You now have access to this course</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-md bg-muted/30">
                <span className="font-medium">{courseName}</span>
                <Badge variant="default" className="text-lg">{price}</Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Econet Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="077 123 4567"
                  required
                  disabled={isProcessing}
                  data-testid="input-phone-number"
                />
                {instructions && <p className="text-xs text-muted-foreground">{instructions}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
              data-testid="button-pay"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${price}`
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}