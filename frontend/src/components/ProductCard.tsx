import { Link } from '@tanstack/react-router';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../backend';
import WishlistButton from './WishlistButton';
import { useGetCart, useUpdateCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const { data: cart } = useGetCart();
  const updateCart = useUpdateCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const imageUrl = product.photoUrls?.[0]?.getDirectURL?.() ?? '';
  const isOutOfStock = Number(product.stockQuantity) === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!identity) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      const currentCart = cart ?? [];
      const existingItem = currentCart.find((item) => item.productId === product.id);
      let newCart;
      if (existingItem) {
        newCart = currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + BigInt(1) }
            : item
        );
      } else {
        newCart = [...currentCart, { productId: product.id, quantity: BigInt(1), priceINR: product.priceINR }];
      }
      await updateCart.mutateAsync(newCart);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-violet-300 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        {/* Product Image */}
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
                className="w-24 h-24 object-contain animate-float opacity-60"
              />
            </div>
          )}

          {/* Candle flame decoration */}
          <div className="absolute top-3 left-3">
            <div className="w-6 h-6 opacity-70">
              <div className="w-2 h-3 bg-gradient-to-t from-pink-400 to-yellow-300 rounded-full mx-auto animate-flicker" />
              <div className="w-1 h-4 bg-gradient-to-b from-violet-300 to-violet-100 rounded-full mx-auto" />
            </div>
          </div>

          {/* Wishlist button */}
          <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}>
            <WishlistButton productId={product.id} />
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-xs font-medium">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-1">
            <Badge variant="outline" className="text-[10px] text-violet-500 border-violet-200 bg-violet-50 mb-2">
              {product.category}
            </Badge>
          </div>
          <h3 className="font-display font-medium text-foreground text-sm leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-violet-600 text-base">
              ₹{product.priceINR.toLocaleString('en-IN')}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 text-xs px-3 h-8"
            >
              {addingToCart ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <><ShoppingCart className="w-3 h-3 mr-1" /> Add</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
