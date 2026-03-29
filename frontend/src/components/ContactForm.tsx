import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAddSupportRequest } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const addRequest = useAddSupportRequest();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addRequest.mutateAsync({
        id: `req_${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      });
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="w-16 h-16 text-violet-500 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm">
          Thank you for reaching out. We'll respond within 24 hours.
        </p>
        <Button
          variant="outline"
          className="mt-4 rounded-full"
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="How can we help?"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={errors.subject ? 'border-destructive' : ''}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us more..."
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={errors.message ? 'border-destructive' : ''}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={addRequest.isPending}
        className="w-full rounded-full bg-violet-500 hover:bg-violet-600 text-white border-0"
      >
        {addRequest.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
}
