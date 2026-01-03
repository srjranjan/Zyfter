import { motion } from 'motion/react';
import { Calendar, Dumbbell } from 'lucide-react';
import { ExerciseCard } from '../components/ExerciseCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';

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

interface HomeScreenProps {
  workout: Workout;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  onAddExercise: () => void;
  onEditExercise: (exercise: Exercise) => void;
}

export function HomeScreen({
  workout,
  onUpdateExercise,
  onDeleteExercise,
  onAddExercise,
  onEditExercise,
}: HomeScreenProps) {
  const currentDate = new Date(workout.date);
  const completedExercises = workout.exercises.filter(ex =>
    ex.sets.every(set => set.completed)
  ).length;
  const totalExercises = workout.exercises.length;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar size={18} />
              <span className="text-sm">
                {format(currentDate, 'EEEE, MMMM d')}
              </span>
            </div>
            {!workout.isRestDay && totalExercises > 0 && (
              <span className="text-sm text-emerald-500 font-medium">
                {completedExercises}/{totalExercises} completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">
              {workout.dayName}
            </h1>
            {workout.isRestDay ? (
              <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                Rest Day
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                <Dumbbell size={14} className="mr-1" />
                Workout
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {workout.isRestDay ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={40} className="text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Rest Day</h2>
            <p className="text-zinc-400">
              Recovery is just as important as training.
            </p>
          </motion.div>
        ) : workout.exercises.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={40} className="text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Exercises Planned
            </h2>
            <p className="text-zinc-400 mb-6">
              Add your first exercise to start tracking
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {workout.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onUpdateExercise={onUpdateExercise}
                onDeleteExercise={onDeleteExercise}
                onEditExercise={onEditExercise}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      {!workout.isRestDay && <FloatingActionButton onClick={onAddExercise} />}
    </div>
  );
}
