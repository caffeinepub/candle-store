import { Star } from 'lucide-react';
import type { Review } from '../backend';

interface ReviewListProps {
  reviews: Review[];
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export { StarRating };

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Average Rating */}
      <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl border border-violet-100">
        <div className="text-4xl font-display font-bold text-violet-600">{avgRating.toFixed(1)}</div>
        <div>
          <StarRating rating={Math.round(avgRating)} size="md" />
          <p className="text-xs text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Review Items */}
      <div className="space-y-3">
        {[...reviews]
          .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
          .map((review, idx) => (
            <div key={idx} className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold">
                      {review.userId.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {review.userId.slice(0, 8)}...
                    </span>
                  </div>
                </div>
                <StarRating rating={Number(review.rating)} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.reviewText}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                {new Date(Number(review.timestamp) / 1_000_000).toLocaleDateString('en-IN', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
