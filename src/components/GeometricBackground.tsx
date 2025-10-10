import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Shape {
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  speed: number
  opacity: number
  isSquare: boolean
}

export function GeometricBackground() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      dimensions.width = window.innerWidth;
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight * 0.4 // 40% of viewport height
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // Generate geometric shapes
    const newShapes: Shape[] = []
    for (let i = 0; i < 20; i++) {
      const isSquare = Math.random() > 0.5
      const size = Math.random() * 60 + 20
      
      newShapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.4),
        width: isSquare ? size : size * (Math.random() * 1.5 + 0.5),
        height: isSquare ? size : size * (Math.random() * 1.5 + 0.5),
        rotation: Math.random() * 360,
        speed: Math.random() * 20 + 10,
        opacity: Math.random() * 0.1 + 0.05,
        isSquare
      })
    }
    setShapes(newShapes)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute bg-primary/20 dark:bg-primary/10"
          style={{
            width: shape.width,
            height: shape.height,
            opacity: shape.opacity,
            borderRadius: shape.isSquare ? '0' : '4px'
          }}
          initial={{ 
            x: shape.x, 
            y: shape.y, 
            rotate: shape.rotation 
          }}
          animate={{
            x: [shape.x, shape.x + 200, shape.x - 100, shape.x],
            y: [shape.y, shape.y - 150, shape.y + 100, shape.y],
            rotate: [shape.rotation, shape.rotation + 180, shape.rotation + 360]
          }}
          transition={{
            duration: shape.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Gradient overlay
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/30 to-background/80 " /> */}
    </div>
  )
}