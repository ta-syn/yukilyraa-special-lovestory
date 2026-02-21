"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { X, Calendar, Sparkles, Home, Plane, ShieldCheck, Stars, Plus, Trash2, Heart, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';

const iconMap = {
    Home: <Home size={32} />,
    Plane: <Plane size={32} />,
    ShieldCheck: <ShieldCheck size={32} />,
    Stars: <Stars size={32} />,
};

const GalleryItem = React.memo(({ img, index, onClick, onDelete, onEdit, isEditMode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group overflow-hidden bg-bg-secondary cursor-pointer ${img.span} reveal active`}
        >
            <div onClick={() => onClick(img)} className="w-full h-full relative">
                <Image
                    src={img.url || `https://picsum.photos/1000/1000?random=${img.id}`}
                    alt={img.caption}
                    fill
                    className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 filter grayscale-[10%] group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 p-8 flex flex-col justify-end">
                    <span className="text-gold tracking-[0.4em] uppercase text-[10px] mb-2 font-body transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">Open Memory</span>
                    <h3 className="text-2xl font-display text-cream italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100">{img.caption}</h3>
                </div>
            </div>

            {isEditMode && (
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(index); }}
                        className="p-2 bg-gold/40 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                        className="p-2 bg-rose/40 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}

            <div className="absolute inset-4 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none" />
        </motion.div>
    );
});
GalleryItem.displayName = "GalleryItem";

