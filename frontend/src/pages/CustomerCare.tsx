import { HeadphonesIcon, MessageCircle, Clock, Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';

export default function CustomerCare() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
          <HeadphonesIcon className="w-8 h-8 text-violet-500" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Customer Care
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're here to help! Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: <Phone className="w-5 h-5 text-violet-500" />,
            title: 'Call Us',
            value: '+91 98765 43210',
            sub: 'Mon–Sat, 9 AM – 7 PM IST',
            bg: 'from-violet-50 to-violet-100/50',
          },
          {
            icon: <Mail className="w-5 h-5 text-pink-500" />,
            title: 'Email Us',
            value: 'support@luminarycandles.in',
            sub: 'Response within 24 hours',
            bg: 'from-pink-50 to-pink-100/50',
          },
          {
            icon: <MapPin className="w-5 h-5 text-blue-500" />,
            title: 'Visit Us',
            value: 'Mumbai, Maharashtra',
            sub: 'India – 400001',
            bg: 'from-blue-50 to-blue-100/50',
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-br ${card.bg} rounded-2xl border border-border p-5 text-center`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              {card.icon}
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">{card.title}</h3>
            <p className="text-sm font-medium text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Contact Form */}
        <div>
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-500" />
            Send a Message
          </h2>
          <div className="bg-card rounded-2xl border border-border p-6">
            <ContactForm />
          </div>
        </div>

        {/* Live Chat */}
        <div>
          <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-500" />
            Live Chat Support
          </h2>
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl border border-violet-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-sm text-foreground">Chat is Online</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Our AI assistant is available 24/7 to answer your questions instantly. For complex issues, our human agents are available during business hours.
            </p>
            <div className="space-y-2 text-sm">
              {[
                { day: 'Monday – Friday', hours: '9:00 AM – 8:00 PM IST' },
                { day: 'Saturday', hours: '10:00 AM – 6:00 PM IST' },
                { day: 'Sunday', hours: 'AI Support Only' },
              ].map((schedule) => (
                <div key={schedule.day} className="flex justify-between items-center py-1.5 border-b border-violet-100 last:border-0">
                  <span className="text-muted-foreground">{schedule.day}</span>
                  <span className="font-medium text-foreground">{schedule.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/60 rounded-xl text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Use the chat bubble in the bottom-right corner to start a conversation with our AI assistant anytime!
            </div>
          </div>

          {/* Quick Help Topics */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-3">Quick Help Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Track Order', 'Return Policy', 'Candle Care', 'Bulk Orders',
                'Gift Wrapping', 'Loyalty Points', 'Payment Issues', 'Delivery',
              ].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-violet-50 text-violet-600 text-xs rounded-full border border-violet-100 cursor-pointer hover:bg-violet-100 transition-colors"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="font-display text-2xl font-semibold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <FAQ />
      </div>
    </div>
  );
}
