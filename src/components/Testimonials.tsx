import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from './hooks/useInView'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function Testimonials() {
  const { ref, isInView } = useInView(0.2)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CEO, TechStart Inc.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "TaxingSolutions transformed our entire business strategy. Their expertise and dedication helped us increase revenue by 300% in just one year. Absolutely incredible results!"
    },
    {
      name: "Michael Chen",
      position: "Founder, GrowthLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Working with TaxingSolutions was a game-changer. Their strategic insights and implementation support helped us scale from a startup to a market leader."
    },
    {
      name: "Emily Rodriguez",
      position: "COO, Innovation Corp",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The team at TaxingSolutions is exceptional. They don't just provide solutions; they become true partners in your success. Highly recommended!"
    },
    {
      name: "David Kim",
      position: "VP Marketing, NextGen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "TaxingSolutions' innovative approach and deep industry knowledge helped us navigate complex challenges and achieve remarkable growth."
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="w-full py-16 px-4 " ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience working with us.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto ">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-border/50"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <motion.div
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <Quote size={16} />
                    </motion.div>
                  </div>
                </motion.div>

                <div className="flex-1 text-center md:text-left">
                  <motion.div
                    className="flex justify-center md:justify-start mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 100 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.p
                    className="text-lg text-foreground mb-6 italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    "{testimonials[currentTestimonial].text}"
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="font-medium text-foreground">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-muted-foreground">
                      {testimonials[currentTestimonial].position}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <motion.button
              onClick={prevTestimonial}
              className="p-2 bg-background border border-border rounded-full hover:bg-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
            </motion.button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="p-2 bg-background border border-border rounded-full hover:bg-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}