import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What types of candles do you offer?',
    a: 'We offer a wide range of handcrafted candles including soy wax candles, beeswax candles, scented aromatherapy candles, pillar candles, tea lights, and decorative jar candles. Each is made with premium ingredients for a clean, long-lasting burn.',
  },
  {
    q: 'How long do your candles burn?',
    a: 'Burn time varies by size: tea lights burn 4-6 hours, small jar candles 20-30 hours, medium candles 40-60 hours, and large pillar candles up to 80+ hours. Always trim the wick to 6mm before each use for optimal burn time.',
  },
  {
    q: 'Are your candles safe for pets and children?',
    a: 'Our soy wax candles are made with non-toxic, natural ingredients. However, we recommend keeping all candles out of reach of children and pets, and never leaving a burning candle unattended. Some fragrance oils may affect sensitive pets — consult your vet if concerned.',
  },
  {
    q: 'What is your shipping policy?',
    a: 'We offer free shipping on orders above ₹999. Standard delivery takes 5-7 business days, express delivery 2-3 days. We ship across India via trusted courier partners. You\'ll receive a tracking link via email once your order is dispatched.',
  },
  {
    q: 'Can I return or exchange a candle?',
    a: 'Yes! We accept returns within 7 days of delivery for unused, undamaged items in original packaging. If your candle arrives damaged, we\'ll replace it free of charge. Contact our support team with photos of the damage to initiate a claim.',
  },
  {
    q: 'How do I properly care for my candle?',
    a: 'For best results: trim the wick to 6mm before each burn, allow the wax to melt to the edges on the first burn (prevents tunneling), never burn for more than 4 hours at a time, keep away from drafts, and store in a cool dry place away from direct sunlight.',
  },
  {
    q: 'Do you offer gift wrapping or custom messages?',
    a: 'Absolutely! We offer beautiful gift packaging with ribbon and tissue paper. You can add a personalized message card at checkout. We also have curated gift sets perfect for birthdays, anniversaries, and festivals.',
  },
  {
    q: 'How does the Loyalty Rewards program work?',
    a: 'Earn 1 loyalty point for every ₹10 spent. Points can be redeemed for discounts on future purchases. You also get bonus points on your birthday and for referring friends. Check your Rewards page to see your current balance and available rewards.',
  },
];

export default function FAQ() {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      {faqs.map((faq, idx) => (
        <AccordionItem
          key={idx}
          value={`item-${idx}`}
          className="border border-border rounded-xl px-4 bg-card"
        >
          <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
