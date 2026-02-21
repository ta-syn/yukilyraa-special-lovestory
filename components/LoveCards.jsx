"use client";
import React, { useState } from 'react';
import { Trash2, Plus, Heart, Edit3 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { motion } from 'framer-motion';

const FlipCard = React.memo(({ reason, index, onDelete, onUpdate, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedReason, setEditedReason] = useState(reason);

    const handleSave = (e) => {
        e.stopPropagation();
        onUpdate(index, editedReason);
        setIsEditing(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group h-[450px] perspective-[2000px]"
        >
            <div className={`relative h-full w-full transition-all duration-[1.2s] preserve-3d ${isEditing ? 'rotate-y-180' : 'group-hover:rotate-y-180'} cursor-pointer`}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden glass flex flex-col items-center justify-center p-8 border-white/5 group-hover:border-gold/30 transition-colors duration-700">
                    <div className="absolute top-8 left-8 text-gold/20 font-display text-4xl">0{index + 1}</div>

                    <div className="w-20 h-20 rounded-full border border-gold/10 flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 rounded-full bg-gold/5 animate-ping opacity-20" />
                        <Heart className="w-8 h-8 text-gold" fill="currentColor" />
                    </div>

                    <h3 className="text-gold tracking-[0.4em] uppercase text-[10px] font-body mb-4">A Sacred Reason</h3>
                    <div className="w-12 h-[1px] bg-gold/20" />
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 glass-gold border-gold/40 flex flex-col items-center justify-center p-10 text-center shadow-[0_0_50px_rgba(212,175,122,0.15)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

                    {isEditing ? (
                        <div className="relative z-20 w-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                            <textarea
                                className="w-full h-40 bg-white/10 border border-gold/30 p-4 rounded-xl text-cream text-lg font-display italic outline-none resize-none"
                                value={editedReason}
                                onChange={(e) => setEditedReason(e.target.value)}
                            />
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-gold text-bg-primary rounded-full font-bold uppercase text-xs hover:bg-white transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <span className="absolute -top-8 -left-6 text-6xl text-gold/10 font-display">“</span>
                            <p className="text-2xl md:text-3xl font-display italic text-cream leading-relaxed relative z-10">
                                {reason}
                            </p>
                            <span className="absolute -bottom-12 -right-6 text-6xl text-gold/10 font-display">”</span>
                        </div>
                    )}

                    {isEditMode && !isEditing && (
                        <div className="absolute bottom-10 flex gap-2 z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="p-3 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                            >
                                <Edit3 size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                                className="p-3 bg-rose/20 text-rose rounded-full hover:bg-rose hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}

                    <div className="mt-12 w-8 h-[1px] bg-gold/40" />
                </div>
            </div>
        </motion.div>
    );
});
FlipCard.displayName = "FlipCard";

const LoveCards = () => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [newReason, setNewReason] = useState("");

    const handleAdd = () => {
        if (newReason.trim()) {
            addItem('reasons', newReason);
            setNewReason("");
        }
    };

    const handleDelete = React.useCallback((idx) => {
        deleteItem('reasons', idx);
    }, [deleteItem]);

    const handleUpdate = React.useCallback((idx, newReasonText) => {
        const newReasons = [...data.reasons];
        newReasons[idx] = newReasonText;
        updateData({ ...data, reasons: newReasons });
    }, [data, updateData]);

    return (
        <section className="py-32 px-4 bg-bg-secondary relative overflow-hidden">
            {/* Decorative side text */}
            <div className="absolute left-[-5%] top-1/2 -rotate-90 text-[10rem] font-display text-white/[0.02] pointer-events-none whitespace-nowrap uppercase">
                Eternal Devotion • Eternal Devotion
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-24 text-center">
                    <span className="text-gold tracking-[0.5em] uppercase text-xs mb-6 block font-body">Personal Confessions</span>
                    <h2 className="text-5xl md:text-7xl font-display text-cream mb-8">Reasons I Love You</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-gold/30" />
                        <div className="w-2 h-2 rounded-full bg-gold/50" />
                        <div className="w-12 h-[1px] bg-gold/30" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {(data?.reasons || []).map((reason, index) => (
                        <FlipCard
                            key={index}
                            reason={reason}
                            index={index}
                            isEditMode={isEditMode}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}

                    {isEditMode && (
                        <div className="h-[450px] glass border-dashed border-gold/30 flex flex-col items-center justify-center p-8 text-center rounded-[3rem]">
                            <Heart className="text-gold/20 mb-6" size={48} />
                            <textarea
                                placeholder="Enter a new reason..."
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none h-32 mb-6 text-center text-lg italic"
                                value={newReason}
                                onChange={(e) => setNewReason(e.target.value)}
                            />
                            <button
                                onClick={handleAdd}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-bg-primary rounded-full font-bold hover:scale-105 transition-transform"
                            >
                                <Plus size={18} /> Add Reason
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
        </section>
    );
};

export default React.memo(LoveCards);
