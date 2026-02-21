"use client";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Edit3, Check } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const Hero = ({ herName: defaultHerName = "Lyraa" }) => {
    const { data, updateData, isEditMode } = useAdmin();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef(null);
    const ticking = useRef(false);

    const [editMode, setEditMode] = useState(false);
    const [tempData, setTempData] = useState({
        herName: data?.hero?.herName || defaultHerName,
        quote: data?.hero?.quote || "You are my favorite everything."
    });

    // Sync tempData when external data changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempData({
            herName: data?.hero?.herName || defaultHerName,
            quote: data?.hero?.quote || "You are my favorite everything."
        });
    }, [data?.hero?.herName, data?.hero?.quote, defaultHerName]);

    const herName = data?.hero?.herName || defaultHerName;
    const quote = data?.hero?.quote || "You are my favorite everything.";

    useEffect(() => {
        let animationFrameId;
        const handleMouseMove = (e) => {
            if (!ticking.current) {
                animationFrameId = window.requestAnimationFrame(() => {
                    setMousePos({
                        x: (e.clientX / window.innerWidth - 0.5) * 20,
                        y: (e.clientY / window.innerHeight - 0.5) * 20,
                    });
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const words = useMemo(() => quote.split(" "), [quote]);

    const handleSave = () => {
        updateData({ ...data, hero: tempData });
        setEditMode(false);
    };

    return (
        <section ref={sectionRef} className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-bg-primary">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div 
                    className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-rose/5 rounded-full blur-[120px] animate-pulse-slow"
                    style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)` }}
                />
                <div 
                    className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-gold/5 rounded-full blur-[100px] animate-pulse-slow"
                    style={{ animationDelay: '2s', transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
                />
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6">
                
                {/* Edit Controls */}
                {isEditMode && (
                    <div className="absolute top-4 right-4 md:top-[-100px] md:right-[-100px] animate-fade-in z-50">
                        <button
                            onClick={() => editMode ? handleSave() : setEditMode(true)}
                            className="p-3 md:p-4 glass rounded-full text-gold hover:bg-gold hover:text-bg-primary transition-all duration-300 shadow-lg border border-gold/20 group"
                        >
                            {editMode ? <Check size={20} /> : <Edit3 size={20} />}
                            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gold text-bg-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {editMode ? "Save Changes" : "Edit Hero"}
                            </span>
                        </button>
                    </div>
                )}

                {editMode ? (
                    <div className="flex flex-col gap-8 w-full animate-fade-in-up">
                        <div className="space-y-2">
                            <label className="text-gold/50 text-xs uppercase tracking-widest font-bold">Her Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-gold/30 p-4 md:p-6 rounded-2xl text-cream text-4xl md:text-7xl font-display text-center outline-none focus:border-gold focus:bg-white/10 transition-all placeholder:text-white/10"
                                value={tempData.herName}
                                onChange={(e) => setTempData({ ...tempData, herName: e.target.value })}
                                placeholder="Enter Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gold/50 text-xs uppercase tracking-widest font-bold">Subtitle Quote</label>
                            <textarea
                                className="w-full bg-white/5 border border-gold/30 p-6 rounded-2xl text-cream/80 text-xl md:text-2xl font-body text-center outline-none focus:border-gold focus:bg-white/10 transition-all resize-none placeholder:text-white/10"
                                value={tempData.quote}
                                onChange={(e) => setTempData({ ...tempData, quote: e.target.value })}
                                rows={2}
                                placeholder="Enter a beautiful quote..."
                            />
                        </div>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setEditMode(false)} className="px-8 py-3 rounded-full border border-rose/30 text-rose hover:bg-rose hover:text-white transition-all text-sm uppercase tracking-widest font-bold">Cancel</button>
                            <button onClick={handleSave} className="px-8 py-3 rounded-full bg-gold text-bg-primary hover:bg-white transition-all text-sm uppercase tracking-widest font-bold shadow-lg shadow-gold/20">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Name - The Centerpiece */}
                        <div className="relative mb-8 md:mb-12">
                            <h1 
                                className="text-[15vw] md:text-[12rem] leading-[0.8] font-display font-medium text-transparent bg-clip-text bg-gradient-to-b from-cream via-rose/10 to-transparent opacity-0 animate-reveal-hero mix-blend-overlay"
                                style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
                            >
                                {herName}
                            </h1>
                            <h1 
                                className="absolute inset-0 text-[15vw] md:text-[12rem] leading-[0.8] font-display font-medium text-stroke-gold opacity-0 animate-reveal-hero-delay pointer-events-none"
                                style={{ transform: `translate(${mousePos.x * 4}px, ${mousePos.y * 4}px)` }}
                            >
                                {herName}
                            </h1>
                        </div>

                        {/* Quote - Elegant Subtitle */}
                        <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4 max-w-2xl">
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className="text-lg md:text-2xl font-body font-light text-gold/80 tracking-widest uppercase opacity-0 animate-reveal-text"
                                    style={{ animationDelay: `${i * 0.1 + 1.5}s` }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>

                        {/* Decorative Line */}
                        <div className="w-[1px] h-24 bg-gradient-to-b from-gold/50 to-transparent mt-16 opacity-0 animate-grow-line" style={{ animationDelay: '2.5s' }} />
                        
                        {/* Scroll Indicator */}
                        <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '3s' }}>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/50">Scroll to Begin</span>
                            <div className="w-6 h-10 rounded-full border border-gold/30 flex justify-center p-1">
                                <div className="w-1 h-2 bg-gold rounded-full animate-scroll-dot" />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .text-stroke-gold {
                    -webkit-text-stroke: 1px rgba(212, 175, 122, 0.3);
                    color: transparent;
                }
                @keyframes reveal-hero {
                    0% { opacity: 0; transform: scale(0.9) translateY(50px); filter: blur(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                }
                @keyframes reveal-hero-delay {
                    0% { opacity: 0; transform: scale(0.95) translateY(50px); filter: blur(20px); }
                    100% { opacity: 0.5; transform: scale(1) translateY(0); filter: blur(0); }
                }
                @keyframes reveal-text {
                    0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                @keyframes grow-line {
                    0% { height: 0; opacity: 0; }
                    100% { height: 6rem; opacity: 0.5; }
                }
                @keyframes scroll-dot {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(16px); opacity: 0; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-reveal-hero { animation: reveal-hero 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-reveal-hero-delay { animation: reveal-hero-delay 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 0.5s; }
                .animate-reveal-text { animation: reveal-text 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-grow-line { animation: grow-line 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-scroll-dot { animation: scroll-dot 2s infinite; }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </section>
    );
};

export default React.memo(Hero);