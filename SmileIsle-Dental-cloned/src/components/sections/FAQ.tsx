import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What does it mean that you\'re an airway-focused orthodontic office?',
    answer:
      'We look beyond straight teeth. Using 3D CBCT imaging, we assess your airway, breathing, and overall function. We use expanders, braces, Invisalign, and partner with ENTs and myofunctional therapists to address the root cause — not just the symptoms.',
  },
  {
    question: 'At what age should my child first see an orthodontist?',
    answer:
      'The American Association of Orthodontists recommends an evaluation by age 6-7. Early visits let us catch issues like crowding, crossbites, or airway concerns before they become bigger problems. We offer expanders, habit appliances, and Invisalign First for younger patients.',
  },
  {
    question: 'What can I expect at my first visit?',
    answer:
      'Your first visit includes digital scans, photos, and any necessary x-rays — all using our state-of-the-art technology. Dr. Kosturos will walk you through everything and create a personalized treatment plan. The visit takes about 45 minutes.',
  },
  {
    question: 'What treatment options do you offer besides metal braces?',
    answer:
      'We offer clear ceramic braces, Invisalign for all ages (kids, teens, and adults), palatal expanders, functional appliances, airway-focused treatment, TMJ care, whitening, and retainers. We\'ll find the best fit for your unique needs.',
  },
  {
    question: 'How do you help patients feel comfortable during visits?',
    answer:
      'Our office was designed with comfort in mind. We offer weighted blankets, noise-canceling headphones, a calm coastal atmosphere, and a rewards program for kids. Whether you\'re 7 or 70, we make sure you feel at ease.',
  },
  {
    question: 'Do you offer free consultations or flexible payments?',
    answer:
      'Yes! Your first consultation is always free. We also offer $1,000 off comprehensive treatment for a limited time, flexible monthly payment plans, low down payments, and we accept all major insurance plans.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            Need-to-know answers for parents & patients
          </h2>
          <p className="font-body text-gray-500 text-lg">
            Everything you need to know before your first visit.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="border border-primary-100 rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left
                  font-body font-semibold text-navy hover:bg-primary-50/50 transition-colors duration-200"
                aria-expanded={openIndex === index}
              >
                <span className="pr-4">{item.question}</span>
                <motion.svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-primary"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 font-body leading-relaxed border-t border-primary-50">
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Schema.org JSON-LD — rendered inline so it can be picked up by crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
