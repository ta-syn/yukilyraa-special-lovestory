"use client";
import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Edit2, Save } from 'lucide-react';

const IntroOverlay = () => {
    const { data, updateData, isEditMode } = useAdmin();
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [tempIntro, setTempIntro] = useState(data?.intro || { title: "", subtitle: "" });

    const introData = data?.intro || {
        title: "Everything is better because of you.",
        subtitle: "Wait for the moment..."
    };

    useEffect(() => {
        if (!editMode) {
            const timer = setTimeout(() => {
                setIsFading(true);
                setTimeout(() => setIsVisible(false), 1500);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [editMode]);

    const handleSave = (e) => {
        e.stopPropagation();
        updateData({ ...data, intro: tempIntro });
        setEditMode(false);
    };

    if (!isVisible && !isEditMode) return null;

    // If in global edit mode but not actively editing this component, show a minimized trigger
    if (isEditMode && !editMode && !isVisible) {
        return (
            <div className="fixed top-24 left-4 z-[200]">
                <button
                    onClick={() => setEditMode(true)}
                    className="p-3 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all backdrop-blur-md border border-gold/30 flex items-center gap-2"
                >
                    <Edit2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Edit Intro</span>
                </button>
            </div>
        );
    }

    return (
        <div
            className={`fixed inset-0 z-[200] bg-bg-primary flex flex-col items-center justify-center transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1) ${isFading && !editMode ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
                }`}
        >
            {isEditMode && (
                <div className="absolute top-10 right-10 z-[210]">
                    <button
                        onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
                        className="p-4 glass border-gold/30 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                    >
                        <Edit2 size={24} />
                    </button>
                </div>
            )}

            <div className="relative flex flex-col items-center text-center px-6">
                {editMode ? (
                    <div className="space-y-8 glass p-12 rounded-[3rem] border-gold/20 max-w-2xl w-full">
                        <h4 className="text-gold font-display italic text-2xl mb-4">Edit Intro Screen</h4>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-gold/30 p-6 rounded-2xl text-cream text-3xl font-display text-center outline-none"
                            value={tempIntro.title}
                            onChange={(e) => setTempIntro({ ...tempIntro, title: e.target.value })}
                            placeholder="Main Title"
                        />
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-gold/30 p-4 rounded-xl text-gold/60 text-lg font-body text-center outline-none"
                            value={tempIntro.subtitle}
                            onChange={(e) => setTempIntro({ ...tempIntro, subtitle: e.target.value })}
                            placeholder="Subtitle"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-gold text-bg-primary rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <Save size={20} /> Save Intro
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-4xl md:text-7xl font-display italic text-cream mb-8 opacity-0 animate-reveal">
                            {introData.title}
                        </h1>
                        <p className="text-gold/40 tracking-[0.5em] uppercase text-xs md:text-sm font-body opacity-0 animate-reveal-slow">
                            {introData.subtitle}
                        </p>
                    </>
                )}
            </div>

            {/* Decorative Pulse */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose/5 blur-[150px] rounded-full animate-pulse-slow" />
            </div>

            <style jsx>{`
                @keyframes reveal {
                    0% { opacity: 0; transform: translateY(40px) skewY(2deg); filter: blur(20px); }
                    100% { opacity: 1; transform: translateY(0) skewY(0); filter: blur(0); }
                }
                .animate-reveal { animation: reveal 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                .animate-reveal-slow { 
                    animation: reveal 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                    animation-delay: 1s;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default React.memo(IntroOverlay);
