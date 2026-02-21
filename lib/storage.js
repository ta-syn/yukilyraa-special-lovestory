"use client";

// Default data for the app
export const DEFAULT_DATA = {
    hero: {
        herName: "Lyraa",
        quote: "You are my favorite everything."
    },
    timeline: [
        {
            date: "Late 2025",
            title: "The MLBB Connection",
            description: "It all started in the Land of Dawn. Amidst the chaos of the game, I found something far more important than a victory: you. Our first conversation in MLBB was the start of everything.",
            location: "Mobile Legends: Bang Bang",
            icon: "Gamepad2",
        },
        {
            date: "The Very Next Day",
            title: "Into the DMs",
            description: "I couldn't get you off my mind. The next day, I found you on Instagram, and our conversation flowed like we'd known each other forever. That's when I knew this was special.",
            location: "Instagram",
            icon: "Instagram",
        },
        {
            date: "Dec 23, 2025",
            title: "The Sacred Promise",
            description: "The day our stars officially aligned. 23rd December 2025—the date that changed my universe forever. The day we became 'Us'.",
            location: "Our Forever Chapter",
            icon: "Heart",
        },
        {
            date: "Every Day Since",
            title: "An Infinite Journey",
            description: "From game chats to heart-to-hearts, every second with you, Lyraa, is a dream I never want to wake up from. Our story is still being written.",
            location: "Everywhere With You",
            icon: "Sparkles",
        },
    ],
    reasons: [
        "Your laugh makes everything better",
        "The way you care for everyone around you",
        "How you make ordinary moments magical",
        "Your strength even when things are hard",
        "The way you look at me",
        "Your kindness that knows no limits",
        "How home feels like wherever you are",
        "The dreams you chase fearlessly",
        "Simply because you are you"
    ],
    gallery: [
        { id: 30, caption: "Quiet Mornings", details: "Memory of our peaceful moments.", span: "row-span-2 col-span-2", date: "Jan 2026" },
        { id: 31, caption: "The First Smile", details: "That look in your eyes.", span: "row-span-1 col-span-1", date: "Jan 2026" },
        { id: 33, caption: "Endless Laughter", details: "The sound of our happiness.", span: "row-span-1 col-span-1", date: "Feb 2026" },
        { id: 34, caption: "Adventures Ahead", details: "Exploring life with you.", span: "row-span-2 col-span-1", date: "Feb 2026" },
        { id: 35, caption: "Pure Peace", details: "Finding home in you.", span: "row-span-1 col-span-2", date: "Feb 2026" },
        { id: 36, caption: "Small Wonders", details: "Cherishing every tiny thing.", span: "row-span-1 col-span-1", date: "Feb 2026" },
        { id: 37, caption: "Golden Moments", details: "Everything feels like gold.", span: "row-span-2 col-span-1", date: "Feb 2026" },
        { id: 38, caption: "Eternal Us", details: "Beyond time and space.", span: "row-span-1 col-span-2", date: "Feb 2026" },
    ],
    dreams: [
        {
            title: "The Sanctuary",
            icon: "Home",
            desc: "A home designed by us, filled with warmth, cozy corners for late-night talks, and a garden where our love grows deeper every day.",
            accent: "bg-rose/20"
        },
        {
            title: "Global Odyssey",
            icon: "Plane",
            desc: "From the cherry blossoms of Japan to the northern lights, seeing the whole world through your eyes is my only bucket list.",
            accent: "bg-gold/20"
        },
        {
            title: "The Safe Haven",
            icon: "ShieldCheck",
            desc: "Building a life where we are each other's greatest supporters, protecting our peace and nurturing our dreams side by side.",
            accent: "bg-white/10"
        },
        {
            title: "Stardust Legacy",
            icon: "Stars",
            desc: "Creating a love story so beautiful it inspires the stars. Growing old, staying young at heart, and loving you in every lifetime.",
            accent: "bg-blush/20"
        },
    ],
    promises: [
        "To always be your safe place in a loud world",
        "To grow with you, individual and together",
        "To choose you, again and again, without hesitation",
        "To make you laugh until your eyes sparkle",
        "To love you in ways words can never fully hold"
    ],
    letters: [
        {
            id: 1,
            title: "To My Everything",
            content: "You are the quiet gravity that keeps my world in orbit. There is a specific kind of magic in how you existing makes the mundane feel like a masterpiece.",
            date: "Dec 31, 2025",
            signature: "Yuki"
        },
        {
            id: 2,
            title: "My Soul's Home",
            content: "Dear Lyraa,\n\nI never knew that a heart could feel so full until I met you. You are the melody in my silence and the light in my darkest days. Growing with you is the greatest adventure of my life.\n\nThank you for being my peace, my partner, and my love. I promise to cherish every second we have, from the Land of Dawn to the ends of the universe.\n\nI love you more than words can say.",
            date: "Feb 21, 2026",
            signature: "Yuki"
        }
    ],
    intro: {
        title: "Everything is better because of you.",
        subtitle: "Wait for the moment..."
    },
    songs: [
        {
            title: "La Vie En Rose",
            artist: "Edith Piaf",
            year: "1945",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        }
    ],
    anniversaryDate: "2025-12-23",
    herName: "Lyraa"
};

// IndexedDB implementation for larger data (e.g., songs)
const DB_NAME = 'LuminaLoveDB';
const STORE_NAME = 'appData';
const DB_VERSION = 1;

const initDB = () => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject('Window undefined');
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

export const loadData = async () => {
    if (typeof window === 'undefined') return DEFAULT_DATA;

    try {
        const db = await initDB();
        return new Promise((resolve) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get('luxury_love_data');

            request.onsuccess = (event) => {
                let saved = event.target.result;

                // Migration from localStorage to IndexedDB
                if (!saved) {
                    const localSaved = localStorage.getItem('luxury_love_data');
                    if (localSaved) {
                        saved = JSON.parse(localSaved);
                        saveData(saved); // Move to IndexedDB
                        localStorage.removeItem('luxury_love_data'); // Cleanup
                    }
                }

                if (!saved) return resolve(DEFAULT_DATA);

                // Legacy migrations...
                if (saved.music && !saved.songs) {
                    saved.songs = [saved.music];
                    delete saved.music;
                }

                resolve({
                    ...DEFAULT_DATA,
                    ...saved,
                });
            };
            request.onerror = () => resolve(DEFAULT_DATA);
        });
    } catch (e) {
        console.error("IndexedDB load error:", e);
        // Fallback to localStorage if IDB fails
        const localSaved = localStorage.getItem('luxury_love_data');
        return localSaved ? JSON.parse(localSaved) : DEFAULT_DATA;
    }
};

export const saveData = async (data) => {
    if (typeof window === 'undefined') return;

    try {
        const db = await initDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put(data, 'luxury_love_data');
    } catch (e) {
        console.error("IndexedDB save error:", e);
        // Fallback to localStorage (might throw QuotaExceededError)
        try {
            localStorage.setItem('luxury_love_data', JSON.stringify(data));
        } catch (innerE) {
            console.error("LocalStorage fallback also failed:", innerE);
        }
    }
};
