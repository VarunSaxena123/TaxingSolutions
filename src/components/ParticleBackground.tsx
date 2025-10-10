import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const updateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
      setParticles(newParticles)
    }

    updateParticles()
    window.addEventListener('resize', updateParticles)

    return () => window.removeEventListener('resize', updateParticles)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#a0d8ef]/30 dark:bg-[#a0d8ef]/20 drop-shadow-[0_0_10px_rgba(160,216,239,0.6)] mix-blend-screen"
          style={{
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          initial={{ x: particle.x, y: particle.y }}
          animate={{
            x: [particle.x, particle.x + 100, particle.x - 50, particle.x],
            y: [particle.y, particle.y - 100, particle.y + 50, particle.y],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Optional Blue Glow Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-transparent to-indigo-200/10 pointer-events-none" />
    </div>
  )
}
