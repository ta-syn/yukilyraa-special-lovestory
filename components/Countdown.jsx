"use client";
import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, Cake, Calendar, Save } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const Countdown = ({ startDate }) => {
    const { data, updateData, isEditMode } = useAdmin();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [editMode, setEditMode] = useState(false);
    const [tempDate, setTempDate] = useState(startDate);

    // Safe sync prop to state
    useEffect(() => {
        setTempDate(startDate);
    }, [startDate]);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate);
            const now = new Date();
            const difference = Math.abs(now.getTime() - start.getTime());

            const newTime = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };

            // Only update if something actually changed to avoid unnecessary renders
            setTimeLeft(prev => {
                if (prev.days === newTime.days &&
                    prev.hours === newTime.hours &&
                    prev.minutes === newTime.minutes &&
                    prev.seconds === newTime.seconds) return prev;
                return newTime;
            });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [startDate]);

    const handleSaveDate = () => {
        updateData({ ...data, anniversaryDate: tempDate });
        setEditMode(false);
    };

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className="text-5xl md:text-8xl font-display text-gradient-gold relative z-10 font-medium tracking-tighter shimmer-gold">
                    {String(value).padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] md:text-xs font-body tracking-[0.5em] uppercase text-gold opacity-40 mt-4 font-bold">{label}</span>
        </div>
    );

    return (
        <section className="py-40 px-4 bg-bg-primary relative overflow-hidden group">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full animate-slow-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold/10 rounded-full animate-slow-spin-reverse" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-[1px] bg-gold/30" />
                        <Sparkles className="text-gold w-5 h-5 animate-pulse" />
                        <div className="w-12 h-[1px] bg-gold/30" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display text-cream italic mb-6">Every Moment Since...</h2>
                    <p className="text-gold/60 tracking-[0.3em] uppercase text-[10px] font-body bg-white/5 py-2 px-6 rounded-full border border-white/5">
                        Our Time In This Universe
                    </p>
                </div>

                <div className="glass p-10 md:p-20 rounded-[4rem] border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative group">
                    <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {isEditMode && (
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="absolute top-8 right-8 z-20 p-3 bg-white/5 border border-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                        >
                            <Calendar size={18} />
                        </button>
                    )}

                    {isEditMode && editMode ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 group-focus-within:text-gold transition-colors" size={20} />
                                <input
                                    type="date"
                                    className="bg-white/5 border border-gold/30 pl-12 pr-4 py-4 rounded-xl text-cream text-2xl font-display outline-none focus:border-gold"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSaveDate}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-bg-primary rounded-full font-bold text-sm"
                            >
                                <Save size={14} /> Update Date
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
                            <TimeUnit value={timeLeft.days} label="Days of Magic" />
                            <TimeUnit value={timeLeft.hours} label="Hours shared" />
                            <TimeUnit value={timeLeft.minutes} label="Minutes cherished" />
                            <TimeUnit value={timeLeft.seconds} label="Seconds eternal" />
                        </div>
                    )}
                </div>

                <div className="mt-20 flex items-center justify-center gap-4 text-gold/40 scroll-reveal">
                    <MapPin size={14} />
                    <span className="text-xs uppercase tracking-[0.4em] font-body italic">Beyond time and geography</span>
                    <Cake size={14} />
                </div>
            </div>

            <style jsx>{`
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes slow-spin-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .animate-slow-spin { animation: slow-spin 60s linear infinite; }
        .animate-slow-spin-reverse { animation: slow-spin-reverse 40s linear infinite; }
        .shimmer-gold {
          background: linear-gradient(to right, #d4af7a 20%, #fef0e7 50%, #d4af7a 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 8s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>
        </section>
    );
};

export default React.memo(Countdown);
