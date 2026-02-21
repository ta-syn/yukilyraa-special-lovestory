"use client";
import React, { useEffect, useState } from 'react';

const FloatingPetals = () => {
    const [petals, setPetals] = useState([]);

    useEffect(() => {
        const newPetals = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 15 + Math.random() * 15, // Slower for luxury feel
            size: 15 + Math.random() * 20,
            rotation: Math.random() * 360,
            opacity: 0.2 + Math.random() * 0.3,
            drift: (Math.random() - 0.5) * 200,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPetals(newPetals);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    className="absolute text-rose/60 animate-petal"
                    style={{
                        left: `${petal.left}%`,
                        animationDelay: `${petal.delay}s`,
                        animationDuration: `${petal.duration}s`,
                        transform: `rotate(${petal.rotation}deg)`,
                    }}
                >
                    <svg
                        width={petal.size}
                        height={petal.size}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ opacity: petal.opacity }}
                    >
                        <path d="M12,2C12,2 10,7 5,12C0,17 5,22 12,22C19,22 24,17 19,12C14,7 12,2 12,2Z" />
                    </svg>
                </div>
            ))}
            <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(110vh) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-petal {
          animation: fall linear infinite;
        }
      `}</style>
        </div>
    );
};

export default React.memo(FloatingPetals);
