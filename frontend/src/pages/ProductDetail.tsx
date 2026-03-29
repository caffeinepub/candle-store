import { useState } from 'react';
import { useParams, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Star, Loader2, Package, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useGetProductById,
  useGetReviewsByProduct,
  useGetCart,
  useUpdateCart,
  useAddReview,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import WishlistButton from '../components/WishlistButton';
import ReviewList, { StarRating } from '../components/ReviewList';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { productId } = useParams({ from: '/product/$productId' });
  const router = useRouter();
  const { identity } = useInternetIdentity();

  const { data: product, isLoading: productLoading } = useGetProductById(productId);
  const { data: reviews, isLoading: reviewsLoading } = useGetReviewsByProduct(productId);
  const { data: cart } = useGetCart();
  const updateCart = useUpdateCart();
  const addReview = useAddReview();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (!product) return;

    setAddingToCart(true);
    try {
      const currentCart = cart ?? [];
      const existingItem = currentCart.find((item) => item.productId === product.id);
      let newCart;
      if (existingItem) {
        newCart = currentCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + BigInt(quantity) }
            : item
        );
      } else {
        newCart = [
          ...currentCart,
          { productId: product.id, quantity: BigInt(quantity), priceINR: product.priceINR },
        ];
      }
      await updateCart.mutateAsync(newCart);
      toast.success(`${product.name} added to cart! 🛒`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error('Please sign in to submit a review');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await addReview.mutateAsync({
        productId,
        userId: identity.getPrincipal().toString(),
        rating: BigInt(reviewRating),
        reviewText: reviewText.trim(),
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      });
      toast.success('Review submitted! Thank you 🌟');
      setReviewText('');
      setReviewRating(5);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Flame className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">This candle may have been removed or doesn't exist.</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => router.navigate({ to: '/' })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Button>
      </div>
    );
  }

  const images = product.photoUrls ?? [];
  const currentImageUrl = images[selectedImageIdx]?.getDirectURL?.() ?? '';
  const isOutOfStock = Number(product.stockQuantity) === 0;
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.navigate({ to: '/' })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 to-pink-50 border border-border">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/assets/generated/candle-flame-icon.dim_256x256.png"
                  alt="Candle"
                  className="w-32 h-32 object-contain opacity-50 animate-float"
                />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIdx((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIdx((i) => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === selectedImageIdx ? 'border-violet-500' : 'border-border'
                  }`}
                >
                  <img
                    src={img.getDirectURL?.() ?? ''}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <Badge variant="outline" className="text-xs text-violet-500 border-violet-200 bg-violet-50 mb-3">
              {product.category}
            </Badge>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">{product.name}</h1>

            {/* Rating summary */}
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={Math.round(avgRating)} size="md" />
                <span className="text-sm text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            <div className="text-3xl font-bold text-violet-600 mb-4">
              ₹{product.priceINR.toLocaleString('en-IN')}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Out of Stock</span>
              ) : (
                <span className="text-green-600 font-medium">{Number(product.stockQuantity)} in stock</span>
              )}
            </span>
          </div>

          <Separator />

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <Label className="text-sm font-medium">Quantity</Label>
              <div className="flex items-center border border-border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors text-lg font-medium"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(Number(product.stockQuantity), q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 font-medium"
            >
              {addingToCart ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
              ) : (
                <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>
              )}
            </Button>
            <WishlistButton productId={product.id} size="md" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { icon: '🌿', text: 'Natural Soy Wax' },
              { icon: '🕯️', text: 'Hand-poured' },
              { icon: '🚚', text: 'Free shipping ₹999+' },
              { icon: '↩️', text: '7-day returns' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Review List */}
        <div>
          <h2 className="font-display text-2xl font-semibold mb-6">Customer Reviews</h2>
          {reviewsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          ) : (
            <ReviewList reviews={reviews ?? []} />
          )}
        </div>

        {/* Write Review */}
        <div>
          <h2 className="font-display text-2xl font-semibold mb-6">Write a Review</h2>
          {identity ? (
            <form onSubmit={handleSubmitReview} className="space-y-4 bg-card border border-border rounded-2xl p-6">
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="reviewText">Your Review</Label>
                <Textarea
                  id="reviewText"
                  placeholder="Share your experience with this candle..."
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={submittingReview}
                className="w-full rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
              >
                {submittingReview ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </form>
          ) : (
            <div className="bg-muted/50 rounded-2xl p-8 text-center border border-border">
              <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm mb-4">Sign in to write a review</p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.navigate({ to: '/login' })}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
