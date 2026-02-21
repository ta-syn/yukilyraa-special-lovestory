"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const BackgroundMusic = () => {
    const { data, updateData, isEditMode } = useAdmin();
    const [isPlaying, setIsPlaying] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [tempUrl, setTempUrl] = useState("");
    const audioRef = useRef(null);

    const musicUrl = data?.music?.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(musicUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.3;
        } else if (audioRef.current.src !== musicUrl) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = musicUrl;
            if (wasPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [musicUrl]);

    useEffect(() => {
        setTempUrl(musicUrl);
    }, [musicUrl]);

    const togglePlay = React.useCallback(() => {
        if (!audioRef.current) return;
        
        if (audioRef.current.paused) {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const handleSave = () => {
        updateData({ ...data, music: { ...data?.music, url: tempUrl } });
        setEditMode(false);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
            {isEditMode && (
                <div className="relative">
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="w-10 h-10 rounded-full glass border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-bg-primary transition-all mb-2 shadow-lg"
                    >
                        <Music size={18} />
                    </button>
                    
                    {editMode && (
                        <div className="absolute bottom-full right-0 mb-4 p-6 glass rounded-2xl border-gold/20 w-80 animate-fade-in-up flex flex-col gap-4">
                            <h4 className="text-gold font-display italic text-lg">Background Music</h4>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-gold/50 font-bold">Music Source</label>
                                
                                {/* URL Input */}
                                <input 
                                    type="text" 
                                    value={tempUrl.length > 50 && tempUrl.startsWith('data:') ? "File selected (too long to show)" : tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                    placeholder="https://example.com/song.mp3"
                                    className="w-full bg-white/5 border border-gold/30 p-3 rounded-xl text-cream text-xs outline-none focus:border-gold mb-2"
                                />

                                {/* File Upload */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                                                    alert("File too large! Please choose a file under 10MB.");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    setTempUrl(ev.target.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-full py-2 bg-white/5 border border-dashed border-gold/30 rounded-xl text-center hover:bg-gold/10 transition-colors flex items-center justify-center gap-2">
                                        <span className="text-gold text-xs uppercase font-bold">📂 Upload from Device</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gold/40 text-center">* Max 10MB (MP3/WAV)</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setEditMode(false)}
                                    className="flex-1 py-2 rounded-lg border border-gold/30 text-gold text-xs font-bold uppercase hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="flex-1 py-2 rounded-lg bg-gold text-bg-primary text-xs font-bold uppercase hover:bg-white transition-colors shadow-lg shadow-gold/20"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full glass border-gold/30 flex items-center justify-center text-gold hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,122,0.3)] relative group"
            >
                <div className={`absolute inset-0 rounded-full border border-gold/20 ${isPlaying ? 'animate-ping' : ''}`} />
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-4 px-4 py-2 glass rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] tracking-widest text-gold uppercase pointer-events-none">
                    {isPlaying ? "Pause Music" : "Listen to Our Song"}
                </div>
            </button>
        </div>
    );
};

export default React.memo(BackgroundMusic);
