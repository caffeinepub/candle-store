import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { XCircle, ShoppingCart, HeadphonesIcon, RefreshCw } from 'lucide-react';

export default function PaymentFailure() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      {/* Failure Icon */}
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto animate-scale-in">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
        Payment Failed
      </h1>
      <p className="text-muted-foreground text-base mb-8 leading-relaxed">
        We couldn't process your payment. Don't worry — your cart is still saved and no charges were made.
      </p>

      {/* Possible Reasons */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-left">
        <h2 className="font-semibold text-base mb-4">Common reasons for payment failure:</h2>
        <ul className="space-y-2">
          {[
            'Insufficient funds in your account',
            'Card details entered incorrectly',
            'Transaction declined by your bank',
            'Network or connectivity issues',
            'Card not enabled for online transactions',
          ].map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-destructive mt-0.5">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 px-8"
          onClick={() => router.navigate({ to: '/checkout' })}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-8"
          onClick={() => router.navigate({ to: '/cart' })}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <Button
          variant="ghost"
          className="rounded-full px-8"
          onClick={() => router.navigate({ to: '/customer-care' })}
        >
          <HeadphonesIcon className="w-4 h-4 mr-2" />
          Get Help
        </Button>
      </div>
    </div>
  );
}
