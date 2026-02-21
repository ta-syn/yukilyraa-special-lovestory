"use client";
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const PromiseItem = React.memo(({ promise, index, onDelete, onUpdate, isEditMode }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPromise, setEditedPromise] = useState(promise);

    const handleSave = () => {
        onUpdate(index, editedPromise);
        setIsEditing(false);
    };

    return (
        <div
            className="reveal active"
            style={{ transitionDelay: `${index * 0.15}s` }}
        >
            <div className="glass group p-8 md:p-12 rounded-[2.5rem] border-white/5 hover:border-gold/30 transition-all duration-1000 flex flex-col md:flex-row items-center gap-6 md:gap-10 hover:bg-gold/[0.02] relative text-center md:text-left">
                <div className="flex-shrink-0 w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg-primary transition-all duration-700">
                    <span className="text-2xl font-light">✦</span>
                </div>

                {isEditing ? (
                    <div className="flex-1 w-full flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="text"
                            className="flex-1 bg-white/5 border border-gold/30 p-3 rounded-xl text-2xl font-display text-cream italic outline-none"
                            value={editedPromise}
                            onChange={(e) => setEditedPromise(e.target.value)}
                        />
                        <button
                            onClick={handleSave}
                            className="p-3 bg-gold text-bg-primary rounded-full hover:bg-white transition-all"
                        >
                            <Save size={20} />
                        </button>
                    </div>
                ) : (
                    <p className="text-2xl md:text-4xl font-display text-cream/90 italic group-hover:text-cream transition-colors duration-700 flex-1">
                        {promise}
                    </p>
                )}

                {isEditMode && !isEditing && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-3 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                        >
                            <Edit3 size={20} />
                        </button>
                        <button
                            onClick={() => onDelete(index)}
                            className="p-3 bg-rose/20 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});
PromiseItem.displayName = "PromiseItem";

const Promises = () => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [newPromise, setNewPromise] = useState("");

    const handleAdd = () => {
        if (newPromise.trim()) {
            addItem('promises', newPromise);
            setNewPromise("");
        }
    };

    const handleDelete = React.useCallback((idx) => {
        deleteItem('promises', idx);
    }, [deleteItem]);

    const handleUpdate = React.useCallback((idx, newPromiseText) => {
        const newPromises = [...data.promises];
        newPromises[idx] = newPromiseText;
        updateData({ ...data, promises: newPromises });
    }, [data, updateData]);

    return (
        <section className="py-40 px-4 bg-bg-primary relative overflow-hidden">
            <div className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full" />

            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center mb-24 text-center reveal active">
                    <span className="text-gold tracking-[0.5em] uppercase text-xs mb-6 block font-body">Sacred Vows</span>
                    <h2 className="text-5xl md:text-7xl font-display text-cream">My Promises to You</h2>
                    <div className="w-16 h-[1px] bg-gold/20 mt-10" />
                </div>

                <div className="space-y-6">
                    {(data?.promises || []).map((promise, index) => (
                        <PromiseItem
                            key={index}
                            promise={promise}
                            index={index}
                            isEditMode={isEditMode}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}

                    {isEditMode && (
                        <div className="reveal active mt-12">
                            <div className="glass p-10 rounded-[2.5rem] border-dashed border-gold/30 flex flex-col md:flex-row gap-6 items-center">
                                <input
                                    type="text"
                                    placeholder="I promise to..."
                                    className="flex-1 bg-white/5 border border-white/10 p-6 rounded-2xl text-2xl font-display italic text-cream outline-none focus:border-gold"
                                    value={newPromise}
                                    onChange={(e) => setNewPromise(e.target.value)}
                                />
                                <button
                                    onClick={handleAdd}
                                    className="px-10 py-6 bg-gold text-bg-primary rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-transform whitespace-nowrap"
                                >
                                    <Plus /> Seal Promise
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default React.memo(Promises);
