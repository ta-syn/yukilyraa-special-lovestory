"use client";
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current && followerRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;

                // Follower with slight delay
                followerRef.current.style.left = `${e.clientX}px`;
                followerRef.current.style.top = `${e.clientY}px`;
            }
        };

        const handleHover = (e) => {
            const target = e.target;
            const isClickable = 
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.cursor-pointer') ||
                target.closest('[role="button"]');

            setIsHovered(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <div className={isHovered ? 'cursor-hover' : ''}>
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={followerRef} className="custom-cursor-follower">
                {isHovered && <span className="text-[8px] text-bg-primary font-bold">❤</span>}
            </div>
        </div>
    );
};

export default React.memo(CustomCursor);
