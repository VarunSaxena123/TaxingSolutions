import { motion } from 'framer-motion';
import { useInView } from './hooks/useInView';
//import { useEffect, useState } from "react";

export function About() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="about" className="w-full py-16 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-full h-[400px] flex items-center justify-center">
              <img 
                src="slide-1.jpg" 
                alt="About Company" 
                className="w-[90%] max-w-4xl h-full object-cover rounded-3xl shadow-lg"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              About Our Company
            </motion.h2>
            <div className="space-y-4 text-gray-800 dark:text-gray-400">
              {[
                "We offer expert business and legal services to support startups and growing enterprises with compliance, documentation, and strategy.",
                "Our team specializes in GST filings, company registrations, and legal documentation for smooth operations.",
                "Let us handle the complexities while you focus on building your vision."
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button 
                className="bg-primary text-white dark:text-black px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More About Us
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
