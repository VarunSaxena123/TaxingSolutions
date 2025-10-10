import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'

export function TrustedBrands() {
  const { ref, isInView } = useInView(0.3)

  // Professional brand logos - using placeholder data that represents real enterprise companies
  const brands = [
    { name: 'Microsoft', logo: '⊞' },
    { name: 'Amazon', logo: '⧨' },
    { name: 'Google', logo: '◉' },
    { name: 'IBM', logo: '▣' },
    { name: 'Oracle', logo: '◎' },
    { name: 'Salesforce', logo: '☁' },
    { name: 'Adobe', logo: '◆' },
    { name: 'SAP', logo: '▲' },
    { name: 'Cisco', logo: '◈' },
    { name: 'Intel', logo: '◐' },
    { name: 'Dell', logo: '◪' },
    { name: 'HP', logo: '◉' }
  ]

  return (
    <section className="py-16 bg-background border-y border-border/50" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-medium text-foreground mb-3">
            Trusted by Industry Leaders
          </h3>
          <p className="text-muted-foreground">
            Join 500+ companies that trust Taxing Solutions to drive their business transformation
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling brands container */}
          <div className="flex space-x-12 animate-scroll">
            {/* First set */}
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center justify-center min-w-[120px] h-20 group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Logo placeholder */}
                <div className="w-12 h-12 mb-2 bg-muted/50 rounded-lg flex items-center justify-center text-2xl text-muted-foreground group-hover:text-foreground group-hover:bg-primary/10 transition-all duration-300">
                  {brand.logo}
                </div>
                {/* Brand name */}
                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.name}
                </div>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless scrolling */}
            {brands.map((brand, index) => (
              <motion.div
                key={`duplicate-${index}`}
                className="flex flex-col items-center justify-center min-w-[120px] h-20 group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 mb-2 bg-muted/50 rounded-lg flex items-center justify-center text-2xl text-muted-foreground group-hover:text-foreground group-hover:bg-primary/10 transition-all duration-300">
                  {brand.logo}
                </div>
                <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-2xl font-medium text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Enterprise Clients</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-medium text-foreground">98%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-medium text-foreground">$2.5B+</div>
            <div className="text-sm text-muted-foreground">Value Created</div>
          </div>
        </motion.div>
      </div>

      <style>
        {`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}
      </style>
    </section>
  )
}