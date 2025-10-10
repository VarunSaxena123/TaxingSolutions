import { 
  Briefcase, Users, Target, TrendingUp, BarChart3, Lightbulb,
  Shield, Globe, Code, PenTool, Megaphone, HeadphonesIcon, Grid, List
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from './hooks/useInView'

export function EnhancedServicesGrid() {
  const { ref, isInView } = useInView(0.1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { id: 'all', label: 'All Services', count: 12 },
    { id: 'taxation', label: 'Taxation', count: 2 },
    { id: 'registration', label: 'Registration', count: 2 },
    { id: 'licensing', label: 'Licensing', count: 3 },
    { id: 'legal', label: 'Legal', count: 1 },
    { id: 'compliance', label: 'Compliance', count: 2 },
    { id: 'finance', label: 'Finance', count: 2 }
  ]

  const services = [
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "GST Filing",
    description: "Efficient and accurate GST return filing to keep your business compliant and penalty-free.",
    features: ["Monthly/Quarterly Return Filing", "Input Tax Credit Management", "GSTR-1, GSTR-3B Support"],
    category: "taxation",
    price: "From ₹999/month",
    duration: "Ongoing",
    popularity: 95,
    gradient: "from-cyan-500 to-blue-800",
    
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Pvt. Ltd. Company Registration",
    description: "Fast-track your startup journey with our expert-led company registration services.",
    features: ["DIN & DSC Application", "MOA & AOA Drafting", "MCA Filing"],
    category: "registration",
    price: "From ₹2999 one-time",
    duration: "7 working days",
    popularity: 92,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "FSSAI (Food License)",
    description: "Hassle-free food license (FSSAI) registration for businesses in the food and hospitality sector.",
    features: ["Basic, State & Central License", "Document Preparation", "Application Filing"],
    category: "licensing",
    price: "From ₹1499",
    duration: "5-10 working days",
    popularity: 89,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Trademark Registration",
    description: "Safeguard your brand identity with our comprehensive trademark registration services.",
    features: ["Trademark Search", "Class Selection", "TM Application Filing"],
    category: "legal",
    price: "From ₹3999",
    duration: "7-14 working days",
    popularity: 90,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "MSME - Udyam Registration",
    description: "Register your small business with Udyam to avail government subsidies and tax benefits.",
    features: ["Udyam Certificate Issuance", "Document Assistance", "Govt. Scheme Guidance"],
    category: "registration",
    price: "From ₹999",
    duration: "1-2 working days",
    popularity: 88,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Import & Export Code (IEC)",
    description: "Get your IEC license swiftly to start international trade legally and efficiently.",
    features: ["DGFT Portal Registration", "IEC Code Application", "PAN & Bank Linking"],
    category: "licensing",
    price: "From ₹1299",
    duration: "2-4 working days",
    popularity: 87,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Risk Management",
    description: "Mitigate business risks with expert compliance and advisory services. Risk Management Services.",
    features: ["Regulatory Risk Assessment", "Mitigation Planning", "Compliance Reporting"],
    category: "compliance",
    price: "From ₹2499",
    duration: "2-4 weeks",
    popularity: 80,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "ROC Compliances",
    description: "Stay compliant with Registrar of Companies (ROC) annual and event-based filings.",
    features: ["Annual Returns", "Board Resolutions", "MCA Portal Filing"],
    category: "compliance",
    price: "From ₹1999/year",
    duration: "Ongoing",
    popularity: 85,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Income Tax Returns",
    description: "File your income tax returns accurately and on-time with professional assistance.",
    features: ["ITR-1 to ITR-7 Support", "Capital Gains Filing", "Advance Tax Planning"],
    category: "taxation",
    price: "From ₹599/year",
    duration: "2-3 working days",
    popularity: 93,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <PenTool className="w-8 h-8" />,
    title: "E-Tendering",
    description: "Register and apply for government tenders with ease and accuracy. E-Tendering.",
    features: ["Tender Search", "Bidding Support", "Documentation"],
    category: "licensing",
    price: "From ₹1499",
    duration: "5-7 working days",
    popularity: 84,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <Megaphone className="w-8 h-8" />,
    title: "Investment Plans",
    description: "Explore custom investment strategies tailored to your financial goals.",
    features: ["SIP & Mutual Funds", "Tax-Saving Instruments", "Portfolio Planning"],
    category: "finance",
    price: "From ₹999",
    duration: "1-2 sessions",
    popularity: 86,
    gradient: "from-cyan-500 to-blue-800"
  },
  {
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: "Insurance",
    description: "Protect yourself and your assets with personalized insurance planning and advice.",
    features: ["Life & Health Insurance", "Business Insurance", "Claim Support"],
    category: "finance",
    price: "From ₹499",
    duration: "1-3 days",
    popularity: 88,
    gradient: "from-cyan-500 to-blue-800"
  }
];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  return (
    <section className="w-full py-16 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Filter Controls */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{category.label}</span>
                  <span className="ml-2 text-xs opacity-70">({category.count})</span>
                </motion.button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Grid size={16} />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <List size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Services Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${viewMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.title}
                className={`group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/20 transition-all duration-500 ${
                  viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${service.gradient}`} />
                
                {/* Floating Geometric Shapes */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <motion.div
                    className="w-6 h-6 bg-primary/20 rounded-sm"
                    animate={{ 
                      rotate: [0, 45, 90, 135, 180],
                      scale: [1, 1.1, 1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                <div className={viewMode === 'list' ? 'flex items-center gap-6 w-full' : 'space-y-4'}>
                  {/* Icon with 3D Effect */}
                  <motion.div 
                    className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}
                    whileHover={{ rotateY: 15, rotateX: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        {service.icon}
                      </div>
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                    </div>
                    
                    {/* Popularity Badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
                    >
                      {service.popularity}%
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <div className={`flex-1 ${viewMode === 'list' ? 'grid grid-cols-3 gap-6 items-center' : 'space-y-3'}`}>
                    <div className={viewMode === 'list' ? 'space-y-2' : 'space-y-3'}>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors text-lg">
                        {service.title}
                      </h3>
                      
                      <p className={`text-muted-foreground leading-relaxed ${viewMode === 'list' ? 'text-sm' : ''}`}>
                        {viewMode === 'list' ? service.description.slice(0, 80) + '...' : service.description}
                      </p>
                    </div>

                    {/* Features & Stats */}
                    <div className={viewMode === 'list' ? 'space-y-2' : 'space-y-3'}>
                      {/* Features */}
                      <ul className="space-y-1">
                        {service.features.slice(0, viewMode === 'list' ? 2 : 3).map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="text-xs text-muted-foreground flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 + featureIndex * 0.1 }}
                          >
                            <motion.div 
                              className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"
                              whileHover={{ scale: 1.5 }}
                            />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      {/* Pricing & Duration */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="bg-muted/50 px-2 py-1 rounded">{service.price}</span>
                        <span className="bg-muted/50 px-2 py-1 rounded">{service.duration}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className={viewMode === 'list' ? 'flex justify-end' : ''}>
                      <motion.button
                        className={`bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium group-hover:shadow-lg ${
                          viewMode === 'list' ? 'px-6 py-2 text-sm' : 'w-full px-4 py-3'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const contactSection = document.getElementById('contact')
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' })
                          }
                        }}
                      >
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          Get Started →
                        </motion.span>
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Hover Border Animation */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-2xl"
                  style={{
                    background: `linear-gradient(45deg, transparent, ${service.gradient.includes('blue') ? '#3b82f6' : '#8b5cf6'}, transparent) border-box`,
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'exclude'
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced CTA Section */}
        <motion.div
          className="text-center mt-20 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl" />
          
          <div className="relative z-10 bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-12">
            <motion.h3 
              className="text-3xl font-medium text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Need a Custom Solution?
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Don't see exactly what you're looking for? We create tailored solutions for unique business challenges.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Schedule a Consultation
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-transparent border border-primary text-primary rounded-xl hover:bg-primary/10 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
              >
                View Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}