'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.4,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="splash-container">
      <style>{`
        .splash-container {
          position: fixed;
          inset: 0;
          background: #0A0A0E;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 9999;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Sparkles / Particles */
        .particles-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          background: #D4A843;
          border-radius: 50%;
          filter: blur(0.5px);
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes spinThorns {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Ambient background glow */
        .ambient-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 168, 67, 0.08) 0%, transparent 70%);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          filter: blur(40px);
        }

        /* Main Glass Card */
        .splash-card {
          width: 90%;
          max-width: 460px;
          background: rgba(15, 15, 20, 0.7);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          
          /* Refractive border gradient for 3D liquid glass effect */
          border: 1px solid transparent;
          background-image: 
            linear-gradient(rgba(15, 15, 20, 0.7), rgba(15, 15, 20, 0.7)), 
            linear-gradient(135deg, rgba(212, 168, 67, 0.7) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0.05) 70%, rgba(212, 168, 67, 0.7) 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.8), 
            inset 0 0 24px rgba(212, 168, 67, 0.06),
            inset 0 1px 1px rgba(255, 255, 255, 0.25);
          border-radius: 32px;
          padding: 24px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
          animation: cardEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEntrance {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Logo Area */
        .logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }
        .logo-circle {
          width: 64px;
          height: 64px;
          margin-bottom: 4px;
          filter: drop-shadow(0 0 16px rgba(212, 168, 67, 0.45));
          position: relative;
        }
        .thorns-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180%;
          height: 180%;
          transform: translate(-50%, -50%);
          object-fit: contain;
          opacity: 0.8;
          z-index: 0;
          animation: spinThorns 20s linear infinite;
        }

        /* Text Content */
        .title-text {
          font-family: var(--font-display, 'Outfit'), sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #D4A843;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }
        .quote-kiny {
          font-size: 18px;
          font-style: italic;
          color: #FFFFFF;
          line-height: 1.6;
          margin-bottom: 12px;
          font-weight: 400;
          opacity: 0.95;
        }
        .quote-eng {
          font-size: 14px;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 24px;
          font-weight: 300;
        }

        /* Button */
        .btn-connect {
          width: 80%;
          max-width: 280px;
          background: linear-gradient(180deg, #D4A843 0%, #A37A24 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-top-color: rgba(255, 255, 255, 0.4);
          border-radius: 999px;
          padding: 18px 32px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 
            0 8px 24px rgba(212, 168, 67, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.25s ease;
          margin-bottom: 28px;
          outline: none;
        }
        .btn-connect:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 28px rgba(212, 168, 67, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          background: linear-gradient(180deg, #E8C876 0%, #B08A2E 100%);
        }
        .btn-connect:active {
          transform: translateY(0);
        }

        /* Footer */
        .footer-text {
          font-size: 11px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.35);
          font-weight: 400;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* Dynamic Sparkles */}
      <div className="particles-bg">
        {particles.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="ambient-glow" />

      {/* Main Frosted Card */}
      <div className="splash-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-circle">
            <img src="/thorns.png" alt="Thorns" className="thorns-bg" />
            <img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
          </div>
        </div>

        {/* Title */}
        <h1 className="title-text">Shining Ministries</h1>

        {/* Kinyarwanda Quote */}
        <p className="quote-kiny">
          &ldquo;Byuka, urabagirane, kuko umucyo wawe waje.&rdquo;
        </p>

        {/* English Translation */}
        <p className="quote-eng">
          Arise, shine, for your light has come. &mdash; Isaiah 60:1
        </p>

        {/* Action Button */}
        <button className="btn-connect" onClick={() => router.push('/login')}>
          Connect
        </button>

        {/* Small Footer Inside Card */}
        <div className="footer-text">
          Shining Ministries &copy; 2026
          <br />
          Shining Digital Platform
        </div>
      </div>
    </div>
  );
}
