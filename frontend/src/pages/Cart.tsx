import { useState } from 'react';
import { useRouter, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Loader2, Package } from 'lucide-react';
import { useGetCart, useUpdateCart, useGetProductById } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import type { CartItem } from '../backend';
import { toast } from 'sonner';

function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  updating,
}: {
  item: CartItem;
  onQuantityChange: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  updating: boolean;
}) {
  const { data: product, isLoading } = useGetProductById(item.productId);

  if (isLoading) {
    return (
      <div className="flex gap-4 py-4">
        <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  const imageUrl = product?.photoUrls?.[0]?.getDirectURL?.() ?? '';
  const itemTotal = item.priceINR * Number(item.quantity);

  return (
    <div className="flex gap-4 py-4">
      <Link to="/product/$productId" params={{ productId: item.productId }}>
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-violet-50 to-pink-50 border border-border flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to="/product/$productId" params={{ productId: item.productId }}>
          <h3 className="font-medium text-sm text-foreground hover:text-violet-600 transition-colors line-clamp-2">
            {product?.name ?? item.productId}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{product?.category}</p>
        <p className="text-sm font-semibold text-violet-600 mt-1">
          ₹{item.priceINR.toLocaleString('en-IN')} each
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-border rounded-full overflow-hidden">
            <button
              onClick={() => onQuantityChange(item.productId, -1)}
              disabled={updating}
              className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{Number(item.quantity)}</span>
            <button
              onClick={() => onQuantityChange(item.productId, 1)}
              disabled={updating}
              className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-sm font-medium disabled:opacity-50"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-foreground">
              ₹{itemTotal.toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => onRemove(item.productId)}
              disabled={updating}
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const { data: cart, isLoading } = useGetCart();
  const updateCart = useUpdateCart();
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (productId: string, delta: number) => {
    if (!cart) return;
    setUpdating(true);
    try {
      const item = cart.find((i) => i.productId === productId);
      if (!item) return;
      const newQty = Number(item.quantity) + delta;
      let newCart;
      if (newQty <= 0) {
        newCart = cart.filter((i) => i.productId !== productId);
      } else {
        newCart = cart.map((i) =>
          i.productId === productId ? { ...i, quantity: BigInt(newQty) } : i
        );
      }
      await updateCart.mutateAsync(newCart);
    } catch {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!cart) return;
    setUpdating(true);
    try {
      const newCart = cart.filter((i) => i.productId !== productId);
      await updateCart.mutateAsync(newCart);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const total = cart?.reduce((sum, item) => sum + item.priceINR * Number(item.quantity), 0) ?? 0;
  const itemCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Sign in to view your cart</h2>
        <p className="text-muted-foreground mb-6">Your cart items will be saved when you sign in.</p>
        <Button
          className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
          onClick={() => router.navigate({ to: '/login' })}
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-float inline-block mb-4">
          <img
            src="/assets/generated/candle-flame-icon.dim_256x256.png"
            alt="Empty cart"
            className="w-24 h-24 object-contain opacity-40 mx-auto"
          />
        </div>
        <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some beautiful candles to get started!</p>
        <Button
          className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
          onClick={() => router.navigate({ to: '/' })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-6 h-6 text-violet-500" />
        <h1 className="font-display text-2xl font-semibold">
          Shopping Cart
          <span className="text-muted-foreground text-lg font-normal ml-2">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
          <div className="divide-y divide-border">
            {cart.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                updating={updating}
              />
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => router.navigate({ to: '/' })}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-border p-6 h-fit">
          <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({itemCount} items)</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className={total >= 999 ? 'text-green-600 font-medium' : ''}>
                {total >= 999 ? 'FREE' : '₹99'}
              </span>
            </div>
            {total < 999 && (
              <p className="text-xs text-violet-500 bg-violet-50 rounded-lg p-2">
                Add ₹{(999 - total).toLocaleString('en-IN')} more for free shipping!
              </p>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-base text-foreground">
              <span>Total</span>
              <span className="text-violet-600">₹{(total + (total >= 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6 h-12 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 font-medium"
            onClick={() => router.navigate({ to: '/checkout' })}
            disabled={updating}
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>🔒</span>
            <span>Secure checkout powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
