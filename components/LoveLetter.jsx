"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Plus, Trash2, Edit3, Save, ChevronLeft, ChevronRight, Mail } from 'lucide-react';

const LoveLetter = () => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editMode, setEditMode] = useState(false);

    // Memoize letters to ensure reference stability
    const letters = useMemo(() => {
        return data?.letters || [
            { title: "First Note", content: "You are amazing.", date: "Today", signature: "Me" }
        ];
    }, [data?.letters]);

    // Memoize currentLetter
    const currentLetter = useMemo(() => {
        return letters[currentIndex] || letters[0] || { title: "", content: "", date: "", signature: "" };
    }, [letters, currentIndex]);

    const [tempLetter, setTempLetter] = useState(currentLetter);

    // Sync tempLetter when currentLetter changes, but only if not in local edit mode
    useEffect(() => {
        setTempLetter(currentLetter);
    }, [currentLetter]);

    const handleSave = () => {
        const newLetters = [...letters];
        newLetters[currentIndex] = tempLetter;
        updateData({ ...data, letters: newLetters });
        setEditMode(false);
    };

    const handleAddLetter = () => {
        const newLetter = {
            id: Date.now(),
            title: "New Letter",
            content: "Write something beautiful here...",
            date: new Date().toLocaleDateString(),
            signature: data?.hero?.yourName || "Yuki"
        };
        addItem('letters', newLetter);
        setCurrentIndex(letters.length);
        setEditMode(true);
    };

    const nextLetter = () => setCurrentIndex((prev) => (prev + 1) % letters.length);
    const prevLetter = () => setCurrentIndex((prev) => (prev - 1 + letters.length) % letters.length);

    return (
        <section className="py-40 px-4 bg-bg-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex flex-col items-center mb-20 text-center">
                    <span className="text-gold tracking-[0.8em] uppercase text-xs mb-8 block font-body">The Archives of Us</span>
                    <h2 className="text-5xl md:text-7xl font-display text-cream italic">Love Letters</h2>
                </div>

                <div className="relative group">
                    <div className="glass p-12 md:p-24 rounded-[4rem] border-white/5 relative shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-center">

                        {/* Edit Buttons */}
                        {isEditMode && (
                            <div className="absolute top-10 right-10 z-30 flex gap-4">
                                <button
                                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                                    className="p-4 bg-white/5 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all shadow-xl"
                                >
                                    {editMode ? <Save size={20} /> : <Edit3 size={20} />}
                                </button>
                                <button
                                    onClick={() => deleteItem('letters', currentIndex)}
                                    className="p-4 bg-white/5 text-rose rounded-full hover:bg-rose hover:text-white transition-all shadow-xl"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={handleAddLetter}
                                    className="p-4 bg-gold text-bg-primary rounded-full hover:scale-110 transition-all shadow-xl"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        )}

                        {editMode ? (
                            <div className="space-y-10 animate-reveal">
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-gold/20 p-6 rounded-2xl text-gold text-4xl font-display text-center outline-none"
                                    value={tempLetter.title}
                                    onChange={(e) => setTempLetter({ ...tempLetter, title: e.target.value })}
                                    placeholder="Letter Title..."
                                />
                                <textarea
                                    className="w-full bg-white/5 border border-gold/10 p-10 rounded-[3rem] text-cream/80 text-2xl font-display italic leading-relaxed outline-none focus:border-gold h-80"
                                    value={tempLetter.content}
                                    onChange={(e) => setTempLetter({ ...tempLetter, content: e.target.value })}
                                    placeholder="Pour your heart out here..."
                                />
                                <div className="flex flex-col md:flex-row gap-6 mt-12">
                                    <input
                                        type="text"
                                        className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-gold text-center italic"
                                        value={tempLetter.date}
                                        onChange={(e) => setTempLetter({ ...tempLetter, date: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl text-cream text-center text-3xl font-display"
                                        value={tempLetter.signature}
                                        onChange={(e) => setTempLetter({ ...tempLetter, signature: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="animate-reveal text-center md:text-left">
                                <div className="flex justify-center mb-16 opacity-30">
                                    <Mail size={64} className="text-gold" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-display italic text-gold mb-12 text-center underline decoration-gold/20 underline-offset-8">
                                    {currentLetter.title}
                                </h3>
                                <div className="space-y-12 text-2xl md:text-3xl font-display italic text-cream/80 leading-[2] whitespace-pre-wrap px-4">
                                    {currentLetter.content}
                                </div>

                                <div className="mt-24 pt-16 border-t border-white/5 flex flex-col items-center">
                                    <p className="text-gold/60 font-body tracking-[0.4em] uppercase text-[10px] mb-4">
                                        {currentLetter.date}
                                    </p>
                                    <p className="text-5xl md:text-6xl font-display text-cream tracking-tight italic">
                                        {currentLetter.signature}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    {letters.length > 1 && !editMode && (
                        <>
                            <button
                                onClick={prevLetter}
                                className="absolute left-[-40px] md:left-[-100px] top-1/2 -translate-y-1/2 p-4 text-gold/30 hover:text-gold transition-all hover:scale-125"
                            >
                                <ChevronLeft size={60} strokeWidth={1} />
                            </button>
                            <button
                                onClick={nextLetter}
                                className="absolute right-[-40px] md:right-[-100px] top-1/2 -translate-y-1/2 p-4 text-gold/30 hover:text-gold transition-all hover:scale-125"
                            >
                                <ChevronRight size={60} strokeWidth={1} />
                            </button>
                        </>
                    )}
                </div>

                {/* Letter Pager */}
                {!editMode && (
                    <div className="mt-16 flex justify-center gap-4">
                        {letters.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-12 bg-gold shadow-[0_0_10px_#d4af7a]' : 'w-2 bg-white/10'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(LoveLetter);
