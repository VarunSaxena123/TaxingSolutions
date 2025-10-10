import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from './hooks/useInView'

export function FAQ() {
  const { ref, isInView } = useInView(0.2)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What services does TaxingSolutions offer?",
      answer: "We offer a comprehensive range of business services including strategic planning, team management, market analysis, and growth solutions. Our expert team provides tailored consulting services to help businesses of all sizes achieve their goals."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on scope and complexity. Most strategic consulting projects take 3-6 months, while smaller initiatives can be completed in 4-8 weeks. We provide detailed timelines during our initial consultation."
    },
    {
      question: "Do you work with startups or only established companies?",
      answer: "We work with businesses at all stages, from early-stage startups to established enterprises. Our approach is tailored to each client's unique needs, resources, and growth stage."
    },
    {
      question: "What makes TaxingSolutions different from other firms?",
      answer: "Our difference lies in our hands-on approach and long-term partnership mindset. We don't just provide recommendations; we work alongside you to implement solutions and ensure lasting results. Our team has over 15 years of proven success across various industries."
    },
    {
      question: "How do you measure project success?",
      answer: "We establish clear, measurable KPIs at the start of every project. Success metrics typically include revenue growth, operational efficiency improvements, market share expansion, or other specific goals aligned with your business objectives."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-16 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services and process.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
                onClick={() => toggleFAQ(index)}
                whileHover={{ backgroundColor: "var(--accent)" }}
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-primary" />
                  )}
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}