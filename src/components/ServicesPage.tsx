import { Header } from './Header'
import { ServicesHero } from './ServicesHero'
import { ServiceStats } from './ServiceStats'
import { EnhancedServicesGrid } from './EnhancedServicesGrid'
import { Footer } from './Footer'
//import { DarkModeToggle } from './DarkModeToggle'
import { ScrollProgress } from './ScrollProgress'
import { BackToTop } from './BackToTop'
import { ParticleBackground } from './ParticleBackground'

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-background relative">
      
      {/* Background Effects */}
      <ParticleBackground />
      
      {/* UI Components */}
      <ScrollProgress />
      {/* <DarkModeToggle /> */}
      <BackToTop />
      
      {/* Main Content */}
      <Header />
      <div className="relative z-10 pt-16">
        <ServicesHero />
        <ServiceStats />
        <EnhancedServicesGrid />
        
      </div>
      <Footer />

      {/* Custom cursor script
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const cursor = document.querySelector('.custom-cursor');
              const follower = document.querySelector('.custom-cursor-follower');
              
              document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                setTimeout(() => {
                  follower.style.left = (e.clientX - 20) + 'px';
                  follower.style.top = (e.clientY - 20) + 'px';
                }, 100);
              });
              
              document.addEventListener('mousedown', () => {
                cursor.style.transform = 'scale(0.8)';
                follower.style.transform = 'scale(1.2)';
              });
              
              document.addEventListener('mouseup', () => {
                cursor.style.transform = 'scale(1)';
                follower.style.transform = 'scale(1)';
              });
            });
          `
        }} 
      />*/}
    </div>
  )
}