"use client";
import React, { useState } from 'react';
import { Cake, MapPin, Heart, Sparkles, Plus, Trash2, Edit3, Save } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { motion } from 'framer-motion';

const iconMap = {
    Cake: <Cake size={32} />,
    MapPin: <MapPin size={32} />,
    Heart: <Heart size={32} />,
    Sparkles: <Sparkles size={32} />,
};

const MilestoneCard = React.memo(({ item, index, onDelete, onUpdate, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(item);

    const handleSave = () => {
        onUpdate(index, editedItem);
        setIsEditing(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative"
        >
            <div className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-gold/30 transition-all duration-500 h-full flex flex-col items-start gap-6 hover:-translate-y-2 relative overflow-hidden">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg-primary transition-colors duration-500">
                    {iconMap[item.icon] || <Heart size={32} />}
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-4 w-full z-10">
                        <select
                            className="bg-[#1a1a1a] border border-gold/30 p-2 rounded text-cream text-xs outline-none"
                            value={editedItem.icon}
                            onChange={(e) => setEditedItem({ ...editedItem, icon: e.target.value })}
                        >
                            <option value="Cake">Cake</option>
                            <option value="MapPin">MapPin</option>
                            <option value="Heart">Heart</option>
                            <option value="Sparkles">Sparkles</option>
                        </select>
                        <input
                            type="text"
                            className="bg-white/5 border border-gold/30 p-2 rounded text-cream text-lg font-display outline-none"
                            value={editedItem.title}
                            onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                            placeholder="Title"
                        />
                        <input
                            type="text"
                            className="bg-white/5 border border-gold/30 p-2 rounded text-gold/60 text-xs uppercase tracking-widest outline-none"
                            value={editedItem.subtitle}
                            onChange={(e) => setEditedItem({ ...editedItem, subtitle: e.target.value })}
                            placeholder="Subtitle/Date"
                        />
                        <button
                            onClick={handleSave}
                            className="p-2 bg-gold text-bg-primary rounded font-bold uppercase text-xs hover:bg-white transition-colors"
                        >
                            <Save size={16} className="mx-auto" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 z-10">
                        <h3 className="text-2xl font-display text-cream italic">{item.title}</h3>
                        <p className="text-gold/60 text-[10px] uppercase tracking-[0.2em] font-bold">{item.subtitle}</p>
                    </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-500" />

                {isEditMode && !isEditing && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(index)}
                            className="p-2 bg-rose/20 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
});
MilestoneCard.displayName = "MilestoneCard";

const FutureMilestones = () => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ icon: 'Heart', title: '', subtitle: '' });

    const handleAdd = () => {
        if (newItem.title && newItem.subtitle) {
            addItem('futureMilestones', newItem);
            setNewItem({ icon: 'Heart', title: '', subtitle: '' });
            setShowAdd(false);
        }
    };

    const handleDelete = React.useCallback((idx) => {
        deleteItem('futureMilestones', idx);
    }, [deleteItem]);

    const handleUpdate = React.useCallback((idx, updatedItem) => {
        const newMilestones = [...(data?.futureMilestones || [])];
        newMilestones[idx] = updatedItem;
        updateData({ ...data, futureMilestones: newMilestones });
    }, [data, updateData]);

    // Safety check for data
    const milestones = data?.futureMilestones || [];

    return (
        <section className="py-32 px-4 bg-bg-primary relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-rose/20 rounded-full animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-gold/10 rounded-full animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24 reveal active">
                    <h2 className="text-5xl md:text-7xl font-display text-cream mb-6">What Comes Next...</h2>
                    <p className="text-cream/60 font-body italic text-lg md:text-xl max-w-2xl mx-auto">
                        &quot;Our story isn&apos;t just a memory; it&apos;s a map to every beautiful tomorrow.&quot;
                    </p>
                    <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mx-auto mt-10 text-gold animate-bounce">
                        <div className="w-2 h-2 bg-gold rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {milestones.map((item, index) => (
                        <MilestoneCard
                            key={index}
                            item={item}
                            index={index}
                            isEditMode={isEditMode}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                    
                    {isEditMode && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full min-h-[300px]"
                        >
                            {!showAdd ? (
                                <button
                                    onClick={() => setShowAdd(true)}
                                    className="w-full h-full border-2 border-dashed border-gold/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gold/40 hover:text-gold hover:border-gold/50 transition-all hover:bg-gold/5 group"
                                >
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus size={32} />
                                    </div>
                                    <span className="uppercase tracking-widest text-xs font-bold">Add Milestone</span>
                                </button>
                            ) : (
                                <div className="glass p-8 rounded-[2.5rem] border-gold/30 h-full flex flex-col gap-4">
                                    <h4 className="text-gold font-display italic text-xl">New Milestone</h4>
                                    <select
                                        className="bg-[#1a1a1a] border border-gold/30 p-3 rounded-xl text-cream text-sm outline-none"
                                        value={newItem.icon}
                                        onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                                    >
                                        <option value="Cake">Cake (Birthday/Event)</option>
                                        <option value="MapPin">MapPin (Travel)</option>
                                        <option value="Heart">Heart (Love)</option>
                                        <option value="Sparkles">Sparkles (Special)</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="bg-white/5 border border-gold/30 p-3 rounded-xl text-cream outline-none"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subtitle/Date"
                                        className="bg-white/5 border border-gold/30 p-3 rounded-xl text-cream outline-none"
                                        value={newItem.subtitle}
                                        onChange={(e) => setNewItem({ ...newItem, subtitle: e.target.value })}
                                    />
                                    <div className="flex gap-2 mt-auto">
                                        <button 
                                            onClick={handleAdd}
                                            className="flex-1 py-3 bg-gold text-bg-primary rounded-xl font-bold text-xs hover:bg-white transition-colors"
                                        >
                                            Add
                                        </button>
                                        <button 
                                            onClick={() => setShowAdd(false)}
                                            className="flex-1 py-3 border border-white/10 text-cream rounded-xl text-xs hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default React.memo(FutureMilestones);
