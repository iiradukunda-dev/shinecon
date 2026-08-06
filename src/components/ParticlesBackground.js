'use client';
import { useState, useEffect } from 'react';

export default function ParticlesBackground() {
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
    <>
      <style>{`
        .particles-base-bg {
          position: fixed;
          inset: 0;
          background: #0A0A0E;
          z-index: -1;
        }
        .particles-bg-comp {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .particle-comp {
          position: absolute;
          background: #D4A843;
          border-radius: 50%;
          filter: blur(0.5px);
        }
        .ambient-glow-comp {
          position: fixed;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 168, 67, 0.08) 0%, transparent 70%);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          filter: blur(40px);
          z-index: 0;
        }
        @keyframes floatParticleComp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
      `}</style>
      <div className="particles-base-bg" />
      <div className="ambient-glow-comp" />
      <div className="particles-bg-comp">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle-comp"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `floatParticleComp ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
