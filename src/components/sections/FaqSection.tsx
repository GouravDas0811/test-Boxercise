'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Faq {
  question: string;
  answer: string;
}

const faqs: Faq[] = [
  {
    question: 'What is the best time to workout?',
    answer: 'The best time to workout is the time that fits your schedule and you can stay consistent with. Both morning and evening have their benefits.',
  },
  {
    question: 'How are the sessions conducted?',
    answer: 'Every session is LIVE and 1-on-1 via Google meet or your preferred platform — completely tailored to your fitness level and goals.',
  },
  {
    question: 'Do I need any equipment?',
    answer: 'Not at all. We start with bodyweight. Your coach will guide you if you need basic tools later in your journey.',
  },
  {
    question: 'Is there a trial membership available?',
    answer: 'Yes! We offer a 1-day trial membership so you can try out our classes before committing.',
  },
  {
    question: ' What if I have an injury or health condition?',
    answer: 'We specialize in rehab and injury-safe workouts. Just tell us during onboarding and we’ll tailor everything for your recovery and goals.',
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-900 text-white py-16 px-6 sm:px-10 md:px-16 lg:px-32">
      <h2 className="text-4xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-6 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-4xl p-4 cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
            onClick={() => toggleFaq(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span className="text-xl">{activeIndex === index ? '−' : '+'}</span>
            </div>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2 text-gray-300"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}