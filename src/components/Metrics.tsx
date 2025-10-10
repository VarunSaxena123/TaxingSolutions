import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'

export function Metrics() {
  const { ref, isInView } = useInView(0.3)

  const metrics = [
    { number: '500+', label: 'Happy Clients' },
    { number: '15+', label: 'Years Experience' },
    { number: '1000+', label: 'Projects Completed' },
    { number: '50+', label: 'Team Members' }
  ]

  return (
    <section className="w-full py-12" ref={ref}>
      <motion.div 
        className="w-3/4 bg-primary text-white dark:text-black py-8 px-6 rounded-r-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-medium mb-2"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5, type: "spring", stiffness: 100 }}
              >
                {metric.number}
              </motion.div>
              <div className="text-sm md:text-base text-gray-200 dark:text-black">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}