import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'
import { TrendingUp, Users, Award, Target, Clock, Star, Briefcase, Globe, Shield } from 'lucide-react'

export function CompanyOverview() {
  const { ref, isInView } = useInView(0.2)

  const metrics = [
    { icon: <Users className="w-6 h-6" />, value: '500+', label: 'Clients Served' },
    { icon: <Award className="w-6 h-6" />, value: '98%', label: 'Success Rate' },
    { icon: <Clock className="w-6 h-6" />, value: '15+', label: 'Years Experience' },
    { icon: <Globe className="w-6 h-6" />, value: '25+', label: 'Countries' }
  ]

  const whyChooseUs = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Strategic Excellence',
      description: 'Proven methodologies that deliver measurable results and sustainable growth for your business.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trusted Expertise',
      description: 'Industry-leading consultants with decades of experience across diverse business sectors.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Results-Driven',
      description: 'Data-backed strategies that consistently exceed client expectations and business objectives.'
    }
  ]

  const leadership = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      credentials: 'MBA Harvard, 20+ years Fortune 500'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Strategy Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      credentials: 'Former McKinsey Partner, MIT PhD'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      credentials: 'Ex-Goldman Sachs VP, Stanford MBA'
    }
  ]

  return (
    <section id="overview" className="py-24 bg-background relative overflow-hidden" ref={ref}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
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
            Why Taxing Solutions
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Trusted by industry leaders worldwide, we deliver transformational business solutions 
            that drive sustainable growth and competitive advantage.
          </motion.p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {metric.icon}
              </motion.div>
              <motion.div 
                className="text-3xl md:text-4xl font-medium text-foreground mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {metric.value}
              </motion.div>
              <div className="text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-card border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-medium text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Leadership Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium text-foreground mb-4">Leadership Team</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Industry veterans with proven track records of delivering exceptional business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <motion.div
                  className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <h4 className="text-xl font-medium text-foreground mb-2">{leader.name}</h4>
                <p className="text-primary mb-2">{leader.role}</p>
                <p className="text-sm text-muted-foreground">{leader.credentials}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}