import { Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useGetWishlist, useUpdateWishlist } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md';
}

export default function WishlistButton({ productId, size = 'sm' }: WishlistButtonProps) {
  const { identity } = useInternetIdentity();
  const { data: wishlist } = useGetWishlist();
  const updateWishlist = useUpdateWishlist();
  const [loading, setLoading] = useState(false);

  const isInWishlist = wishlist?.some((item) => item.productId === productId) ?? false;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!identity) {
      toast.error('Please sign in to use wishlist');
      return;
    }

    setLoading(true);
    try {
      const currentWishlist = wishlist ?? [];
      let newWishlist;
      if (isInWishlist) {
        newWishlist = currentWishlist.filter((item) => item.productId !== productId);
        toast.success('Removed from wishlist');
      } else {
        newWishlist = [...currentWishlist, { productId, addedAt: BigInt(Date.now()) * BigInt(1_000_000) }];
        toast.success('Added to wishlist! ❤️');
      }
      await updateWishlist.mutateAsync(newWishlist);
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${btnSize} rounded-full flex items-center justify-center transition-all duration-200 ${
        isInWishlist
          ? 'bg-pink-500 text-white shadow-md'
          : 'bg-white/80 backdrop-blur-sm text-muted-foreground hover:bg-pink-50 hover:text-pink-500'
      }`}
    >
      {loading ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : (
        <Heart className={`${iconSize} ${isInWishlist ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}
