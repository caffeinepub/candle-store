import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductCard from '../components/ProductCard';
import { useGetProducts } from '../hooks/useQueries';

const CATEGORIES = ['All', 'Soy Wax', 'Beeswax', 'Scented', 'Pillar', 'Tea Light', 'Decorative', 'Gift Set'];

export default function ProductListing() {
  const { data: products, isLoading } = useGetProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products?.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) ?? [];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
          <img
            src="/assets/generated/hero-banner.dim_1440x600.png"
            alt="Luminary Candles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/70 via-violet-900/40 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-5 h-5 text-pink-300 animate-flicker" />
                  <span className="text-pink-200 text-sm font-medium tracking-wide uppercase">Handcrafted with Love</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Illuminate Your<br />
                  <span className="text-pink-300">World</span>
                </h1>
                <p className="text-white/80 text-sm sm:text-base mb-6 leading-relaxed">
                  Discover our collection of premium handcrafted candles, each one a work of art.
                </p>
                <Button className="rounded-full bg-white text-violet-700 hover:bg-white/90 font-semibold px-6">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-10">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search candles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-violet-500 text-white shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-violet-100 hover:text-violet-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-float inline-block mb-4">
              <img
                src="/assets/generated/candle-flame-icon.dim_256x256.png"
                alt="No candles"
                className="w-20 h-20 object-contain opacity-40 mx-auto"
              />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground mb-2">
              {searchQuery || selectedCategory !== 'All' ? 'No candles found' : 'No candles yet'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Check back soon for our beautiful candle collection!'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-violet-50 to-pink-50 py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🕯️', title: 'Handcrafted', desc: 'Made with love & care' },
              { icon: '🌿', title: 'Natural Wax', desc: 'Eco-friendly soy wax' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: '⭐', title: 'Rewards', desc: 'Earn points on every order' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-4">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-sm text-foreground mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
