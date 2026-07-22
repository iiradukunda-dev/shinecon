'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 5,
      opacity: 0.1 + Math.random() * 0.3,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="splash">
      <div className="splash-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="splash-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="splash-glow splash-glow-gold" />
      <div className="splash-glow splash-glow-blue" />

      <div className="splash-logo"><img src="/logo.png" alt="SM" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>

      <h1 className="splash-title">
        <span>SM Connect</span>
      </h1>

      <p className="splash-scripture">
        &ldquo;Byuka, urabagirane, kuko umucyo wawe waje.&rdquo;
        <br />
        <span style={{ opacity: 0.7, fontSize: '0.85em' }}>
          Arise, shine, for your light has come. — Isaiah 60:1
        </span>
      </p>

      <button
        className="splash-enter"
        onClick={() => router.push('/login')}
      >
        Enter SM Connect
      </button>

      <div style={{
        position: 'absolute',
        bottom: 32,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.75rem',
        zIndex: 1,
        animation: 'fadeInUp 0.8s ease 1.2s both',
      }}>
        Shining Ministries &copy; {new Date().getFullYear()}
        <br />Digital Ministry Platform
      </div>
    </div>
  );
}
