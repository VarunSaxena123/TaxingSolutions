import { Linkedin, Twitter, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from './hooks/useInView'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function Team() {
  const { ref, isInView } = useInView(0.2)

  const teamMembers = [
    {
      name: "Alex Thompson",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "15+ years of business strategy and leadership experience",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alex@bizcorp.com"
      }
    },
    {
      name: "Sarah Mitchell",
      position: "Head of Strategy",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in market analysis and business development",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@bizcorp.com"
      }
    },
    {
      name: "Marcus Johnson",
      position: "Operations Director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Specializes in operational excellence and process optimization",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "marcus@bizcorp.com"
      }
    },
    {
      name: "Lisa Chen",
      position: "Growth Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Drives growth initiatives and client success programs",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "lisa@bizcorp.com"
      }
    }
  ]

  return (
    <section className="w-full py-16 px-4 bg-muted/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our experienced team of professionals is dedicated to helping your business succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Social overlay */}
                  <motion.div
                    className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  >
                    <div className="flex space-x-4">
                      {[
                        { icon: Linkedin, href: member.social.linkedin },
                        { icon: Twitter, href: member.social.twitter },
                        { icon: Mail, href: `mailto:${member.social.email}` }
                      ].map((social, socialIndex) => (
                        <motion.a
                          key={socialIndex}
                          href={social.href}
                          className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: socialIndex * 0.1 }}
                        >
                          <social.icon size={18} />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="p-6">
                  <h3 className="font-medium text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.position}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}