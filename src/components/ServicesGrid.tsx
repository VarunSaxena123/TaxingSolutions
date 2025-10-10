import { 
  Briefcase, Users, Target, TrendingUp, BarChart3, Lightbulb,
  Shield, Globe, Code, PenTool, Megaphone, HeadphonesIcon
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'

export function ServicesGrid() {
  const { ref, isInView } = useInView(0.1)

  const services = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "GST Filing",
      description: "GST (Good and Service Tax) is a tax implemented on the goods and services used in India.",
      features: ["Market Analysis", "Growth Planning", "Competitive Strategy"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Private Limited Company Registration",
      description: "Take your FIRST STEP towards entrepreneurship. Get your Company Registration Online in 7 working days, the fastest incorporation across India.",
      features: ["Leadership Training", "Team Building", "Performance Management"]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "FSSAI (Food License)",
      description: "In Food Sector Having A FSSAI Licence Is A Must!! FSSAI stands for Food Safety & Standard Authority of India, an autonomous body which was established under Ministry of Health & Family Welfare, GOI.",
      features: [ "Competitor Analysis", "Trend Forecasting"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trademark  Registration",
      description: "Is your Business safe? Protect your business from copy cats by filing brand name registration with Taxing Solutions Legal Consultants.",
      features: ["Revenue Optimization", "Scalability Planning", "Process Improvement"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "MSME - Udyam Registration",
      description: "Avail the benifits of Government schemes and subsidies exclusively for Micro, Small and Medium scale enterprises with Udyam Registration.",
      features: ["Financial Planning", "Budget Management", "Investment Strategy"]
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Import & Export Code (IEC)",
      description: "If your Business is into Import & Export of goods, the having an IEC Code License Number is necessary. Get your IEC Code Registration Online with us.",
      features: ["Innovation Strategy", "R&D Management", "Product Development"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Comprehensive risk assessment and mitigation strategies to protect your business interests.",
      features: ["Risk Assessment", "Compliance Management", "Security Consulting"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "ROC Compliances",
      description: "Its the time to run your business in more legalized and tension-free manner. Get GST Registration hustle free and become registered Supplier of Goods & Services.",
      features: ["Market Entry", "International Strategy", "Cultural Adaptation"]
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Income Tax Returns",
      description: "Technology integration and digital strategy consulting to modernize your business operations.",
      features: ["Technology Strategy", "Digital Process", "System Integration"]
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "E-Tendering",
      description: "Complete brand strategy and identity development to establish strong market presence.",
      features: ["Brand Strategy", "Identity Design", "Market Positioning"]
    },
    {
      icon: <Megaphone className="w-8 h-8" />,
      title: "Investment Plans",
      description: "Comprehensive marketing planning and campaign management to drive customer acquisition and retention.",
      features: ["Campaign Strategy", "Customer Acquisition", "Retention Programs"]
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: "Insurance",
      description: "Customer journey optimization and experience design to enhance satisfaction and loyalty.",
      features: ["Journey Mapping", "Experience Design", "Customer Analytics"]
    }
  ]

  return (
    <section className="w-full py-16 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Icon */}
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-lg mb-4 group-hover:bg-primary/20 transition-colors"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring", stiffness: 100 }}
              >
                {service.icon}
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      className="text-xs text-muted-foreground flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 + featureIndex * 0.1 }}
                    >
                      <div className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Scroll to contact section or open contact form
                    const contactSection = document.getElementById('contact')
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
        

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl font-medium text-foreground mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Don't see exactly what you're looking for? We create tailored solutions for unique business challenges.
          </p>
          <motion.button
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const contactSection = document.getElementById('contact')
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Contact Us for Custom Solutions
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}