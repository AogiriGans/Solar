import { useEffect, useMemo, useState } from 'react';
import './App.css';

const PLANETS = [
  { name: 'Merkurius', size: 9,  orbit: 80,  duration: 8,  color: '#a9a19a' },
  { name: 'Venus',     size: 13, orbit: 115, duration: 12, color: '#e8c07a' },
  { name: 'Bumi',      size: 15, orbit: 155, duration: 16, color: '#4a90d9', moon: true },
  { name: 'Mars',      size: 11, orbit: 195, duration: 20, color: '#c1440e' },
  { name: 'Jupiter',   size: 30, orbit: 255, duration: 28, color: '#d4a373' },
  { name: 'Saturnus',  size: 25, orbit: 310, duration: 36, color: '#e0c9a6', ring: true },
  { name: 'Uranus',    size: 20, orbit: 365, duration: 44, color: '#7fd9d9' },
  { name: 'Neptunus',  size: 18, orbit: 415, duration: 52, color: '#3b5bdb' },
];

const STAGE_SIZE = 900;

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return `rgb(${R}, ${G}, ${B})`;
}

export default function App() {
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const s = Math.min(
        (window.innerWidth - 40) / STAGE_SIZE,
        (window.innerHeight - 180) / STAGE_SIZE,
        1
      );
      setScale(Math.max(s, 0.22));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  const shootingStars = useMemo(
    () => [
      { top: '12%', left: '8%',  delay: '0s',   duration: '7s',  width: 130 },
      { top: '25%', left: '55%', delay: '3.5s', duration: '9s',  width: 100 },
      { top: '70%', left: '15%', delay: '6s',   duration: '8s',  width: 150 },
      { top: '45%', left: '75%', delay: '10s',  duration: '11s', width: 90 },
    ],
    []
  );

  return (
    <div className="app">
      <div className="starfield">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {shootingStars.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: s.top,
            left: s.left,
            width: s.width,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}

      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />

      <header className="hud">
        <h1>Tata Surya</h1>
        <p>Sistem Tata Surya · Interactive</p>
      </header>

      <main className="stage-wrap">
        <div className="stage" style={{ transform: `scale(${scale})` }}>
          <div className="sun">
            <div className="sun-glow" />
            <div className="sun-core" />
          </div>

          {PLANETS.map((p) => {
            const animStyle = {
              animationDuration: `${p.duration / speed}s`,
              animationPlayState: paused ? 'paused' : 'running',
            };
            return (
              <div
                key={p.name}
                className={`orbit ${showOrbits ? '' : 'orbit-hidden'}`}
                style={{ width: p.orbit * 2, height: p.orbit * 2, ...animStyle }}
              >
                <div
                  className="planet-anchor"
                  style={{ width: p.size, height: p.size, ...animStyle }}
                >
                  <div
                    className="planet"
                    style={{
                      background: `radial-gradient(circle at 32% 32%, ${p.color}, ${shade(p.color, -55)})`,
                      boxShadow: `0 0 ${p.size}px ${p.color}77, 0 0 ${p.size * 2}px ${p.color}33`,
                    }}
                  />
                  {p.ring && <div className="ring" style={{ borderColor: p.color }} />}
                  {p.moon && (
                    <div className="moon-track">
                      <div className="moon" />
                    </div>
                  )}
                  <span className="label">{p.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="controls">
        <button className="btn" onClick={() => setPaused((v) => !v)}>
          {paused ? '▶ Lanjut' : '⏸ Jeda'}
        </button>

        <div className="slider-wrap">
          <label>Kecepatan</label>
          <input
            type="range"
            min="0.1"
            max="4"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed.toFixed(1)}×</span>
        </div>

        <button className="btn" onClick={() => setShowOrbits((v) => !v)}>
          {showOrbits ? '◌ Sembunyikan Orbit' : '◎ Tampilkan Orbit'}
        </button>
      </footer>
    </div>
  );
}