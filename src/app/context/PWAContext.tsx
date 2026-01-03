import React, { createContext, useContext, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAContextType {
    deferredPrompt: BeforeInstallPromptEvent | null;
    showPrompt: boolean;
    install: () => Promise<void>;
    dismiss: () => void;
    canInstall: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Check if user has dismissed the prompt before
            const dismissed = localStorage.getItem('pwa-install-dismissed');
            if (!dismissed) {
                console.log('Showing install prompt');
                setShowPrompt(true);
            } else {
                console.log('Prompt dismissed before');
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if app is already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        console.log('Is standalone:', isStandalone);
        if (isStandalone) {
            setShowPrompt(false);
        }

        // Fallback for Android: show custom prompt if not installed and not dismissed
        const isAndroid = /Android/.test(navigator.userAgent);
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (isAndroid && !isStandalone && !dismissed) {
            console.log('Showing fallback prompt for Android');
            setTimeout(() => setShowPrompt(true), 3000); // Delay to allow page load
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowPrompt(false);
            setDeferredPrompt(null);
        }
    };

    const dismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    return (
        <PWAContext.Provider
            value={{
                deferredPrompt,
                showPrompt,
                install,
                dismiss,
                canInstall: !!deferredPrompt,
            }}
        >
            {children}
        </PWAContext.Provider>
    );
}

export function usePWA() {
    const context = useContext(PWAContext);
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
}
