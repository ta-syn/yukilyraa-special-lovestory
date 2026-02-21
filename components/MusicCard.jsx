"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Edit3, Save, Upload, Disc, Plus, Trash2, Volume2, VolumeX, Repeat, Shuffle, ListMusic, X, Headphones, Sparkles } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const MusicCard = () => {
    const { data, updateData, isEditMode, notify, deleteItem } = useAdmin();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const audioRef = useRef(null);
    const [editMode, setEditMode] = useState(false);

    const songs = data?.songs || [
        {
            title: "La Vie En Rose",
            artist: "Edith Piaf",
            year: "1945",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }
    ];

    const currentSong = songs[currentIndex] || songs[0];
    const [tempSong, setTempSong] = useState(currentSong);

    // Sync tempSong with currentSong when navigation happens or data is saved
    useEffect(() => {
        if (!editMode) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTempSong(currentSong);
        }
    }, [currentIndex, currentSong, editMode]);

    // Handle auto-play when switching songs
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        }
    }, [currentIndex, isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Safety: Reset index if it becomes out of bounds after deletion
    useEffect(() => {
        if (currentIndex >= songs.length && songs.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentIndex(Math.max(0, songs.length - 1));
        }
    }, [songs.length, currentIndex]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const cleanTitle = (title) => {
        if (!title) return "";
        return title
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\.[^/.]+$/, "") // Remove extension
            .replace(/\(mp3\)|\(wav\)/gi, '') // Remove (mp3) etc
            .trim();
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                notify("Click anywhere on the page first to enable audio! 🎵", "error");
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleSave = () => {
        const newSongs = [...songs];
        newSongs[currentIndex] = tempSong;
        updateData({ ...data, songs: newSongs });
        setEditMode(false);
    };

    const handleCancel = () => {
        setTempSong(currentSong);
        setEditMode(false);
    };

    const handleAddSong = () => {
        const newSong = {
            title: "New Track",
            artist: "Artist Name",
            year: new Date().getFullYear().toString(),
            url: ""
        };
        const newSongs = [...songs, newSong];
        const newIndex = newSongs.length - 1;

        updateData({ ...data, songs: newSongs }, true);
        setCurrentIndex(newIndex);
        setEditMode(true);
        setTempSong(newSong); // Reset input fields for the new song
        notify("Masterpiece added to collection! 🎶");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 100 * 1024 * 1024) {
                notify("File too big! Please keep it under 100MB. 🎵", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const cleanedName = cleanTitle(file.name);
                setTempSong({
                    ...tempSong,
                    url: event.target.result,
                    title: tempSong.title === "New Track" ? cleanedName : tempSong.title
                });
                notify("Frequency captured successfully! 🎧");
            };
            reader.readAsDataURL(file);
        }
    };

    const nextSong = () => {
        if (isShuffle) {
            let nextIdx;
            do {
                nextIdx = Math.floor(Math.random() * songs.length);
            } while (nextIdx === currentIndex && songs.length > 1);
            setCurrentIndex(nextIdx);
        } else {
            setCurrentIndex((prev) => (prev + 1) % songs.length);
        }
    };

    const prevSong = () => {
        setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    return (
        <section className="py-16 px-4 bg-bg-primary relative overflow-hidden">
            {/* Ultra-Modern Blurred Background */}
            <div className={`absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-gold/10 rounded-full blur-[160px] transition-all duration-1000 ${isPlaying ? 'scale-110 opacity-60' : 'scale-100 opacity-40'}`} />
            <div className={`absolute -bottom-40 -right-40 w-[45rem] h-[45rem] bg-rose/5 rounded-full blur-[180px] transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-50' : 'scale-100 opacity-30'}`} />

            <div className="max-w-5xl mx-auto relative">
                <div className="glass p-6 md:p-10 rounded-[3rem] md:rounded-[4rem] border-white/5 relative shadow-[0_80px_150px_rgba(0,0,0,0.9)] group overflow-hidden border">

                    {/* Glass Reflective Overlay */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Header: Identity & Status */}
                    <div className="flex justify-between items-center mb-12 relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className={`absolute -inset-2 bg-gold/20 blur-xl rounded-full transition-all duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
                                <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center text-gold shadow-2xl relative z-10 transition-transform hover:rotate-6">
                                    <Headphones size={22} className={isPlaying ? 'animate-bounce' : ''} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gold tracking-[0.5em] uppercase text-[10px] font-black">Lumina Studio</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center">
                                        <span className={`w-2 h-2 rounded-full bg-gold ${isPlaying ? 'animate-ping opacity-75' : 'opacity-40'}`} />
                                        <span className={`absolute w-2 h-2 rounded-full bg-gold ${isPlaying ? '' : 'opacity-20'}`} />
                                    </div>
                                    <span className="text-cream/50 text-[9px] uppercase tracking-[0.3em] font-medium pulse-text">
                                        {isPlaying ? "Synchronizing Experience" : "Engine Idle"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isEditMode && (
                            <div className="flex gap-4 p-2 glass rounded-full border-white/5">
                                {editMode ? (
                                    <>
                                        <button onClick={handleSave} className="p-4 bg-gold text-bg-primary rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg group">
                                            <Save size={20} className="group-hover:rotate-12 transition-transform" />
                                        </button>
                                        <button onClick={handleCancel} className="p-4 glass-dark text-cream/70 rounded-full hover:text-rose transition-all">
                                            <X size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setEditMode(true)} className="p-4 glass border-gold/20 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all">
                                            <Edit3 size={20} />
                                        </button>
                                        <button onClick={handleAddSong} className="p-4 glass border-white/10 text-gold rounded-full hover:bg-gold hover:text-bg-primary transition-all">
                                            <Plus size={20} />
                                        </button>
                                        {songs.length > 1 && (
                                            <button
                                                onClick={() => deleteItem('songs', currentIndex)}
                                                className="p-4 glass border-rose/30 text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24 relative z-10 mb-16">
                        {/* The Vinyl Disc Masterpiece */}
                        <div className="relative group/disc">
                            {/* Spectrum Ring (Pure CSS) */}
                            <div className={`absolute -inset-10 border border-gold/5 rounded-full transition-all duration-[3000ms] ${isPlaying ? 'rotate-[360deg] opacity-100 scale-110' : 'opacity-0 scale-90'}`}>
                                {[...Array(24)].map((_, i) => (
                                    <div key={i}
                                        className={`absolute top-0 left-1/2 -ml-[1px] w-[2px] bg-gold/20 origin-[0_150px] ${isPlaying ? 'animate-spectrum-bar' : ''}`}
                                        style={{
                                            transform: `rotate(${i * 15}deg)`,
                                            animationDelay: `${i * 0.1}s`,
                                            height: '4px'
                                        }}
                                    />
                                ))}
                            </div>

                            <div className={`w-56 h-56 md:w-72 md:h-72 rounded-full p-1 border border-white/5 relative transition-all duration-[12s] linear infinite ${isPlaying ? 'rotate-[360deg]' : ''} shadow-[0_30px_100px_rgba(0,0,0,0.8)]`}>
                                {/* Realistic Vinyl Texture */}
                                <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,rgba(0,0,0,0.95)_0px,rgba(255,255,255,0.01)_1px,rgba(0,0,0,0.95)_2px)] glass-shine" />

                                {/* Inner Label */}
                                <div className="absolute inset-8 md:inset-12 rounded-full border border-white/10 bg-bg-secondary flex items-center justify-center overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 via-transparent to-gold/10 pointer-events-none" />
                                    <Disc className={`w-28 h-28 md:w-36 md:h-36 text-gold/10 transition-transform duration-[2000ms] ${isPlaying ? 'scale-125 opacity-20' : 'opacity-10'}`} strokeWidth={1} />

                                    {editMode && (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary/95 backdrop-blur-xl cursor-pointer z-30 group-hover:bg-bg-primary/90 transition-all">
                                            <div className="w-16 h-16 rounded-full glass border-gold/30 flex items-center justify-center text-gold mb-3 shadow-2xl">
                                                <Upload size={28} className="animate-pulse" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/80">Import Source</span>
                                            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                                        </label>
                                    )}

                                    {!editMode && (
                                        <Sparkles className={`absolute text-gold/20 transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-110 rotate-45' : 'opacity-0 scale-50'}`} size={48} />
                                    )}
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-white/20 to-transparent border border-white/10 z-20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_#d4af7a]" />
                                </div>
                            </div>

                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 glass-gold rounded-full transition-all group-hover/disc:-translate-y-2 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-bg-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                                    <span className="text-[10px] font-black text-bg-primary uppercase tracking-[0.4em]">High Fidelity</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 w-full text-center xl:text-left">
                            {editMode ? (
                                <div className="space-y-6 max-w-xl">
                                    <div className="group/input relative">
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-cream text-3xl md:text-5xl font-display outline-none focus:border-gold/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                                            value={tempSong.title}
                                            onChange={(e) => setTempSong({ ...tempSong, title: e.target.value })}
                                            placeholder="Composition Title"
                                        />
                                        <span className="absolute -top-3 left-6 px-3 bg-bg-secondary text-[9px] font-black uppercase tracking-[0.3em] text-gold/40 rounded-full border border-white/5">Title</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="relative flex-1 group/input">
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-gold text-xl font-body outline-none focus:border-gold/30 transition-all"
                                                value={tempSong.artist}
                                                onChange={(e) => setTempSong({ ...tempSong, artist: e.target.value })}
                                                placeholder="Artist"
                                            />
                                            <span className="absolute -top-2.5 left-5 px-3 bg-bg-secondary text-[8px] font-black uppercase tracking-[0.3em] text-gold/30 rounded-full border border-white/5">Artist</span>
                                        </div>
                                        <div className="relative w-full sm:w-32 group/input">
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-gold/60 text-center outline-none focus:border-gold/30 transition-all"
                                                value={tempSong.year}
                                                onChange={(e) => setTempSong({ ...tempSong, year: e.target.value })}
                                                placeholder="2024"
                                            />
                                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 bg-bg-secondary text-[8px] font-black uppercase tracking-[0.3em] text-gold/30 rounded-full border border-white/5">Era</span>
                                        </div>
                                    </div>
                                    {(tempSong.url === "" || !tempSong.url) && (
                                        <div className="flex items-center gap-3 px-6 py-4 bg-rose/5 border border-rose/20 rounded-2xl text-rose font-medium text-xs">
                                            <div className="w-2 h-2 rounded-full bg-rose animate-pulse" />
                                            <span>Waveform missing. Please upload a source file.</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-5 mb-2 justify-center xl:justify-start">
                                        <div className="h-[1px] w-12 bg-gradient-to-r from-gold/50 to-transparent" />
                                        <span className="text-gold/40 tracking-[0.6em] uppercase text-[10px] font-black">
                                            Vault Track {currentIndex + 1}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-display text-cream mb-4 italic tracking-tight shimmer-gold leading-[1.1] drop-shadow-2xl">
                                        {cleanTitle(currentSong.title)}
                                    </h2>
                                    <div className="flex items-center justify-center xl:justify-start gap-4 text-xl md:text-2xl font-body italic text-gold/70 pb-6">
                                        <span>{currentSong.artist}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold/20" />
                                        <span className="opacity-40">{currentSong.year}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-12 mt-6">
                                <div className="flex items-center gap-8 glass p-3 rounded-full border-white/5 shadow-inner">
                                    <Shuffle
                                        size={20}
                                        onClick={() => { setIsShuffle(!isShuffle); notify(isShuffle ? "Sequential Mode" : "Shuffle Protocol Active 🔀"); }}
                                        className={`cursor-pointer transition-all hover:scale-125 ${isShuffle ? 'text-gold drop-shadow-[0_0_8px_gold]' : 'text-white/20'}`}
                                    />

                                    <div className="flex items-center gap-10">
                                        <SkipBack
                                            size={32}
                                            onClick={prevSong}
                                            className="text-white/30 hover:text-gold cursor-pointer transition-all hover:-translate-x-1"
                                        />
                                        <button
                                            onClick={togglePlay}
                                            className="w-28 h-28 rounded-full glass-gold border-gold/50 flex items-center justify-center text-bg-primary hover:scale-[1.08] active:scale-90 transition-all shadow-[0_30px_60px_rgba(212,175,122,0.4)] relative group/play overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/play:translate-y-0 transition-transform duration-500 rounded-full" />
                                            {isPlaying ? <Pause size={44} fill="currentColor" className="relative z-10" /> : <Play size={44} fill="currentColor" className="relative z-10 ml-2" />}
                                        </button>
                                        <SkipForward
                                            size={32}
                                            onClick={nextSong}
                                            className="text-white/30 hover:text-gold cursor-pointer transition-all hover:translate-x-1"
                                        />
                                    </div>

                                    <Repeat
                                        size={20}
                                        onClick={() => { setIsRepeat(!isRepeat); notify(isRepeat ? "Finite Mode" : "Infinite Loop Active 🔁"); }}
                                        className={`cursor-pointer transition-all hover:scale-125 ${isRepeat ? 'text-gold drop-shadow-[0_0_8px_gold]' : 'text-white/20'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-20 px-4 md:px-10">
                        <div className="group/seeker relative py-4">
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer relative z-10 hover:h-2 transition-all outline-none"
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-gradient-to-r from-gold/40 via-gold to-gold rounded-full pointer-events-none transition-all duration-[300ms]"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_#d4af7a] scale-0 group-hover/seeker:scale-100 transition-transform" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[10px] font-black tracking-[0.4em] text-gold/40 font-mono">{formatTime(currentTime)}</span>
                            {!editMode && <div className="text-[8px] uppercase tracking-[0.5em] text-gold/20 flex items-center gap-3">
                                <div className={`w-1 h-1 rounded-full bg-gold/30 ${isPlaying ? 'animate-ping' : ''}`} />
                                Streaming Optimized Audio
                            </div>}
                            <span className="text-[10px] font-black tracking-[0.4em] text-gold/40 font-mono">{formatTime(duration)}</span>
                        </div>
                    </div>
                    {/* Refined Utility Bar */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-20">
                        {!editMode && (
                            <button
                                onClick={() => setShowPlaylist(!showPlaylist)}
                                className={`group flex items-center gap-4 px-8 py-4 rounded-3xl glass transition-all border duration-500 ${showPlaylist ? 'bg-gold/10 text-gold border-gold/30 shadow-[0_0_30px_rgba(212,175,122,0.1)]' : 'text-cream/30 hover:text-gold border-white/5 hover:border-gold/20'}`}
                            >
                                <div className={`relative ${showPlaylist ? 'rotate-180' : ''} transition-transform duration-500`}>
                                    <ListMusic size={20} />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose rounded-full ring-4 ring-bg-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Personal Collection</span>
                            </button>
                        )}

                        <div className="flex items-center gap-8 glass px-8 py-4 rounded-3xl border-white/5 group/vol-container">
                            <button onClick={() => setIsMuted(!isMuted)} className="hover:scale-110 transition-transform">
                                {isMuted || volume === 0 ? <VolumeX size={20} className="text-rose/70" /> : <Volume2 size={20} className="text-gold/60 group-hover/vol-container:text-gold" />}
                            </button>
                            <div className="w-40 h-1 bg-white/5 rounded-full relative group/vseeker cursor-pointer overflow-hidden">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(parseFloat(e.target.value));
                                        setIsMuted(false);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/20 to-gold/60 rounded-full transition-all"
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col items-end opacity-20 pointer-events-none hidden lg:block">
                            <div className="text-[9px] uppercase tracking-[0.5em] font-black text-cream">Sonic Engine v4.2 PRO</div>
                        </div>
                    </div>

                    {!editMode && showPlaylist && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-library-reveal">
                            {songs.map((song, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}
                                    className={`group/item p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer relative overflow-hidden ${idx === currentIndex ? 'glass-gold border-gold/40 text-bg-primary shadow-2xl scale-[1.02]' : 'glass border-white/5 text-gold/60 hover:border-gold/30 hover:text-gold hover:scale-[1.02]'}`}
                                >
                                    <div className="flex items-center gap-5 overflow-hidden relative z-10">
                                        <div className={`text-xs font-black italic transition-opacity ${idx === currentIndex ? 'opacity-100' : 'opacity-20'}`}>
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="truncate">
                                            <div className="text-sm font-black tracking-tight truncate mb-0.5">{cleanTitle(song.title)}</div>
                                            <div className={`text-[9px] font-bold tracking-[0.2em] uppercase opacity-60 ${idx === currentIndex ? '' : 'italic'}`}>
                                                {song.artist}
                                            </div>
                                        </div>
                                    </div>

                                    {idx === currentIndex && isPlaying ? (
                                        <div className="flex gap-1 items-end h-5 relative z-10">
                                            {[...Array(4)].map((_, j) => (
                                                <div key={j} className={`w-1 bg-current rounded-full animate-music-bar`} style={{ animationDelay: `${j * 0.2}s` }} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border border-current/10 flex items-center justify-center scale-0 group-hover/item:scale-100 transition-transform">
                                            <Play size={12} fill="currentColor" />
                                        </div>
                                    )}

                                    {idx === currentIndex && (
                                        <div className="absolute -inset-10 bg-white/10 blur-3xl rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <audio
                        ref={audioRef}
                        src={(editMode ? tempSong.url : currentSong.url) || null}
                        loop={isRepeat}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => {
                            if (isRepeat) return;
                            nextSong();
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                .shimmer-gold {
                    background: linear-gradient(to right, #d4af7a 20%, #fef0e7 50%, #d4af7a 80%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shine 6s linear infinite;
                }
                @keyframes shine {
                    to { background-position: 200% center; }
                }
                @keyframes music-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                }
                .animate-music-bar {
                    animation: music-bar 1.2s infinite ease-in-out;
                }
                .glass-shine::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
                    border-radius: 50%;
                }
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 0;
                    height: 0;
                }
                .animate-library-reveal {
                    animation: libraryReveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                @keyframes libraryReveal {
                    from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                .pulse-text {
                    animation: subtlePulse 2s ease-in-out infinite;
                }
                @keyframes subtlePulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                @keyframes spectrum-bar {
                    0%, 100% { height: 4px; opacity: 0.2; }
                    50% { height: 20px; opacity: 0.5; }
                }
                .animate-spectrum-bar {
                    animation: spectrum-bar 1.5s infinite ease-in-out;
                }
            `}</style>
        </section>
    );
};

export default React.memo(MusicCard);
