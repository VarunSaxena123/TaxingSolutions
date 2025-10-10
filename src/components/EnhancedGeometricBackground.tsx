// import { motion } from 'framer-motion'
// import { useEffect, useState } from 'react'
// import { type TargetAndTransition } from 'framer-motion'

// interface Shape {
//   id: number
//   x: number
//   y: number
//   width: number
//   height: number
//   rotation: number
//   speed: number
//   opacity: number
//   isSquare: boolean
//   color: string
//   animationType: 'float' | 'rotate' | 'pulse' | 'morph'
// }

// export function EnhancedGeometricBackground() {
//   const [shapes, setShapes] = useState<Shape[]>([])
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const [isDarkMode, setIsDarkMode] = useState(false)

//   // Detect system theme preference
//   useEffect(() => {
//     const matchDark = window.matchMedia('(prefers-color-scheme: dark)')
//     setIsDarkMode(matchDark.matches)

//     const handleChange = (e: MediaQueryListEvent) => {
//       setIsDarkMode(e.matches)
//     }

//     matchDark.addEventListener('change', handleChange)

//     return () => matchDark.removeEventListener('change', handleChange)
//   }, [])

//   useEffect(() => {
//     const updateMousePosition = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY })
//     }

//     window.addEventListener('mousemove', updateMousePosition)

//     const lightColors = [
//       'rgba(59, 130, 246, 0.1)',
//       'rgba(139, 92, 246, 0.1)',
//       'rgba(16, 185, 129, 0.1)',
//       'rgba(245, 101, 101, 0.1)',
//       'rgba(251, 191, 36, 0.1)',
//     ]

//     const darkColors = [
//       'rgba(59, 130, 246, 0.3)',
//       'rgba(139, 92, 246, 0.25)',
//       'rgba(16, 185, 129, 0.2)',
//       'rgba(245, 101, 101, 0.25)',
//       'rgba(251, 191, 36, 0.25)',
//     ]

//     const animationTypes: Shape['animationType'][] = ['float', 'rotate', 'pulse', 'morph']

//     const newShapes: Shape[] = []
//     for (let i = 0; i < 30; i++) {
//       const isSquare = Math.random() > 0.6
//       const size = Math.random() * 80 + 30

//       newShapes.push({
//         id: i,
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * (window.innerHeight * 0.4),
//         width: isSquare ? size : size * (Math.random() * 2 + 0.5),
//         height: isSquare ? size : size * (Math.random() * 2 + 0.5),
//         rotation: Math.random() * 360,
//         speed: isDarkMode ? Math.random() * 20 + 30 : Math.random() * 30 + 15,
//         opacity: isDarkMode ? Math.random() * 0.2 + 0.1 : Math.random() * 0.15 + 0.05,
//         isSquare,
//         color: (isDarkMode ? darkColors : lightColors)[Math.floor(Math.random() * 5)],
//         animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)]
//       })
//     }

//     setShapes(newShapes)

//     return () => window.removeEventListener('mousemove', updateMousePosition)
//   }, [isDarkMode])

//   const getAnimationProps = (shape: Shape): TargetAndTransition => {
//     const baseAnimation = {
//       x: [shape.x, shape.x + 300, shape.x - 150, shape.x],
//       y: [shape.y, shape.y - 200, shape.y + 100, shape.y],
//     }

//     switch (shape.animationType) {
//       case 'float':
//         return {
//           ...baseAnimation,
//           rotate: [shape.rotation, shape.rotation + 90],
//           transition: {
//             duration: shape.speed,
//             repeat: Infinity,
//             ease: 'easeInOut',
//           },
//         }
//       case 'rotate':
//         return {
//           ...baseAnimation,
//           rotate: [0, 360],
//           transition: {
//             duration: shape.speed * 0.5,
//             repeat: Infinity,
//             ease: 'linear',
//           },
//         }
//       case 'pulse':
//         return {
//           ...baseAnimation,
//           scale: [1, 1.5, 1],
//           opacity: [shape.opacity, shape.opacity * 2, shape.opacity],
//           transition: {
//             duration: shape.speed * 0.8,
//             repeat: Infinity,
//             ease: 'easeInOut',
//           },
//         }
//       case 'morph':
//         return {
//           ...baseAnimation,
//           borderRadius: shape.isSquare ? ['0%', '50%', '0%'] : ['10%', '0%', '10%'],
//           rotate: [shape.rotation, shape.rotation + 180, shape.rotation + 360],
//           transition: {
//             duration: shape.speed * 1.2,
//             repeat: Infinity,
//             ease: 'easeInOut',
//           },
//         }
//       default:
//         return {
//           ...baseAnimation,
//           transition: {
//             duration: shape.speed,
//             repeat: Infinity,
//             ease: 'easeInOut',
//           },
//         }
//     }
//   }

//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       {shapes.map((shape) => (
//         <motion.div
//           key={shape.id}
//           className="absolute"
//           style={{
//             width: shape.width,
//             height: shape.height,
//             backgroundColor: shape.color,
//             borderRadius: shape.isSquare ? '8px' : '4px',
//             filter: 'blur(0.5px)',
//           }}
//           initial={{
//             x: shape.x,
//             y: shape.y,
//             rotate: shape.rotation,
//             opacity: shape.opacity,
//           }}
//           animate={getAnimationProps(shape)}
//           whileHover={{
//             scale: 1.2,
//             opacity: shape.opacity * 2,
//             transition: { duration: 0.3 },
//           }}
//         />
//       ))}

//       {/* Mouse follower */}
//       <motion.div
//         className="absolute w-8 h-8 bg-primary/10 rounded-lg pointer-events-none"
//         animate={{
//           x: mousePosition.x - 16,
//           y: mousePosition.y - 16,
//         }}
//         transition={{
//           type: 'spring',
//           damping: 30,
//           stiffness: 200,
//           mass: 0.5,
//         }}
//       />

//       <motion.div
//         className="absolute w-4 h-4 bg-accent/20 rounded-sm pointer-events-none"
//         animate={{
//           x: mousePosition.x - 8,
//           y: mousePosition.y - 8,
//         }}
//         transition={{
//           type: 'spring',
//           damping: 40,
//           stiffness: 300,
//           mass: 0.3,
//         }}
//       />

//       {/* Gradient overlays */}
//       <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/20 to-background/80 pointer-events-none" />
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

//       {/* Animated pattern */}
//       <motion.div
//         className="absolute inset-0 opacity-5"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 25% 25%, var(--primary) 2px, transparent 2px),
//             radial-gradient(circle at 75% 75%, var(--accent) 1px, transparent 1px)
//           `,
//           backgroundSize: '50px 50px, 30px 30px',
//         }}
//         animate={{
//           backgroundPosition: ['0% 0%', '100% 100%'],
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: 'linear',
//         }}
//       />
//     </div>
//   )
// }
