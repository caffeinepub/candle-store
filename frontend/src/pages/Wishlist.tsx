import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useGetWishlist, useUpdateWishlist, useGetProductById, useGetCart, useUpdateCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { useState } from 'react';
import type { WishlistItem } from '../backend';
import { Link } from '@tanstack/react-router';

function WishlistItemCard({
  item,
  onRemove,
  onMoveToCart,
  removing,
  movingToCart,
}: {
  item: WishlistItem;
  onRemove: (productId: string) => void;
  onMoveToCart: (productId: string) => void;
  removing: string | null;
  movingToCart: string | null;
}) {
  const { data: product, isLoading } = useGetProductById(item.productId);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Skeleton className="aspect-square w-full" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.photoUrls?.[0]?.getDirectURL?.() ?? '';
  const isOutOfStock = Number(product.stockQuantity) === 0;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:border-violet-300 hover:shadow-card-hover transition-all duration-300 group">
      <Link to="/product/$productId" params={{ productId: item.productId }}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-violet-50 to-pink-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/assets/generated/candle-flame-icon.dim_256x256.png"
                alt="Candle"
                className="w-20 h-20 object-contain opacity-50 animate-float"
              />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to="/product/$productId" params={{ productId: item.productId }}>
          <h3 className="font-display font-medium text-sm text-foreground hover:text-violet-600 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        <p className="font-bold text-violet-600 mb-3">₹{product.priceINR.toLocaleString('en-IN')}</p>

        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 text-xs h-8"
            disabled={isOutOfStock || movingToCart === item.productId}
            onClick={() => onMoveToCart(item.productId)}
          >
            {movingToCart === item.productId ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <><ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart</>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-8 w-8 p-0 border-pink-200 hover:bg-pink-50 hover:border-pink-400"
            disabled={removing === item.productId}
            onClick={() => onRemove(item.productId)}
          >
            {removing === item.productId ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 text-pink-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Wishlist() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const { data: wishlist, isLoading } = useGetWishlist();
  const updateWishlist = useUpdateWishlist();
  const { data: cart } = useGetCart();
  const updateCart = useUpdateCart();
  const [removing, setRemoving] = useState<string | null>(null);
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  const handleRemove = async (productId: string) => {
    if (!wishlist) return;
    setRemoving(productId);
    try {
      const newWishlist = wishlist.filter((item) => item.productId !== productId);
      await updateWishlist.mutateAsync(newWishlist);
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    if (!wishlist) return;
    setMovingToCart(productId);
    try {
      // Find the wishlist item to get price
      const wishlistItem = wishlist.find((i) => i.productId === productId);
      if (!wishlistItem) return;

      // Add to cart
      const currentCart = cart ?? [];
      const existingCartItem = currentCart.find((i) => i.productId === productId);
      let newCart;
      if (existingCartItem) {
        newCart = currentCart.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + BigInt(1) } : i
        );
      } else {
        newCart = [...currentCart, { productId, quantity: BigInt(1), priceINR: 0 }];
      }
      await updateCart.mutateAsync(newCart);

      // Remove from wishlist
      const newWishlist = wishlist.filter((item) => item.productId !== productId);
      await updateWishlist.mutateAsync(newWishlist);

      toast.success('Moved to cart! 🛒');
    } catch {
      toast.error('Failed to move to cart');
    } finally {
      setMovingToCart(null);
    }
  };

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Sign in to view your wishlist</h2>
        <p className="text-muted-foreground mb-6">Save your favorite candles for later.</p>
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
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
        <h1 className="font-display text-2xl font-semibold">
          My Wishlist
          {wishlist && wishlist.length > 0 && (
            <span className="text-muted-foreground text-lg font-normal ml-2">
              ({wishlist.length} item{wishlist.length !== 1 ? 's' : ''})
            </span>
          )}
        </h1>
      </div>

      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="animate-float inline-block mb-4">
            <Heart className="w-20 h-20 text-muted-foreground/20 mx-auto" />
          </div>
          <h3 className="font-display text-xl font-medium text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Browse our candle collection and save your favorites!
          </p>
          <Button
            className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
            onClick={() => router.navigate({ to: '/' })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Candles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map((item) => (
            <WishlistItemCard
              key={item.productId}
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
              removing={removing}
              movingToCart={movingToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
