"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import IntroOverlay from '@/components/IntroOverlay';
import FloatingPetals from '@/components/FloatingPetals';
import CustomCursor from '@/components/CustomCursor';
import Hero from '@/components/Hero';
import Timeline from '@/components/Timeline';
import LoveCards from '@/components/LoveCards';
import Gallery from '@/components/Gallery';
import LoveLetter from '@/components/LoveLetter';
import MusicCard from '@/components/MusicCard';
import Countdown from '@/components/Countdown';
import FutureMilestones from '@/components/FutureMilestones';
import Promises from '@/components/Promises';
import Footer from '@/components/Footer';
import BackgroundMusic from '@/components/BackgroundMusic';

import { useAdmin } from '@/context/AdminContext';

export default function Home() {
  const { data } = useAdmin();
  const [scrollProgress, setScrollProgress] = useState(0);

  const herName = data?.hero?.herName || "Lyraa";
  const anniversaryDate = data?.anniversaryDate || "2025-12-23";

  const audioRef = React.useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
        audioRef.current.volume = 0.1;
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (window.scrollY / height) * 100;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    const playClick = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => { });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', playClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', playClick);
    };
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.01, rootMargin: "0px 0px 50px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [data]);

  return (
    <main className="relative bg-bg-primary min-h-screen">
      <div className="grain pointer-events-none" />

      <div className="fixed top-0 left-0 w-full h-[2px] z-[90] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <IntroOverlay />
      <Navbar />
      <CustomCursor />
      <FloatingPetals />
      <BackgroundMusic />

      <div className="relative z-10">
        <div id="home">
          <Hero herName={herName} />
        </div>

        <div id="timeline">
          <Timeline />
        </div>

        <div id="reasons">
          <LoveCards />
        </div>

        <div id="gallery">
          <Gallery />
        </div>

        <div id="letter">
          <LoveLetter />
        </div>

        <div id="music">
          <MusicCard />
        </div>

        <div id="countdown">
          <Countdown startDate={anniversaryDate} />
        </div>

        <div id="future">
          <FutureMilestones />
        </div>

        <div id="promises">
          <Promises />
        </div>

        <Footer />
      </div>
    </main>
  );
}
