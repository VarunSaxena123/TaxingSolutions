import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'
//import DarKTOGGLE from './DarKTOGGLE'
export function Footer() {
  const { ref, isInView } = useInView(0.2)

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Instagram, href: '#' }
  ]

  const quickLinks = ['About', 'Services', 'Contact', 'Careers']

  return (
    <>
    <footer className="w-full bg-gray-900 text-white py-12 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1 md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black font-medium">TS</span>
              </div>
              <span className="ml-2 text-xl font-medium">TaxingSolutions</span>
            </motion.div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted business partner providing innovative solutions and exceptional service to help your company thrive.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <motion.a 
                    href={`#${link.toLowerCase()}`} 
                    className="hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {link}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-medium mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              {[
                '123 Business Avenue, Building 9',
                'Gurugram, IN 122018',
                'Phone: +91 9876543210',
                'Email: contact@taxingsolutions.com'
              ].map((info, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  {info}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>&copy; 2025 TaxingSolutions. All rights reserved.</p>
        </motion.div>
      </div>

      
    </footer>
    </>
  )
}