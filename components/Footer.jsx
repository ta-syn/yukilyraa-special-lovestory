"use client";
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const Footer = () => {
    const { data } = useAdmin();
    const [backgroundHearts, setBackgroundHearts] = useState([]);

    const herName = data?.hero?.herName || "Lyraa";

    useEffect(() => {
        const initialHearts = [...Array(15)].map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: 0.5 + Math.random()
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBackgroundHearts(initialHearts);
    }, []);

    return (
        <footer className="py-32 px-4 bg-bg-primary relative overflow-hidden">
            {/* Decorative vertical lines */}
            <div className="absolute top-0 left-10 bottom-0 w-[1px] bg-white/[0.02]" />
            <div className="absolute top-0 right-10 bottom-0 w-[1px] bg-white/[0.02]" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="flex justify-center gap-6 mb-16">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="relative">
                            <Heart
                                size={20}
                                className="text-gold/20 animate-pulse"
                                style={{ animationDelay: `${i * 0.5}s` }}
                            />
                            <div className="absolute inset-0 bg-gold/5 blur-xl animate-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
                        </div>
                    ))}
                </div>

                <p className="text-gold/40 font-body text-[10px] tracking-[0.6em] uppercase mb-8">
                    A Digital Love Letter Crafted for
                </p>

                <div className="relative inline-block mb-16">
                    <h2 className="text-6xl md:text-8xl font-display text-cream italic tracking-tight">
                        My Everything
                    </h2>
                    <div className="absolute -bottom-4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                </div>

                <div className="flex flex-col items-center gap-6">
                    <p className="text-gold font-display text-2xl italic">{herName}</p>
                    <div className="w-8 h-[1px] bg-gold/10" />
                    <p className="text-cream/20 text-[10px] font-body tracking-[0.4em] uppercase">
                        {new Date().getFullYear()} • Beyond Time & Space
                    </p>
                </div>
            </div>

            {/* Subtle floating heart icons in the background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                {backgroundHearts.map((heart) => (
                    <div
                        key={heart.id}
                        className="absolute"
                        style={{
                            top: heart.top,
                            left: heart.left,
                            transform: `scale(${heart.scale})`,
                        }}
                    >
                        ❤
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default React.memo(Footer);
