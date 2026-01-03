import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import { usePWA } from '../context/PWAContext';

export function PWAInstallPrompt() {
  const { showPrompt, install, dismiss } = usePWA();

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Download size={24} className="text-emerald-500" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-1">
                  Install Gym Tracker
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  Add to your home screen for quick access and offline use
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={install}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Install
                  </Button>
                  <Button
                    onClick={dismiss}
                    size="sm"
                    variant="outline"
                    className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  >
                    Not Now
                  </Button>
                </div>
              </div>

              <button
                onClick={dismiss}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
