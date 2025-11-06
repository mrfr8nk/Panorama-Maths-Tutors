import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  price: string;
}

export default function PaymentModal({ open, onOpenChange, courseName, price }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    console.log("Payment initiated:", { phoneNumber, courseName, price });
    
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onOpenChange(false);
        setStatus("idle");
        setPhoneNumber("");
      }, 2000);
    }, 2000);
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
          <form onSubmit={handlePayment} className="space-y-6">
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
                  disabled={status === "processing"}
                  data-testid="input-phone-number"
                />
                <p className="text-xs text-muted-foreground">
                  You will receive a prompt on your phone to approve the payment
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={status === "processing"}
              data-testid="button-pay"
            >
              {status === "processing" ? (
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
