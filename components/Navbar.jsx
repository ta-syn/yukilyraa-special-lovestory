"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'timeline', label: 'OUR STORY' },
    { id: 'reasons', label: 'REASONS' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'letter', label: 'LETTER' },
    { id: 'music', label: 'MUSIC' },
    { id: 'promises', label: 'PROMISES' },
];

const Navbar = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

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
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <nav 
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
                scrolled ? 'bg-bg-primary/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-between items-center">
                {/* Mobile Menu Button - Hidden for now as the request implies a desktop view, 
                    but we can add a simple hamburger if needed. 
                    For now, following the image strictly which is desktop-like. 
                */}
                
                <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
                    {navItems.map((item) => (
                        <li key={item.id} className="relative">
                            <button
                                onClick={() => scrollToSection(item.id)}
                                className={`text-sm md:text-base font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
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
            </div>
        </nav>
    );
};

export default Navbar;
