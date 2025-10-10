import { Mail, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useInView } from './hooks/useInView'
import { ParticleBackground } from './ParticleBackground'

export function Newsletter() {
  const { ref, isInView } = useInView(0.2)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubscribed(true)
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <>
    <ParticleBackground/>
   <section className="w-full py-16 px-4 bg-gray-900 text-white " ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest insights, tips, and updates delivered directly to your inbox.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              required
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              type="submit"
              disabled={isSubmitting || isSubscribed}
              className="px-6 py-3 bg-white dark:text-black text-primary rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
              whileHover={!isSubmitting && !isSubscribed ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting && !isSubscribed ? { scale: 0.95 } : {}}
            >
              {isSubscribed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Subscribed!
                </motion.div>
              ) : isSubmitting ? (
                <motion.div className="flex items-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Subscribing...
                </motion.div>
              ) : (
                'Subscribe'
              )}
            </motion.button>
          </div>
        </motion.form>

        <motion.p
          className="text-white/70 text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          No spam, unsubscribe at any time.
        </motion.p>
      </div>
    </section>
    </>
  )
}