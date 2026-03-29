import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { ShoppingCart, Heart, Gift, HeadphonesIcon, Menu, X, Flame, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCart } from '../hooks/useQueries';
import { useGetWishlist } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useQueries';
import ProfileSetupModal from './ProfileSetupModal';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const router = useRouter();
  const isAuthenticated = !!identity;

  const { data: cart } = useGetCart();
  const { data: wishlist } = useGetWishlist();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();

  const cartCount = cart?.reduce((sum, item) => sum + Number(item.quantity), 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    router.navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Shop' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/rewards', label: 'Rewards' },
    { to: '/customer-care', label: 'Support' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <img
                src="/assets/generated/luminary-logo.dim_400x400.png"
                alt="Luminary Candles"
                className="w-9 h-9 object-contain rounded-lg"
              />
            </div>
            <span className="font-display text-xl font-semibold text-gradient hidden sm:block">
              Luminary
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                activeProps={{ className: 'text-foreground bg-accent' }}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 rounded-lg hover:bg-violet-50 transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Heart className="w-5 h-5 text-muted-foreground" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-pink-500 text-white border-0">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-violet-500 text-white border-0">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <span className="hidden sm:block text-sm text-muted-foreground font-medium px-2">
                  {userProfile?.name || 'User'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleLogin}
                disabled={loginStatus === 'logging-in'}
                className="bg-violet-500 hover:bg-violet-600 text-white border-0 rounded-full px-4"
              >
                {loginStatus === 'logging-in' ? 'Signing in...' : 'Sign In'}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-3 text-sm font-medium text-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {!isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full rounded-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button className="w-full rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-6 h-6 text-violet-500" />
                <span className="font-display text-xl font-semibold text-gradient">Luminary Candles</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Handcrafted candles that illuminate your world with warmth, fragrance, and elegance.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { to: '/', label: 'Shop All' },
                  { to: '/wishlist', label: 'Wishlist' },
                  { to: '/rewards', label: 'Rewards' },
                  { to: '/customer-care', label: 'Support' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4 text-violet-400" />
                  <span>24/7 Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-400" />
                  <span>Loyalty Rewards</span>
                </li>
                <li>
                  <Link to="/customer-care" className="hover:text-foreground transition-colors">
                    Contact Us →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Luminary Candles. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Built with{' '}
              <span className="text-pink-500">♥</span>{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'luminary-candles')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Profile Setup Modal */}
      {showProfileSetup && <ProfileSetupModal />}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
