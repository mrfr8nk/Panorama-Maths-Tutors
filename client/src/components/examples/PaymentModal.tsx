import PaymentModal from '../PaymentModal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PaymentModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Payment Modal</Button>
      <PaymentModal
        open={open}
        onOpenChange={setOpen}
        courseName="Cambridge A Level Calculus"
        price="$25.00"
      />
    </div>
  );
}
