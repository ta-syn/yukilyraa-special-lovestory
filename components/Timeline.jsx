"use client";
import React, { useState } from 'react';
import { Gamepad2, Instagram, Heart, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const iconMap = {
    Gamepad2: <Gamepad2 size={24} />,
    Instagram: <Instagram size={24} />,
    Heart: <Heart size={24} />,
    Sparkles: <Sparkles size={24} />,
};

const TimelineCard = React.memo(({ item, index, onDelete, onUpdate, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(item);

    const handleSave = () => {
        onUpdate(index, editedItem);
        setIsEditing(false);
    };

    return (
        <div className={`relative flex flex-col md:flex-row items-center gap-12 group reveal active ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`} style={{ transitionDelay: `${index * 0.2}s` }}>

            {/* Content */}
            <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className="glass p-10 md:p-14 rounded-[3rem] border-white/5 hover:border-gold/20 transition-all duration-1000 w-full relative group">
                    <div className="absolute top-10 right-10 text-gold/20 flex items-center justify-center">
                        {iconMap[item.icon] || <Heart size={24} />}
                    </div>

                    {isEditMode && (
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                            >
                                {isEditing ? <Plus size={14} className="rotate-45" /> : <Sparkles size={14} />}
                            </button>
                            <button
                                onClick={() => onDelete(index)}
                                className="p-2 bg-rose/20 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                className="bg-white/5 border border-gold/30 p-2 rounded text-gold text-xs font-body tracking-[0.5em] uppercase w-full"
                                value={editedItem.date}
                                onChange={(e) => setEditedItem({ ...editedItem, date: e.target.value })}
                                placeholder="DATE"
                            />
                            <input
                                type="text"
                                className="bg-white/5 border border-gold/30 p-2 rounded text-cream text-2xl font-display w-full"
                                value={editedItem.title}
                                onChange={(e) => setEditedItem({ ...editedItem, title: e.target.value })}
                                placeholder="TITLE"
                            />
                            <textarea
                                className="bg-white/5 border border-gold/30 p-2 rounded text-cream/50 font-body text-sm w-full h-24"
                                value={editedItem.description}
                                onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                                placeholder="DESCRIPTION"
                            />
                            <input
                                type="text"
                                className="bg-white/5 border border-gold/30 p-2 rounded text-gold/60 text-[10px] uppercase tracking-widest w-full"
                                value={editedItem.location}
                                onChange={(e) => setEditedItem({ ...editedItem, location: e.target.value })}
                                placeholder="LOCATION"
                            />
                            <button
                                onClick={handleSave}
                                className="mt-2 p-2 bg-gold text-bg-primary rounded font-bold uppercase text-xs hover:bg-white transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-gold tracking-[0.5em] uppercase text-[10px] mb-6 block font-body">{item.date}</span>
                            <h3 className="text-4xl font-display text-cream mb-6 tracking-wide italic">{item.title}</h3>
                            <p className="text-cream/50 font-body leading-relaxed text-lg mb-8 italic">&quot;{item.description}&quot;</p>

                            <div className="flex items-center gap-3 text-gold/60 text-[10px] uppercase tracking-widest">
                                <div className="w-8 h-[1px] bg-gold/30" />
                                {item.location}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Center Marker */}
            <div className="absolute left-[20px] md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                <div className="w-4 h-4 rounded-full bg-bg-primary border-2 border-gold relative">
                    <div className="absolute inset-[-8px] rounded-full border border-gold/20 animate-ping" />
                </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block w-1/2" />
        </div>
    );
});
TimelineCard.displayName = "TimelineCard";

const Timeline = () => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ date: '', title: '', description: '', location: '', icon: 'Heart' });

    const handleAdd = () => {
        addItem('timeline', newItem);
        setNewItem({ date: '', title: '', description: '', location: '', icon: 'Heart' });
        setShowAdd(false);
    };

    const handleDelete = React.useCallback((idx) => {
        deleteItem('timeline', idx);
    }, [deleteItem]);

    const handleUpdate = React.useCallback((idx, updatedItem) => {
        const newTimeline = [...data.timeline];
        newTimeline[idx] = updatedItem;
        updateData({ ...data, timeline: newTimeline });
    }, [data, updateData]);

    return (
        <section id="story" className="py-40 px-4 bg-bg-primary relative overflow-hidden">
            {/* Central Guide Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden md:block" />

            <div className="max-w-7xl mx-auto relative text-center">
                <div className="flex flex-col items-center mb-32 reveal active">
                    <span className="text-gold tracking-[0.6em] uppercase text-xs mb-8 block">The Chronology of Us</span>
                    <h2 className="text-6xl md:text-8xl font-display text-cream">How It All Began</h2>
                    <div className="w-24 h-[1px] bg-gold/20 mt-12" />
                </div>

                <div className="space-y-32">
                    {(data?.timeline || []).map((item, index) => (
                        <TimelineCard
                            key={index}
                            item={item}
                            index={index}
                            isEditMode={isEditMode}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>

                {isEditMode && (
                    <div className="mt-32">
                        {!showAdd ? (
                            <button
                                onClick={() => setShowAdd(true)}
                                className="inline-flex items-center gap-3 px-8 py-4 glass text-gold hover:bg-gold/10 transition-all rounded-full"
                            >
                                <Plus size={20} /> Add Milestone
                            </button>
                        ) : (
                            <div className="glass p-12 rounded-[3.5rem] border-gold/20 max-w-2xl mx-auto text-left space-y-6">
                                <h4 className="text-2xl font-display text-gold italic mb-4">Add New Chapter</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Date (e.g. Late 2025)"
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none"
                                        value={newItem.date}
                                        onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none"
                                        value={newItem.title}
                                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    placeholder="Description"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none h-32"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none"
                                        value={newItem.location}
                                        onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    />
                                    <select
                                        className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none"
                                        value={newItem.icon}
                                        onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                                    >
                                        <option value="Heart">Heart</option>
                                        <option value="Gamepad2">Game</option>
                                        <option value="Instagram">Social</option>
                                        <option value="Sparkles">Magic</option>
                                    </select>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleAdd} className="flex-1 py-4 bg-gold text-bg-primary font-bold rounded-xl hover:scale-[1.02] transition-transform">Create Milestone</button>
                                    <button onClick={() => setShowAdd(false)} className="flex-1 py-4 border border-white/10 text-cream rounded-xl hover:bg-white/5">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(Timeline);
