import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'
import { useNavigate } from 'react-router-dom'

import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Target, 
  BarChart3, 
  Globe,
  ArrowRight 
} from 'lucide-react'

export function CoreServices() {
  const { ref, isInView } = useInView(0.2)
    const navigate = useNavigate();
  

  const services = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'Business Strategy',
      description: 'Comprehensive strategic planning and market positioning to accelerate growth.',
      features: ['Market Analysis', 'Growth Planning', 'Competitive Strategy']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Growth Solutions',
      description: 'Scalable strategies designed to maximize business potential and revenue.',
      features: ['Revenue Optimization', 'Scalability Planning', 'Process Improvement']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Excellence',
      description: 'Leadership development and team optimization for high performance.',
      features: ['Leadership Training', 'Team Building', 'Performance Management']
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Market Analysis',
      description: 'Deep market insights and competitive intelligence for informed decisions.',
      features: ['Market Research', 'Competitor Analysis', 'Trend Forecasting']
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Financial Advisory',
      description: 'Expert financial planning and investment strategies for optimal performance.',
      features: ['Financial Planning', 'Investment Strategy', 'Risk Management']
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Expansion',
      description: 'Strategic guidance for international growth and market entry.',
      features: ['Market Entry', 'International Strategy', 'Cultural Adaptation']
    }
  ]

  return (
    <section id="services" className="py-24 bg-muted/30 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-medium text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Core Services
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Comprehensive business solutions tailored to drive sustainable growth and operational excellence.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Icon */}
              <motion.div
                className="flex items-center justify-center w-16 h-16 mb-6 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {service.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-medium text-foreground mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                className="flex items-center text-primary hover:text-primary/80 transition-colors group/btn"
                whileHover={{ x: 5 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                
                <span className="font-medium mr-2">Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => 
                navigate('/services')// Navigate to services page - this would be handled by parent component
            }
          >
            <span className="mr-2">View All Services</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}