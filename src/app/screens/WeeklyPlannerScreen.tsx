import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Copy, Dumbbell, Moon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { format, addWeeks, startOfWeek, addDays } from 'date-fns';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: any[];
}

interface Workout {
  date: string;
  dayName: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

interface WeeklyPlannerScreenProps {
  workouts: Record<string, Workout>;
  currentWeekStart: Date;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onCopyPreviousWeek: () => void;
  onSelectDay: (date: string) => void;
}

export function WeeklyPlannerScreen({
  workouts,
  currentWeekStart,
  onNavigateWeek,
  onCopyPreviousWeek,
  onSelectDay,
}: WeeklyPlannerScreenProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStart, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date,
      dateStr,
      workout: workouts[dateStr] || {
        date: dateStr,
        dayName: format(date, 'EEEE'),
        exercises: [],
        isRestDay: false,
      },
    };
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-30">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Weekly Planner</h1>

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateWeek('prev')}
              className="text-zinc-400 hover:text-white"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="text-center">
              <div className="text-white font-medium">
                {format(currentWeekStart, 'MMM d')} -{' '}
                {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateWeek('next')}
              className="text-zinc-400 hover:text-white"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Copy Previous Week Button */}
        <Button
          onClick={onCopyPreviousWeek}
          className="w-full mb-6 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Copy size={18} className="mr-2" />
          Copy Previous Week
        </Button>

        {/* Day Cards */}
        <div className="space-y-3">
          {weekDays.map(({ date, dateStr, workout }) => {
            const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
            const completedCount = workout.exercises.filter((ex) =>
              ex.sets.every((s) => s.completed)
            ).length;
            const totalCount = workout.exercises.length;

            return (
              <motion.button
                key={dateStr}
                onClick={() => onSelectDay(dateStr)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full bg-zinc-900 rounded-2xl p-4 border transition-colors text-left ${
                  isToday
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">
                        {format(date, 'EEEE')}
                      </h3>
                      {isToday && (
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-xs">
                          Today
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      {format(date, 'MMMM d, yyyy')}
                    </p>
                  </div>

                  {workout.isRestDay ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full">
                      <Moon size={16} className="text-amber-500" />
                      <span className="text-sm text-amber-500 font-medium">
                        Rest
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full">
                      <Dumbbell size={16} className="text-emerald-500" />
                      <span className="text-sm text-emerald-500 font-medium">
                        Workout
                      </span>
                    </div>
                  )}
                </div>

                {!workout.isRestDay && (
                  <>
                    <div className="mb-2">
                      <h4 className="font-medium text-white">
                        {workout.dayName || 'Unnamed Workout'}
                      </h4>
                    </div>

                    {totalCount > 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                          {totalCount} exercise{totalCount !== 1 ? 's' : ''}
                        </span>
                        {completedCount > 0 && (
                          <span className="text-sm text-emerald-500">
                            {completedCount}/{totalCount} completed
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">No exercises planned</p>
                    )}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
