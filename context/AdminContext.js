"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '@/lib/storage';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const loadedData = await loadData();
                setData(loadedData);
                const savedMode = localStorage.getItem('luxury_edit_mode');
                if (savedMode === 'true') setIsEditMode(true);
            } catch (e) {
                console.error("Failed to load data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    const notify = React.useCallback((msg, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications(prev => [...prev, { id, msg, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
    }, []);

    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPasswordInput, setAdminPasswordInput] = useState("");

    const toggleEditMode = React.useCallback(() => {
        if (isEditMode) {
            // Turning off - no password needed
            setIsEditMode(false);
            localStorage.setItem('luxury_edit_mode', 'false');
            notify("Preview Mode Enabled ✨");
        } else {
            // Turning on - ask for password
            setShowAdminLogin(true);
        }
    }, [isEditMode, notify]);

    const handleAdminLogin = React.useCallback(() => {
        if (adminPasswordInput === 'kissy') {
            setIsEditMode(true);
            localStorage.setItem('luxury_edit_mode', 'true');
            notify("Customize Mode Enabled ✏️");
            setShowAdminLogin(false);
            setAdminPasswordInput("");
        } else {
            notify("Wrong password! ❌", "error");
            setAdminPasswordInput("");
        }
    }, [adminPasswordInput, notify]);

    // Effect to notify when mode changes, but skip initial mount
    const isFirstRender = React.useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        // Notification is now handled manually in toggle/login logic to avoid double-firing or timing issues
    }, [isEditMode]);

    const updateData = React.useCallback(async (newData, silent = false) => {
        setData(newData);
        try {
            await saveData(newData);
            if (!silent) notify("Changes saved successfully! ✨");
        } catch (e) {
            console.error("Save failed:", e);
            notify("Failed to save changes. Memory full? ❌", "error");
        }
    }, [notify]);

    const addItem = React.useCallback((section, item) => {
        setData(prevData => {
            const currentSectionData = Array.isArray(prevData[section]) ? prevData[section] : [];
            const newData = { ...prevData, [section]: [...currentSectionData, item] };
            updateData(newData, true);
            return newData;
        });
        notify(`Added to ${section}! 💖`);
    }, [updateData, notify]);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [passwordInput, setPasswordInput] = useState("");

    const deleteItem = React.useCallback((section, index) => {
        setPendingDelete({ section, index });
        setShowPasswordModal(true);
    }, []);

    const confirmDelete = React.useCallback(() => {
        if (passwordInput === 'muwhaa') {
            const { section, index } = pendingDelete;
            setData(prevData => {
                const newData = { ...prevData, [section]: prevData[section].filter((_, i) => i !== index) };
                updateData(newData, true);
                return newData;
            });
            notify("Deleted successfully. 🕊️");
            setShowPasswordModal(false);
            setPendingDelete(null);
            setPasswordInput("");
        } else {
            notify("Oops! Wrong password. ❌", "error");
            setPasswordInput("");
        }
    }, [passwordInput, pendingDelete, updateData, notify]);

    const value = React.useMemo(() => ({
        data,
        updateData,
        addItem,
        deleteItem,
        isEditMode,
        toggleEditMode,
        notify
    }), [data, updateData, addItem, deleteItem, isEditMode, toggleEditMode, notify]);

    if (isLoading || !data) {
        return (
            <div className="fixed inset-0 bg-bg-primary flex items-center justify-center z-[1000]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-t-2 border-gold animate-spin" />
                    <p className="text-gold font-display italic animate-pulse">Initializing your universe...</p>
                </div>
            </div>
        );
    }

    // Move notifications rendering to use a portal or higher z-index, but first let's check the container
    // The issue is likely that the notifications array is stateful but the render might be getting blocked or z-index is too low relative to modals
    // Let's increase z-index and ensure it's at the very top of the DOM order visually

    return (
        <AdminContext.Provider value={value}>
            {children}

            {/* Notifications - Increased z-index to 9999 to be above everything including modals */}
            <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`pointer-events-auto flex items-center gap-3 px-8 py-5 rounded-3xl glass backdrop-blur-3xl border ${n.type === 'error' ? 'border-rose/50 bg-rose/10 text-rose' : 'border-gold/50 bg-gold/10 text-gold'
                            } shadow-2xl animate-fade-in-right transition-all`}
                    >
                        <div className={`w-3 h-3 rounded-full animate-pulse ${n.type === 'error' ? 'bg-rose' : 'bg-gold'}`} />
                        <span className="font-display italic text-lg">{n.msg}</span>
                    </div>
                ))}
            </div>

            {/* Admin Login Modal */}
            {showAdminLogin && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-bg-primary/95 backdrop-blur-2xl">
                    <div className="glass p-12 rounded-[2.5rem] border-gold/20 max-w-sm w-full text-center space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-reveal">
                        <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mx-auto text-gold bg-gold/5">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-display text-cream mb-2 italic">Admin Access</h3>
                            <p className="text-gold/40 text-xs uppercase tracking-widest font-bold">Enter Secret Key</p>
                        </div>
                        <input
                            type="password"
                            autoFocus
                            placeholder="Enter password..."
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream text-center outline-none focus:border-gold transition-all"
                            value={adminPasswordInput}
                            onChange={(e) => setAdminPasswordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleAdminLogin}
                                className="flex-1 py-4 bg-gold text-bg-primary font-bold rounded-xl hover:bg-white transition-colors"
                            >
                                Unlock
                            </button>
                            <button
                                onClick={() => { setShowAdminLogin(false); setAdminPasswordInput(""); }}
                                className="flex-1 py-4 border border-white/10 text-cream rounded-xl hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-bg-primary/95 backdrop-blur-2xl">
                    <div className="glass p-12 rounded-[2.5rem] border-gold/20 max-w-sm w-full text-center space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-reveal">
                        <div className="w-20 h-20 rounded-full border border-rose/30 flex items-center justify-center mx-auto text-rose bg-rose/5">
                            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none">
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-display text-cream mb-2 italic">Confirm Deletion</h3>
                            <p className="text-gold/40 text-xs uppercase tracking-widest font-bold">This action cannot be undone</p>
                        </div>
                        <input
                            type="password"
                            autoFocus
                            placeholder="Enter password..."
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-cream text-center outline-none focus:border-gold transition-all"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmDelete()}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-4 bg-rose text-white font-bold rounded-xl hover:bg-rose-600 transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => { setShowPasswordModal(false); setPasswordInput(""); }}
                                className="flex-1 py-4 border border-white/10 text-cream rounded-xl hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Administrative Interface Toggle */}
            <div className={`fixed bottom-8 left-8 z-[300] transition-all duration-500 ${isEditMode ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-100'}`}>
                <button
                    onClick={toggleEditMode}
                    className={`px-6 py-3 rounded-full border border-gold/30 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${isEditMode ? 'bg-gold text-bg-primary shadow-[0_0_30px_rgba(212,175,122,0.4)]' : 'bg-white/5 text-gold'
                        }`}
                >
                    {isEditMode ? "✓ Admin Mode Active" : "✎ Enter Customize Mode"}
                </button>
            </div>
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
