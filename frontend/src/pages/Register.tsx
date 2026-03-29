import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, Loader2, Eye, EyeOff } from 'lucide-react';
import { SiGoogle } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, loginStatus, identity } = useInternetIdentity();
  const router = useRouter();

  if (identity) {
    router.navigate({ to: '/' });
    return null;
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    handleIdentityLogin();
  };

  const handleIdentityLogin = () => {
    try {
      login();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Registration failed');
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="/assets/generated/auth-bg.dim_1440x900.png"
          alt="Candles background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/60 to-violet-900/40" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <div className="animate-float mb-6">
            <img
              src="/assets/generated/candle-flame-icon.dim_256x256.png"
              alt="Candle"
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>
          <h2 className="font-display text-3xl font-semibold mb-3">Join Luminary</h2>
          <p className="text-white/80 text-sm max-w-xs leading-relaxed">
            Create your account and start earning rewards with every candle purchase.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Candle Types', value: '50+' },
              { label: 'Happy Customers', value: '10K+' },
              { label: 'Reward Points', value: '∞' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                <div className="font-display text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white animate-flicker" />
            </div>
            <span className="font-display text-2xl font-semibold text-gradient">Luminary</span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Join thousands of candle lovers today
          </p>

          {/* Google Register */}
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full mb-4 h-11 border-border hover:border-violet-300 hover:bg-violet-50 transition-colors"
            onClick={handleIdentityLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <SiGoogle className="w-4 h-4 mr-2 text-[#4285F4]" />
            )}
            Sign up with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or register with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`h-11 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`h-11 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`h-11 rounded-xl ${errors.phone ? 'border-destructive' : ''}`}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`h-11 rounded-xl pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white border-0 font-medium"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-500 hover:text-violet-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
