import UploadModal from '../UploadModal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function UploadModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Upload Modal</Button>
      <UploadModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
