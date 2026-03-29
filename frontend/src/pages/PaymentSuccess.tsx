import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, Gift, Star } from 'lucide-react';

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      {/* Success Animation */}
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mx-auto animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-violet-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center animate-float">
          <span className="text-lg">🕯️</span>
        </div>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3 animate-fade-in-up">
        Order Confirmed! 🎉
      </h1>
      <p className="text-muted-foreground text-base mb-8 leading-relaxed animate-fade-in-up">
        Thank you for your purchase! Your beautiful candles are being prepared with love and will be on their way soon.
      </p>

      {/* Order Details Card */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8 text-left animate-fade-in-up">
        <h2 className="font-semibold text-base mb-4 text-center">What happens next?</h2>
        <div className="space-y-4">
          {[
            {
              icon: '📧',
              title: 'Confirmation Email',
              desc: 'You\'ll receive an order confirmation email shortly.',
            },
            {
              icon: '🕯️',
              title: 'Order Preparation',
              desc: 'Our artisans will carefully prepare your candles (1-2 business days).',
            },
            {
              icon: '🚚',
              title: 'Shipping',
              desc: 'Your order will be dispatched and you\'ll get a tracking link.',
            },
            {
              icon: '📦',
              title: 'Delivery',
              desc: 'Estimated delivery in 5-7 business days.',
            },
          ].map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0 text-lg">
                {step.icon}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Notice */}
      <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100 p-4 mb-8 flex items-center gap-3">
        <Star className="w-8 h-8 text-violet-500 flex-shrink-0" />
        <div className="text-left">
          <p className="font-semibold text-sm text-violet-700">Loyalty Points Earned!</p>
          <p className="text-xs text-violet-600/80">Points have been added to your rewards account.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          className="rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 px-8"
          onClick={() => router.navigate({ to: '/' })}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-8"
          onClick={() => router.navigate({ to: '/rewards' })}
        >
          <Gift className="w-4 h-4 mr-2" />
          View Rewards
        </Button>
      </div>
    </div>
  );
}
