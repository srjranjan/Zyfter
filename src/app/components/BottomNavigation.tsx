import { motion } from 'motion/react';
import { Home, Calendar, TrendingUp, Settings } from 'lucide-react';

export type Screen = 'home' | 'planner' | 'analytics' | 'settings';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Today' },
    { id: 'planner' as Screen, icon: Calendar, label: 'Planner' },
    { id: 'analytics' as Screen, icon: TrendingUp, label: 'Progress' },
    { id: 'settings' as Screen, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 safe-area-pb z-40">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 relative"
            >
              <motion.div
                animate={{
                  color: isActive ? '#10b981' : '#71717a',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={22} strokeWidth={2} />
              </motion.div>
              
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-emerald-500 font-medium' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
