import { motion } from 'framer-motion'
// import { EnhancedGeometricBackground } from './EnhancedGeometricBackground'
//import { Sparkles, Zap, Target } from 'lucide-react'
import { ParticleBackground } from './ParticleBackground'

export function ServicesHero() {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Enhanced Geometric Background */}
      {/* <EnhancedGeometricBackground /> */}
      
      {/* Floating Icons */}
      {/* <motion.div
        className="absolute top-20 left-20 text-primary/30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles size={24} />
      </motion.div>
       */}
        <ParticleBackground/>
      {/* <motion.div
        className="absolute top-32 right-32 text-accent/40"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Zap size={32} />
      </motion.div>
       */}
      {/* <motion.div
        className="absolute bottom-32 left-32 text-primary/20"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 20, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Target size={28} />
      </motion.div>
       */}
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Floating Badge
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mt-16 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} />
            <span>Premium Business Solutions</span>
          </motion.div>
           */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-medium text-foreground mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="inline-block">Our</span>
            <br />
            <motion.span 
              className="inline-block bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              Services
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Comprehensive business solutions tailored to drive your success and transform your organization
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.button
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.querySelector('#services-grid')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Explore All Services
            </motion.button>
            
            <motion.button
              className="px-8 py-4 bg-transparent border border-foreground/20 text-foreground rounded-xl font-medium hover:bg-foreground/5 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </motion.div>
        <br />
      </div>
      
      {/* Enhanced bottom fade with pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-blue-500 to-accent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
    </section>
  )
}