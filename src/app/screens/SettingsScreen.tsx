import { motion } from 'motion/react';
import { Moon, Sun, Calendar, Download, Dumbbell } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';

interface Settings {
  weekStartDay: number;
  units: 'kg' | 'lbs';
  theme: 'dark' | 'light';
}

interface SettingsScreenProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onExportData: () => void;
}

export function SettingsScreen({
  settings,
  onUpdateSettings,
  onExportData,
}: SettingsScreenProps) {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-30">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Personalization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Personalization
          </h2>

          <Card className="bg-zinc-900 border-zinc-800 divide-y divide-zinc-800">
            {/* Theme Toggle */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.theme === 'dark' ? (
                    <Moon size={20} className="text-zinc-400" />
                  ) : (
                    <Sun size={20} className="text-zinc-400" />
                  )}
                  <div>
                    <Label className="text-white font-medium">Dark Mode</Label>
                    <p className="text-sm text-zinc-500">
                      {settings.theme === 'dark' ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.theme === 'dark'}
                  onCheckedChange={(checked) =>
                    onUpdateSettings({ theme: checked ? 'dark' : 'light' })
                  }
                />
              </div>
            </div>

            {/* Week Start Day */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={20} className="text-zinc-400" />
                <div>
                  <Label className="text-white font-medium">Week Start Day</Label>
                  <p className="text-sm text-zinc-500">
                    Choose your preferred week start
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {weekDays.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => onUpdateSettings({ weekStartDay: index })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      settings.weekStartDay === index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Units */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Dumbbell size={20} className="text-zinc-400" />
                <div>
                  <Label className="text-white font-medium">Weight Units</Label>
                  <p className="text-sm text-zinc-500">
                    Select your preferred unit system
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {['kg', 'lbs'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() =>
                      onUpdateSettings({ units: unit as 'kg' | 'lbs' })
                    }
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      settings.units === unit
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {unit.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Data Management
          </h2>

          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <Download size={20} className="text-zinc-400" />
              <div>
                <Label className="text-white font-medium">Export Data</Label>
                <p className="text-sm text-zinc-500">
                  Download your workout data as JSON
                </p>
              </div>
            </div>
            <Button
              onClick={onExportData}
              variant="outline"
              className="w-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Download size={16} className="mr-2" />
              Export Workout Data
            </Button>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-zinc-500 text-sm">Gym Tracker v1.0.0</p>
          <p className="text-zinc-600 text-xs mt-1">
            Track your progress, achieve your goals
          </p>
        </motion.div>
      </div>
    </div>
  );
}
