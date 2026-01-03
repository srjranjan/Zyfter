import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { format, addWeeks, startOfWeek, parseISO } from 'date-fns';
import { HomeScreen } from './screens/HomeScreen';
import { AddExerciseScreen } from './screens/AddExerciseScreen';
import { WeeklyPlannerScreen } from './screens/WeeklyPlannerScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { BottomNavigation, Screen } from './components/BottomNavigation';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAIcons } from './components/PWAIcons';
import { Toaster } from './components/ui/sonner';
import { requestPersistentStorage } from './utils/pwa';

interface Set {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
}

interface Workout {
  date: string;
  dayName: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

interface Settings {
  weekStartDay: number;
  units: 'kg' | 'lbs';
  theme: 'dark' | 'light';
}

// Helper function to get initial workouts
const getInitialWorkouts = (): Record<string, Workout> => {
  const stored = localStorage.getItem('gymTrackerWorkouts');
  if (stored) {
    return JSON.parse(stored);
  }

  // Create initial week with sample data
  const today = new Date();
  const workouts: Record<string, Workout> = {};

  // Add today's workout
  const todayStr = format(today, 'yyyy-MM-dd');
  workouts[todayStr] = {
    date: todayStr,
    dayName: 'Push Day',
    isRestDay: false,
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { setNumber: 1, reps: 10, weight: 60, completed: false },
          { setNumber: 2, reps: 10, weight: 60, completed: false },
          { setNumber: 3, reps: 8, weight: 65, completed: false },
        ],
      },
      {
        id: '2',
        name: 'Overhead Press',
        muscleGroup: 'Shoulders',
        sets: [
          { setNumber: 1, reps: 10, weight: 40, completed: false },
          { setNumber: 2, reps: 10, weight: 40, completed: false },
          { setNumber: 3, reps: 8, weight: 45, completed: false },
        ],
      },
    ],
  };

  return workouts;
};

// Helper function to get initial settings
const getInitialSettings = (): Settings => {
  const stored = localStorage.getItem('gymTrackerSettings');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    weekStartDay: 1, // Monday
    units: 'kg',
    theme: 'dark',
  };
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [workouts, setWorkouts] = useState<Record<string, Workout>>(getInitialWorkouts);
  const [settings, setSettings] = useState<Settings>(getInitialSettings);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Initialize PWA features
  useEffect(() => {
    // Request persistent storage
    requestPersistentStorage();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('gymTrackerWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('gymTrackerSettings', JSON.stringify(settings));
  }, [settings]);

  // Get or create today's workout
  const getCurrentWorkout = (): Workout => {
    if (workouts[currentDate]) {
      return workouts[currentDate];
    }

    const newWorkout: Workout = {
      date: currentDate,
      dayName: format(parseISO(currentDate), 'EEEE'),
      exercises: [],
      isRestDay: false,
    };

    return newWorkout;
  };

  const currentWorkout = getCurrentWorkout();

  // Update exercise in current workout
  const handleUpdateExercise = (updatedExercise: Exercise) => {
    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.map((ex) =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    };

    setWorkouts({
      ...workouts,
      [currentDate]: updatedWorkout,
    });
  };

  // Delete exercise from current workout
  const handleDeleteExercise = (id: string) => {
    const updatedWorkout = {
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter((ex) => ex.id !== id),
    };

    setWorkouts({
      ...workouts,
      [currentDate]: updatedWorkout,
    });

    toast.success('Exercise removed');
  };

  // Add or update exercise
  const handleSaveExercise = (exercise: Omit<Exercise, 'id'>) => {
    if (editingExercise) {
      // Update existing exercise
      const updatedExercise = { ...exercise, id: editingExercise.id };
      handleUpdateExercise(updatedExercise);
      toast.success('Exercise updated');
    } else {
      // Add new exercise
      const newExercise: Exercise = {
        ...exercise,
        id: Date.now().toString(),
      };

      const updatedWorkout = {
        ...currentWorkout,
        exercises: [...currentWorkout.exercises, newExercise],
      };

      setWorkouts({
        ...workouts,
        [currentDate]: updatedWorkout,
      });

      toast.success('Exercise added');
    }

    setShowAddExercise(false);
    setEditingExercise(undefined);
  };

  // Open edit exercise screen
  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowAddExercise(true);
  };

  // Navigate weeks in planner
  const handleNavigateWeek = (direction: 'prev' | 'next') => {
    const weeks = direction === 'next' ? 1 : -1;
    setCurrentWeekStart(addWeeks(currentWeekStart, weeks));
  };

  // Copy previous week's routine
  const handleCopyPreviousWeek = () => {
    const prevWeekStart = addWeeks(currentWeekStart, -1);
    const newWorkouts = { ...workouts };

    for (let i = 0; i < 7; i++) {
      const prevDate = format(
        new Date(prevWeekStart.getTime() + i * 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      );
      const newDate = format(
        new Date(currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      );

      if (workouts[prevDate]) {
        newWorkouts[newDate] = {
          ...workouts[prevDate],
          date: newDate,
          exercises: workouts[prevDate].exercises.map((ex) => ({
            ...ex,
            id: Date.now().toString() + Math.random(),
            sets: ex.sets.map((set) => ({ ...set, completed: false })),
          })),
        };
      }
    }

    setWorkouts(newWorkouts);
    toast.success('Previous week copied successfully');
  };

  // Select a day from planner
  const handleSelectDay = (date: string) => {
    setCurrentDate(date);
    setCurrentScreen('home');
  };

  // Update settings
  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    setSettings({ ...settings, ...newSettings });
    toast.success('Settings updated');
  };

  // Export data
  const handleExportData = () => {
    const data = {
      workouts,
      settings,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Toaster theme="dark" position="top-center" />
      <PWAIcons />
      <PWAInstallPrompt />

      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-zinc-950 min-h-screen relative">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <HomeScreen
              key="home"
              workout={currentWorkout}
              onUpdateExercise={handleUpdateExercise}
              onDeleteExercise={handleDeleteExercise}
              onAddExercise={() => setShowAddExercise(true)}
              onEditExercise={handleEditExercise}
            />
          )}

          {currentScreen === 'planner' && (
            <WeeklyPlannerScreen
              key="planner"
              workouts={workouts}
              currentWeekStart={currentWeekStart}
              onNavigateWeek={handleNavigateWeek}
              onCopyPreviousWeek={handleCopyPreviousWeek}
              onSelectDay={handleSelectDay}
            />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsScreen key="analytics" workouts={workouts} />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              key="settings"
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onExportData={handleExportData}
            />
          )}
        </AnimatePresence>

        {/* Add/Edit Exercise Modal */}
        <AnimatePresence>
          {showAddExercise && (
            <AddExerciseScreen
              onClose={() => {
                setShowAddExercise(false);
                setEditingExercise(undefined);
              }}
              onSave={handleSaveExercise}
              editExercise={editingExercise}
            />
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      </div>
    </div>
  );
}