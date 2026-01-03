import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, Dumbbell, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { format, subDays, parseISO } from 'date-fns';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Array<{
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
  }>;
}

interface Workout {
  date: string;
  dayName: string;
  exercises: Exercise[];
  isRestDay: boolean;
}

interface AnalyticsScreenProps {
  workouts: Record<string, Workout>;
}

export function AnalyticsScreen({ workouts }: AnalyticsScreenProps) {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, timeRange);
    const workoutArray = Object.values(workouts);

    // Filter workouts within time range
    const recentWorkouts = workoutArray.filter((w) => {
      const workoutDate = parseISO(w.date);
      return workoutDate >= startDate && workoutDate <= today && !w.isRestDay;
    });

    // Total workouts completed
    const totalWorkouts = recentWorkouts.filter((w) =>
      w.exercises.some((ex) => ex.sets.some((s) => s.completed))
    ).length;

    // Calculate max weight
    let maxWeight = 0;
    let maxWeightExercise = '';
    
    recentWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.completed && set.weight > maxWeight) {
            maxWeight = set.weight;
            maxWeightExercise = exercise.name;
          }
        });
      });
    });

    // Most trained muscle group
    const muscleGroupCount: Record<string, number> = {};
    recentWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const completedSets = exercise.sets.filter((s) => s.completed).length;
        if (completedSets > 0) {
          muscleGroupCount[exercise.muscleGroup] =
            (muscleGroupCount[exercise.muscleGroup] || 0) + 1;
        }
      });
    });
    
    const mostTrainedMuscle = Object.entries(muscleGroupCount).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || 'N/A';

    // Weekly volume data (for bar chart)
    const volumeByDate: Record<string, number> = {};
    recentWorkouts.forEach((workout) => {
      let dayVolume = 0;
      workout.exercises.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          if (set.completed) {
            dayVolume += set.reps * set.weight;
          }
        });
      });
      volumeByDate[workout.date] = dayVolume;
    });

    const volumeData = Array.from({ length: Math.min(timeRange, 14) }, (_, i) => {
      const date = subDays(today, timeRange === 7 ? 6 - i : Math.min(timeRange, 14) - 1 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: format(date, 'MMM d'),
        volume: volumeByDate[dateStr] || 0,
      };
    });

    // Progress data for bench press (example)
    const benchPressData = recentWorkouts
      .flatMap((workout) =>
        workout.exercises
          .filter((ex) => ex.name.toLowerCase().includes('bench'))
          .map((ex) => ({
            date: format(parseISO(workout.date), 'MMM d'),
            weight: Math.max(...ex.sets.filter((s) => s.completed).map((s) => s.weight)),
          }))
      )
      .filter((d) => d.weight > 0);

    return {
      totalWorkouts,
      maxWeight,
      maxWeightExercise,
      mostTrainedMuscle,
      volumeData,
      benchPressData,
    };
  }, [workouts, timeRange]);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-30">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-white mb-4">Progress</h1>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                onClick={() => setTimeRange(days as 7 | 30 | 90)}
                variant={timeRange === days ? 'default' : 'outline'}
                size="sm"
                className={
                  timeRange === days
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData.totalWorkouts}
                  </div>
                  <div className="text-xs text-zinc-400">Workouts</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Award size={20} className="text-amber-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData.maxWeight}
                    <span className="text-sm text-zinc-400 ml-1">kg</span>
                  </div>
                  <div className="text-xs text-zinc-400">Max Weight</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Dumbbell size={20} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-sm text-zinc-400">Most Trained</div>
                  <div className="font-semibold text-white">
                    {analyticsData.mostTrainedMuscle}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="bg-zinc-900 border-zinc-800 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-emerald-500" />
              <h3 className="font-semibold text-white">Total Volume</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsData.volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: '#71717a', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="volume" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Progress Chart */}
        {analyticsData.benchPressData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Award size={20} className="text-amber-500" />
                <h3 className="font-semibold text-white">Bench Press Progress</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analyticsData.benchPressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis
                    dataKey="date"
                    stroke="#71717a"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#71717a"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {analyticsData.totalWorkouts === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={40} className="text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Data Yet
            </h2>
            <p className="text-zinc-400">
              Complete some workouts to see your progress
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
