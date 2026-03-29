import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Gift, Star, Clock, Zap, Trophy, ArrowRight } from 'lucide-react';
import { useGetUserPoints, useGetPointsHistory, useGetRewards } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function Rewards() {
  const router = useRouter();
  const { identity } = useInternetIdentity();
  const { data: points, isLoading: pointsLoading } = useGetUserPoints();
  const { data: history, isLoading: historyLoading } = useGetPointsHistory();
  const { data: rewards, isLoading: rewardsLoading } = useGetRewards();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Gift className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">Sign in to view your rewards</h2>
        <p className="text-muted-foreground mb-6">Earn points on every purchase and redeem for discounts.</p>
        <Button
          className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
          onClick={() => router.navigate({ to: '/login' })}
        >
          Sign In
        </Button>
      </div>
    );
  }

  const pointsValue = Number(points ?? BigInt(0));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-6 h-6 text-violet-500" />
        <h1 className="font-display text-2xl font-semibold">Loyalty Rewards</h1>
      </div>

      {/* Points Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl p-6 sm:p-8 mb-8 text-white">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Your Points Balance</p>
              {pointsLoading ? (
                <Skeleton className="h-12 w-32 bg-white/20" />
              ) : (
                <div className="font-display text-5xl font-bold">{pointsValue.toLocaleString()}</div>
              )}
              <p className="text-white/70 text-sm mt-2">
                ≈ ₹{(pointsValue * 0.1).toFixed(0)} discount value
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-glow-pulse">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Earn Rate', value: '1pt / ₹10' },
              { label: 'Redeem Rate', value: '10pts = ₹1' },
              { label: 'Tier', value: pointsValue >= 1000 ? 'Gold ✨' : pointsValue >= 500 ? 'Silver 🥈' : 'Bronze 🥉' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="font-semibold text-sm">{stat.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Rewards */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-violet-500" />
            Available Rewards
          </h2>

          {rewardsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : !rewards || rewards.length === 0 ? (
            <div className="bg-muted/50 rounded-2xl p-8 text-center border border-border">
              <Gift className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No rewards available yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Keep shopping to unlock rewards!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rewards.map((reward) => {
                const canRedeem = pointsValue >= Number(reward.pointsRequired);
                return (
                  <div
                    key={reward.id}
                    className={`bg-card rounded-xl border p-4 transition-all ${
                      canRedeem ? 'border-violet-200 hover:border-violet-400' : 'border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs text-violet-500 border-violet-200 bg-violet-50"
                          >
                            {reward.discountPercentage}% OFF
                          </Badge>
                          {canRedeem && (
                            <Badge className="text-xs bg-green-100 text-green-700 border-0">
                              Available!
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground">{reward.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requires {Number(reward.pointsRequired).toLocaleString()} points
                        </p>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canRedeem}
                        className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 text-xs flex-shrink-0"
                        onClick={() => toast.info('Reward redemption coming soon!')}
                      >
                        Redeem <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    {!canRedeem && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{pointsValue.toLocaleString()} pts</span>
                          <span>{Number(reward.pointsRequired).toLocaleString()} pts needed</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (pointsValue / Number(reward.pointsRequired)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Default rewards if none exist */}
          {(!rewards || rewards.length === 0) && !rewardsLoading && (
            <div className="mt-4 space-y-3">
              {[
                { discount: 10, points: 500, desc: '10% off your next order' },
                { discount: 20, points: 1000, desc: '20% off any candle' },
                { discount: 30, points: 2000, desc: '30% off + free shipping' },
              ].map((r) => {
                const canRedeem = pointsValue >= r.points;
                return (
                  <div
                    key={r.points}
                    className={`bg-card rounded-xl border p-4 ${
                      canRedeem ? 'border-violet-200' : 'border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="text-xs text-violet-500 border-violet-200 bg-violet-50 mb-1">
                          {r.discount}% OFF
                        </Badge>
                        <p className="font-medium text-sm">{r.desc}</p>
                        <p className="text-xs text-muted-foreground">{r.points} points required</p>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canRedeem}
                        className="rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0 text-xs"
                        onClick={() => toast.info('Reward redemption coming soon!')}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Points History */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-500" />
            Points History
          </h2>

          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : !history || history.length === 0 ? (
            <div className="bg-muted/50 rounded-2xl p-8 text-center border border-border">
              <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No points history yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Make a purchase to start earning!</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-full"
                onClick={() => router.navigate({ to: '/' })}
              >
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {[...history]
                .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                .map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                    <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Number(entry.timestamp) / 1_000_000).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="font-bold text-sm text-violet-600 flex-shrink-0">
                      +{Number(entry.points)} pts
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* How to Earn */}
      <div className="mt-10 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl border border-violet-100 p-6">
        <h2 className="font-display text-lg font-semibold mb-4 text-center">How to Earn Points</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🛒', title: 'Purchase', desc: '1 pt per ₹10 spent' },
            { icon: '⭐', title: 'Review', desc: '50 pts per review' },
            { icon: '🎂', title: 'Birthday', desc: '100 bonus pts' },
            { icon: '👥', title: 'Refer', desc: '200 pts per referral' },
          ].map((way) => (
            <div key={way.title} className="text-center p-3 bg-white/60 rounded-xl">
              <div className="text-2xl mb-1">{way.icon}</div>
              <div className="font-semibold text-xs text-foreground">{way.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{way.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
