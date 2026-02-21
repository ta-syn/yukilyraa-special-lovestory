"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'timeline', label: 'OUR STORY' },
    { id: 'reasons', label: 'REASONS' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'letter', label: 'LETTER' },
    { id: 'music', label: 'MUSIC' },
    { id: 'countdown', label: 'THE WAIT' },
    { id: 'future', label: 'FUTURE' },
    { id: 'promises', label: 'PROMISES' },
];

const Navbar = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Handle bottom of page - always select the last item
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20) {
                setActiveSection(navItems[navItems.length - 1].id);
                return;
            }

            // Determine active section based on center of viewport
            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(navItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            setMobileMenuOpen(false); // Close mobile menu if open
            const yOffset = -80; // Offset for fixed navbar
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <nav 
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                scrolled ? 'bg-bg-primary/95 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo / Brand (Optional, keeping it simple as per original) */}
                <div className="md:hidden text-gold font-display text-xl tracking-widest">
                    MENU
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden text-gold p-2 glass rounded-full"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                {/* Desktop Navigation */}
                <ul className="hidden md:flex flex-wrap justify-center gap-6 mx-auto">
                    {navItems.map((item) => (
                        <li key={item.id} className="relative group">
                            <button
                                onClick={() => scrollToSection(item.id)}
                                className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                                    activeSection === item.id ? 'text-rose' : 'text-cream/60 hover:text-gold'
                                }`}
                            >
                                {item.label}
                            </button>
                            {activeSection === item.id && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 -bottom-2 h-[2px] bg-rose shadow-[0_0_10px_#ff006e]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile Navigation Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-full left-0 w-full bg-bg-primary/95 backdrop-blur-xl border-b border-white/10 py-8 md:hidden flex flex-col items-center gap-6 shadow-2xl h-screen overflow-y-auto"
                        >
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-lg font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                                        activeSection === item.id ? 'text-rose' : 'text-cream/80'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="h-20" /> {/* Spacer for scrolling */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