const Gallery = React.memo(() => {
    const { data, addItem, deleteItem, updateData, isEditMode } = useAdmin();
    const [selectedImg, setSelectedImg] = useState(null);
    const [showAddImg, setShowAddImg] = useState(false);
    const [showAddDream, setShowAddDream] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [newImg, setNewImg] = useState({ caption: '', details: '', date: '', id: 100, span: 'row-span-1 col-span-1' });
    const [newDream, setNewDream] = useState({ title: '', desc: '', icon: 'Home', accent: 'bg-rose/20' });

    const audioRef = React.useRef(null);
    React.useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audioRef.current.volume = 0.2;
    }, []);

    const playClick = React.useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    }, []);

    const handleItemClick = React.useCallback((img) => {
        playClick();
        setSelectedImg(img);
    }, [playClick]);

    const handleDelete = React.useCallback((idx) => {
        deleteItem('gallery', idx);
    }, [deleteItem]);

    const handleEditImg = React.useCallback((idx) => {
        setEditingItem({ type: 'gallery', index: idx });
        setNewImg(data.gallery[idx]);
        setShowAddImg(true);
    }, [data.gallery]);

    const handleEditDream = React.useCallback((idx) => {
        setEditingItem({ type: 'dream', index: idx });
        setNewDream(data.dreams[idx]);
        setShowAddDream(true);
    }, [data.dreams]);

    const handleSaveImg = React.useCallback(() => {
        if (editingItem && editingItem.type === 'gallery') {
            const newGallery = [...data.gallery];
            newGallery[editingItem.index] = newImg;
            updateData({ ...data, gallery: newGallery });
        } else {
            addItem('gallery', newImg);
        }
        setShowAddImg(false);
        setNewImg({ caption: '', details: '', date: '', id: 100, span: 'row-span-1 col-span-1', url: "" });
        setEditingItem(null);
    }, [data, editingItem, newImg, updateData, addItem]);

    const handleSaveDream = React.useCallback(() => {
        if (editingItem && editingItem.type === 'dream') {
            const newDreams = [...data.dreams];
            newDreams[editingItem.index] = newDream;
            updateData({ ...data, dreams: newDreams });
        } else {
            addItem('dreams', newDream);
        }
        setShowAddDream(false);
        setNewDream({ title: '', desc: '', icon: 'Home', accent: 'bg-rose/20' });
        setEditingItem(null);
    }, [data, editingItem, newDream, updateData, addItem]);

    const closeModals = React.useCallback(() => {
        setShowAddImg(false);
        setShowAddDream(false);
        setEditingItem(null);
        setNewImg({ caption: '', details: '', date: '', id: 100, span: 'row-span-1 col-span-1', url: "" });
        setNewDream({ title: '', desc: '', icon: 'Home', accent: 'bg-rose/20' });
    }, []);

    return (
        <>
            <section className="py-32 px-4 bg-bg-primary overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-24 text-center reveal active">
                        <span className="text-gold tracking-[0.5em] uppercase text-xs mb-6 block">Captured Moments</span>
                        <h2 className="text-5xl md:text-7xl font-display text-cream mb-8 font-light tracking-tight">Our Visual Diary</h2>
                        <p className="max-w-xl text-cream/30 font-body leading-relaxed text-sm italic">
                            &quot;Every frame a universe, each pixel a promise. These are the sacred fragments of us.&quot;
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 gap-6 h-auto md:h-auto min-h-[800px]">
                        {(data?.gallery || []).map((img, index) => (
                            <GalleryItem
                                key={index}
                                img={img}
                                index={index}
                                isEditMode={isEditMode}
                                onClick={handleItemClick}
                                onDelete={handleDelete}
                                onEdit={handleEditImg}
                            />
                        ))}

                        {isEditMode && (
                            <div
                                onClick={() => { setEditingItem(null); setNewImg({ caption: '', details: '', date: '', id: 100, span: 'row-span-1 col-span-1' }); setShowAddImg(true); }}
                                className="flex flex-col items-center justify-center border-2 border-dashed border-gold/20 rounded-3xl hover:bg-gold/5 cursor-pointer transition-all min-h-[250px]"
                            >
                                <Plus className="text-gold mb-2" />
                                <span className="text-gold text-[10px] uppercase tracking-widest font-bold">Add Photo</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-60 text-center">
                        <div className="flex flex-col items-center mb-24 reveal active">
                            <div className="w-12 h-[1px] bg-gold/50 mb-8" />
                            <span className="text-gold tracking-[0.6em] uppercase text-xs mb-6 block font-body">Future Visions</span>
                            <h2 className="text-5xl md:text-8xl font-display text-cream italic tracking-tighter">Our Future Dreams</h2>
                            <p className="mt-8 text-cream/40 font-body max-w-lg mx-auto italic">Architecting a life where every sunrise is a shared masterpiece.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                            {(data?.dreams || []).map((dream, i) => (
                                <div key={i} className="group relative overflow-hidden glass p-12 md:p-16 rounded-[4rem] border-white/5 hover:border-gold/30 transition-all duration-1000 hover:-translate-y-2">
                                    <div className={`absolute top-0 right-0 w-64 h-64 ${dream.accent} blur-[100px] rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />

                                    {isEditMode && (
                                        <div className="absolute top-8 right-8 flex gap-2 z-20">
                                            <button
                                                onClick={() => handleEditDream(i)}
                                                className="p-2 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteItem('dreams', i)}
                                                className="p-2 bg-rose/20 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="relative z-10 flex flex-col items-start gap-8">
                                        <div className="p-6 rounded-3xl bg-white/5 text-gold group-hover:bg-gold group-hover:text-bg-primary transition-all duration-700 shadow-2xl">
                                            {iconMap[dream.icon] || <Heart size={32} />}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl md:text-4xl font-display text-cream mb-6 italic group-hover:text-gold transition-colors">{dream.title}</h3>
                                            <p className="text-cream/50 font-body text-lg leading-relaxed italic pr-8">{dream.desc}</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-10 right-10 opacity-10 group-hover:opacity-30 transition-opacity duration-700 italic font-display text-4xl text-gold">
                                        0{i + 1}
                                    </div>
                                </div>
                            ))}

                            {isEditMode && (
                                <button
                                    onClick={() => { setEditingItem(null); setNewDream({ title: '', desc: '', icon: 'Home', accent: 'bg-rose/20' }); setShowAddDream(true); }}
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gold/20 rounded-[4rem] min-h-[300px] hover:bg-gold/5 transition-all text-gold group"
                                >
                                    <Plus size={48} className="group-hover:scale-110 transition-transform mb-4" />
                                    <span className="text-sm uppercase tracking-[0.4em] font-bold">Add New Dream</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-12 bg-bg-primary/98 backdrop-blur-2xl">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative max-w-6xl w-full glass rounded-[4rem] overflow-hidden flex flex-col md:flex-row h-full md:h-auto max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/10 text-left">
                            <button onClick={() => { playClick(); setSelectedImg(null); }} className="absolute top-10 right-10 z-20 w-14 h-14 rounded-full glass border-white/20 flex items-center justify-center text-cream hover:bg-gold hover:text-bg-primary transition-all hover:scale-110 active:scale-90"><X size={28} /></button>
                            <div className="w-full md:w-2/3 relative h-[300px] md:h-[700px] overflow-hidden">
                                <Image 
                                    src={selectedImg.url || `https://picsum.photos/1200/1200?random=${selectedImg.id}`} 
                                    alt={selectedImg.caption} 
                                    fill 
                                    className="object-cover transition-transform duration-[10s] hover:scale-110" 
                                    sizes="(max-width: 768px) 100vw, 800px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="w-full md:w-1/3 p-12 md:p-20 flex flex-col justify-center bg-white/[0.02]">
                                <div className="flex items-center gap-3 text-gold tracking-[0.3em] uppercase text-[10px] mb-8 font-body font-bold"><Calendar size={14} /> {selectedImg.date}</div>
                                <h3 className="text-5xl md:text-6xl font-display text-cream mb-10 italic leading-tight">{selectedImg.caption}</h3>
                                <div className="w-20 h-[1px] bg-gold/50 mb-10" />
                                <p className="text-cream/60 font-body leading-relaxed text-xl italic mb-16 pr-4">&quot;{selectedImg.details}&quot;</p>
                                <div className="flex items-center gap-2 text-gold/30 text-[10px] tracking-[0.5em] uppercase font-bold"><Sparkles size={14} /> Fragments of Destiny</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Photo Modal */}
            <AnimatePresence>
                {showAddImg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-bg-primary/95 backdrop-blur-xl">
                        <div className="glass p-12 rounded-[3rem] border-gold/20 max-w-lg w-full space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <label className="w-full flex flex-col items-center justify-center bg-white/5 border border-dashed border-gold/30 p-8 rounded-2xl cursor-pointer hover:bg-gold/5 transition-all group">
                                    <div className="w-12 h-12 rounded-full glass border-gold/20 flex items-center justify-center text-gold mb-3 group-hover:scale-110 transition-transform">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">
                                        {newImg.url ? "Change Image" : "Upload Image"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert("Image is too large! Please choose an image under 2MB.");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    setNewImg({ ...newImg, url: event.target.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>

                                {newImg.url && (
                                    <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-gold/20">
                                        <Image 
                                            src={newImg.url} 
                                            alt="Preview" 
                                            fill 
                                            className="object-cover" 
                                            sizes="400px"
                                        />
                                        <button
                                            onClick={() => setNewImg({ ...newImg, url: "" })}
                                            className="absolute top-2 right-2 p-1.5 bg-rose/80 text-white rounded-full hover:bg-rose transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input type="text" placeholder="Photo Caption" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none" value={newImg.caption} onChange={(e) => setNewImg({ ...newImg, caption: e.target.value })} />
                            <input type="text" placeholder="Date (e.g. March 2026)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none" value={newImg.date} onChange={(e) => setNewImg({ ...newImg, date: e.target.value })} />
                            <textarea placeholder="The Story behind this photo..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none h-32" value={newImg.details} onChange={(e) => setNewImg({ ...newImg, details: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl text-cream focus:border-gold" value={newImg.span} onChange={(e) => setNewImg({ ...newImg, span: e.target.value })}>
                                    <option value="row-span-1 col-span-1">Standard</option>
                                    <option value="row-span-2 col-span-2">Large Square</option>
                                    <option value="row-span-2 col-span-1">Tall</option>
                                    <option value="row-span-1 col-span-2">Wide</option>
                                </select>
                                <input type="number" placeholder="Random ID" className="bg-white/5 border border-white/10 p-4 rounded-xl text-cream" value={newImg.id} onChange={(e) => setNewImg({ ...newImg, id: e.target.value })} />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleSaveImg} className="flex-1 py-4 bg-gold text-bg-primary font-bold rounded-xl">{editingItem ? "Update Memory" : "Save Memory"}</button>
                                <button onClick={closeModals} className="flex-1 py-4 border border-white/10 text-cream rounded-xl">Cancel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Dream Modal */}
            <AnimatePresence>
                {showAddDream && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-bg-primary/95 backdrop-blur-xl">
                        <div className="glass p-12 rounded-[3rem] border-gold/20 max-w-lg w-full space-y-6">
                            <h4 className="text-3xl font-display text-gold italic mb-4">{editingItem ? "Update Dream" : "Dream a New Future"}</h4>
                            <input type="text" placeholder="Dream Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none" value={newDream.title} onChange={(e) => setNewDream({ ...newDream, title: e.target.value })} />
                            <textarea placeholder="Description of this dream..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream focus:border-gold outline-none h-32" value={newDream.desc} onChange={(e) => setNewDream({ ...newDream, desc: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl text-cream focus:border-gold" value={newDream.icon} onChange={(e) => setNewDream({ ...newDream, icon: e.target.value })}>
                                    <option value="Home">Home</option>
                                    <option value="Plane">Travel</option>
                                    <option value="ShieldCheck">Safety</option>
                                    <option value="Stars">Magic</option>
                                </select>
                                <select className="bg-[#1a1a1a] border border-white/10 p-4 rounded-xl text-cream focus:border-gold" value={newDream.accent} onChange={(e) => setNewDream({ ...newDream, accent: e.target.value })}>
                                    <option value="bg-rose/20">Rose</option>
                                    <option value="bg-gold/20">Gold</option>
                                    <option value="bg-white/10">White</option>
                                    <option value="bg-blush/20">Blush</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleSaveDream} className="flex-1 py-4 bg-gold text-bg-primary font-bold rounded-xl">{editingItem ? "Update Dream" : "Add Dream"}</button>
                                <button onClick={closeModals} className="flex-1 py-4 border border-white/10 text-cream rounded-xl">Cancel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});
Gallery.displayName = "Gallery";

export default Gallery;
