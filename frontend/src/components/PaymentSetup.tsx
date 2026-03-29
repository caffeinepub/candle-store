import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';

interface PaymentSetupProps {
  open: boolean;
  onClose: () => void;
}

export default function PaymentSetup({ open, onClose }: PaymentSetupProps) {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN, US, GB, CA, AU');
  const { data: isConfigured } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error('Please enter a Stripe secret key');
      return;
    }

    try {
      const allowedCountries = countries.split(',').map((c) => c.trim()).filter(Boolean);
      await setConfig.mutateAsync({ secretKey: secretKey.trim(), allowedCountries });
      toast.success('Stripe configured successfully!');
      onClose();
    } catch {
      toast.error('Failed to configure Stripe');
    }
  };

  if (isConfigured) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Stripe Configured
            </DialogTitle>
            <DialogDescription>
              Stripe payment is already configured and ready to accept payments.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-500" />
            Configure Stripe Payments
          </DialogTitle>
          <DialogDescription>
            Enter your Stripe secret key to enable payment processing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="IN, US, GB"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-full">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={setConfig.isPending}
              className="flex-1 rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
            >
              {setConfig.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
