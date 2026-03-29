import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Loader2, MapPin, ShoppingBag } from 'lucide-react';
import { useGetCart, useCreateCheckoutSession, useGetProductById } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { ShoppingItem } from '../backend';
import { toast } from 'sonner';

interface AddressForm {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
}

function OrderSummaryItem({ productId, quantity, priceINR }: { productId: string; quantity: number; priceINR: number }) {
  const { data: product } = useGetProductById(productId);
  const imageUrl = product?.photoUrls?.[0]?.getDirectURL?.() ?? '';

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-violet-50 border border-border flex-shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">🕯️</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1">{product?.name ?? productId}</p>
        <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
      </div>
      <span className="text-sm font-semibold text-violet-600">
        ₹{(priceINR * quantity).toLocaleString('en-IN')}
      </span>
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const createCheckoutSession = useCreateCheckoutSession();

  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const total = cart?.reduce((sum, item) => sum + item.priceINR * Number(item.quantity), 0) ?? 0;
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const validate = () => {
    const newErrors: Partial<AddressForm> = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const items: ShoppingItem[] = cart.map((item) => ({
        productName: item.productId,
        productDescription: `Candle - ${item.productId}`,
        quantity: item.quantity,
        priceInCents: BigInt(Math.round(item.priceINR * 100)),
        currency: 'inr',
      }));

      const session = await createCheckoutSession.mutateAsync(items);
      if (!session?.url) throw new Error('Stripe session missing url');
      window.location.href = session.url;
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <CreditCard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Sign in to checkout</h2>
        <Button
          className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 mt-4"
          onClick={() => router.navigate({ to: '/login' })}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
        <Button
          className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 mt-4"
          onClick={() => router.navigate({ to: '/' })}
        >
          Shop Now
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button
        onClick={() => router.navigate({ to: '/cart' })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </button>

      <h1 className="font-display text-2xl font-semibold mb-8 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-violet-500" />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Shipping Form */}
        <form onSubmit={handleCheckout} className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-500" />
              Shipping Address
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="House no., Street, Area"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={errors.street ? 'border-destructive' : ''}
                />
                {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Maharashtra"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className={errors.state ? 'border-destructive' : ''}
                  />
                  {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="400001"
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className={errors.pincode ? 'border-destructive' : ''}
                  />
                  {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={createCheckoutSession.isPending}
            className="w-full h-12 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 font-medium text-base"
          >
            {createCheckoutSession.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting to Payment...</>
            ) : (
              <><CreditCard className="w-4 h-4 mr-2" /> Pay ₹{grandTotal.toLocaleString('en-IN')}</>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            🔒 Secured by Stripe · Supports UPI, Cards & Net Banking
          </p>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-semibold text-base mb-4">Order Summary</h2>
            <div className="divide-y divide-border">
              {cart.map((item) => (
                <OrderSummaryItem
                  key={item.productId}
                  productId={item.productId}
                  quantity={Number(item.quantity)}
                  priceINR={item.priceINR}
                />
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-violet-600">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
