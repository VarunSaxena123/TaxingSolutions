import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useInView } from './hooks/useInView'
import { 
  Users, Award, Clock, TrendingUp, Star, Globe, 
  Target, CheckCircle2, Zap, Heart 
} from 'lucide-react'

export function ServiceStats() {
  const { ref, isInView } = useInView(0.3)

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: 500,
      suffix: "+",
      label: "Satisfied Clients",
      description: "Businesses transformed",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 98,
      suffix: "%",
      label: "Success Rate",
      description: "Projects completed successfully",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: 24,
      suffix: "h",
      label: "Average Response",
      description: "Quick support guarantee",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: 300,
      suffix: "%",
      label: "ROI Average",
      description: "Return on investment",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: 4.9,
      suffix: "/5",
      label: "Client Rating",
      description: "Based on 200+ reviews",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: 25,
      suffix: "+",
      label: "Countries Served",
      description: "Global reach",
      color: "from-cyan-500 to-blue-600"
    }
  ]

  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-muted/30 to-background relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-foreground mb-6">
            Proven Results
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our track record speaks for itself. Here's what we've achieved together with our clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <AnimatedStatCard
              key={index}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Additional Metrics Bar */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { icon: <Target />, label: "On-Time Delivery", value: "100%" },
            { icon: <CheckCircle2 />, label: "Quality Score", value: "9.8/10" },
            { icon: <Zap />, label: "Faster Results", value: "40%" },
            { icon: <Heart />, label: "Client Retention", value: "95%" }
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-primary mb-2 flex justify-center">
                {metric.icon}
              </div>
              <div className="font-medium text-lg text-foreground">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function AnimatedStatCard({ stat, index, isInView }: { 
  stat: any, 
  index: number, 
  isInView: boolean 
}) {
  const [count, setCount] = useState(0)
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) => Math.round(latest))

  useEffect(() => {
    if (isInView) {
      const animation = animate(motionValue, stat.value, {
        duration: 2,
        delay: index * 0.2,
      })
      
      const unsubscribe = rounded.onChange((latest) => {
        setCount(latest)
      })

      return () => {
        animation.stop()
        unsubscribe()
      }
    }
  }, [isInView, motionValue, rounded, stat.value, index])

  return (
    <motion.div
      className="group relative p-8 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/20 transition-all duration-500 overflow-hidden"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      {/* Background Gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        initial={false}
      />

      {/* Animated Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${stat.color.includes('blue') ? '#3b82f6' : '#8b5cf6'}, transparent)`,
          padding: '2px',
        }}
        initial={{ opacity: 0, rotate: 0 }}
        whileHover={{ opacity: 0.3, rotate: 360 }}
        transition={{ duration: 2, ease: "linear" }}
      >
        <div className="w-full h-full bg-card rounded-2xl" />
      </motion.div>

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} text-white rounded-xl mb-6 shadow-lg`}
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          {stat.icon}
        </motion.div>

        {/* Animated Number */}
        <motion.div
          className="text-3xl md:text-4xl font-medium text-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
        >
          {stat.value === 4.9 ? count.toFixed(1) : count}
          <span className="text-primary">{stat.suffix}</span>
        </motion.div>

        {/* Label */}
        <motion.h3
          className="text-lg font-medium text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
        >
          {stat.label}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-muted-foreground text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
        >
          {stat.description}
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          className="mt-4 h-1 bg-muted/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 + 1 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${(count / stat.value) * 100}%` } : {}}
            transition={{ duration: 2, delay: index * 0.2 + 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}