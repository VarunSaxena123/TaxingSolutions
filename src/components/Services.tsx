import { Briefcase, Users, Target, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'
import { useNavigate } from 'react-router-dom'

export function Services() {
  const { ref, isInView } = useInView(0.2)
  const navigate = useNavigate();


  const services = [
    {
      icon: <Briefcase className="w-8 h-8 dark:text-black" />,
      title: 'GST Filing',
      description: 'Simplify your taxes with our fast, accurate, and hassle-free GST filing service.'
    },
    {
      icon: <Users className="w-8 h-8 dark:text-black" />,
      title: 'Private Limited Company Registration',
      description: 'Private Limited Company(PLC) is a company which is established for the private execution of small businesses.'
    },
    {
      icon: <Target className="w-8 h-8 dark:text-black" />,
      title: 'Income Tax Return',
      description: 'Income tax return (ITR) is a form used to reveal the liable taxes, claim for the deductible taxes and report the gross taxable income. '
    },
    {
      icon: <TrendingUp className="w-8 h-8 dark:text-black" />,
      title: 'Growth Solutions',
      description: 'Scalable solutions designed to accelerate your business growth.'
    }
  ]

  return (
    <section id="services" className="w-full py-16 px-4 bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Our Services
            </motion.h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              {[
                "We offer a comprehensive range of business services designed to help your organization thrive in today's competitive marketplace. Our experienced team provides tailored solutions that address your specific needs and challenges.",
                "From strategic planning to operational excellence, we partner with you to deliver results that matter. Our proven methodologies and industry expertise ensure successful outcomes for every engagement."
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button 
                className="bg-primary text-white dark:bg-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/services')}
              >
                View All Services
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Service Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:text-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="text-primary mb-4"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1, type: "spring", stiffness: 100 }}
                >
                  {service.icon}
                </motion.div>
                <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}