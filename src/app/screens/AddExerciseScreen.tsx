import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Search, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

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

interface AddExerciseScreenProps {
  onClose: () => void;
  onSave: (exercise: Omit<Exercise, 'id'>) => void;
  editExercise?: Exercise;
}

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core',
  'Glutes',
  'Cardio',
];
const COMMON_EXERCISES = [
  // 🔴 CHEST
  { name: 'Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest' },
  { name: 'Decline Bench Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Chest Fly (Dumbbell)', muscleGroup: 'Chest' },
  { name: 'Cable Fly', muscleGroup: 'Chest' },
  { name: 'Low to High Cable Fly', muscleGroup: 'Chest' },
  { name: 'Push-ups', muscleGroup: 'Chest' },
  { name: 'Dips (Chest Focus)', muscleGroup: 'Chest' },
  { name: 'Machine Chest Press', muscleGroup: 'Chest' },
  { name: 'Pec Deck Fly', muscleGroup: 'Chest' },

  // 🔵 BACK
  { name: 'Deadlift', muscleGroup: 'Back' },
  { name: 'Barbell Row', muscleGroup: 'Back' },
  { name: 'Dumbbell Row', muscleGroup: 'Back' },
  { name: 'Pull-ups', muscleGroup: 'Back' },
  { name: 'Chin-ups', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', muscleGroup: 'Back' },
  { name: 'T-Bar Row', muscleGroup: 'Back' },
  { name: 'Straight Arm Pulldown', muscleGroup: 'Back' },
  { name: 'Face Pull', muscleGroup: 'Back' },
  { name: 'Back Extension', muscleGroup: 'Back' },
  { name: 'Rack Pull', muscleGroup: 'Back' },

  // 🟢 SHOULDERS
  { name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Rear Delt Fly', muscleGroup: 'Shoulders' },
  { name: 'Upright Row', muscleGroup: 'Shoulders' },
  { name: 'Cable Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Machine Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Reverse Pec Deck', muscleGroup: 'Shoulders' },

  // 🟡 BICEPS
  { name: 'Barbell Curl', muscleGroup: 'Biceps' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Concentration Curl', muscleGroup: 'Biceps' },
  { name: 'Cable Curl', muscleGroup: 'Biceps' },
  { name: 'EZ Bar Curl', muscleGroup: 'Biceps' },

  // 🟠 TRICEPS
  { name: 'Tricep Extensions', muscleGroup: 'Triceps' },
  { name: 'Close Grip Bench Press', muscleGroup: 'Triceps' },
  { name: 'Skull Crushers', muscleGroup: 'Triceps' },
  { name: 'Cable Pushdown', muscleGroup: 'Triceps' },
  { name: 'Overhead Dumbbell Extension', muscleGroup: 'Triceps' },
  { name: 'Dips (Triceps Focus)', muscleGroup: 'Triceps' },
  { name: 'Kickbacks', muscleGroup: 'Triceps' },
  { name: 'EZ Bar Skull Crushers', muscleGroup: 'Triceps' },

  // 🟤 LEGS
  { name: 'Squat', muscleGroup: 'Legs' },
  { name: 'Front Squat', muscleGroup: 'Legs' },
  { name: 'Leg Press', muscleGroup: 'Legs' },
  { name: 'Lunges', muscleGroup: 'Legs' },
  { name: 'Walking Lunges', muscleGroup: 'Legs' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'Legs' },
  { name: 'Leg Extension', muscleGroup: 'Legs' },
  { name: 'Leg Curl', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { name: 'Hip Thrust', muscleGroup: 'Legs' },
  { name: 'Glute Bridge', muscleGroup: 'Legs' },
  { name: 'Step-ups', muscleGroup: 'Legs' },

  // ⚫ CALVES
  { name: 'Standing Calf Raise', muscleGroup: 'Calves' },
  { name: 'Seated Calf Raise', muscleGroup: 'Calves' },
  { name: 'Donkey Calf Raise', muscleGroup: 'Calves' },
  { name: 'Single Leg Calf Raise', muscleGroup: 'Calves' },

  // 🟣 CORE / ABS
  { name: 'Plank', muscleGroup: 'Core' },
  { name: 'Side Plank', muscleGroup: 'Core' },
  { name: 'Crunches', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core' },
  { name: 'Lying Leg Raise', muscleGroup: 'Core' },
  { name: 'Russian Twist', muscleGroup: 'Core' },
  { name: 'Cable Crunch', muscleGroup: 'Core' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Core' },
  { name: 'Mountain Climbers', muscleGroup: 'Core' },

  // ⚪ FOREARMS
  { name: 'Wrist Curl', muscleGroup: 'Forearms' },
  { name: 'Reverse Wrist Curl', muscleGroup: 'Forearms' },
  { name: 'Farmer’s Walk', muscleGroup: 'Forearms' },
  { name: 'Dead Hang', muscleGroup: 'Forearms' },
  { name: 'Reverse Curl', muscleGroup: 'Forearms' },

  // 🔘 CARDIO / CONDITIONING
  { name: 'Running', muscleGroup: 'Cardio' },
  { name: 'Cycling', muscleGroup: 'Cardio' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio' },
  { name: 'Jump Rope', muscleGroup: 'Cardio' },
  { name: 'Stair Climber', muscleGroup: 'Cardio' },
  { name: 'Burpees', muscleGroup: 'Cardio' },
];

export function AddExerciseScreen({ onClose, onSave, editExercise }: AddExerciseScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exerciseName, setExerciseName] = useState(editExercise?.name || '');
  const [muscleGroup, setMuscleGroup] = useState(editExercise?.muscleGroup || '');
  const [numSets, setNumSets] = useState(editExercise?.sets.length || 3);
  const [defaultReps, setDefaultReps] = useState(
    editExercise?.sets[0]?.reps || 10
  );
  const [defaultWeight, setDefaultWeight] = useState(
    editExercise?.sets[0]?.weight || 0
  );

  const filteredExercises = COMMON_EXERCISES.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!exerciseName || !muscleGroup) return;

    const sets = Array.from({ length: numSets }, (_, i) => ({
      setNumber: i + 1,
      reps: editExercise?.sets[i]?.reps || defaultReps,
      weight: editExercise?.sets[i]?.weight || defaultWeight,
      completed: editExercise?.sets[i]?.completed || false,
    }));

    onSave({
      name: exerciseName,
      muscleGroup,
      sets,
    });
  };

  const selectExercise = (exercise: { name: string; muscleGroup: string }) => {
    setExerciseName(exercise.name);
    setMuscleGroup(exercise.muscleGroup);
    setSearchQuery('');
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-zinc-950 z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 z-10">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-white">
            {editExercise ? 'Edit Exercise' : 'Add Exercise'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {/* Search */}
        {!editExercise && (
          <div className="mb-6">
            <Label className="text-white mb-2">Search Exercise</Label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-2 bg-zinc-900 rounded-lg border border-zinc-800 max-h-48 overflow-y-auto">
                {filteredExercises.map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => selectExercise(exercise)}
                    className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{exercise.name}</span>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300 text-xs"
                      >
                        {exercise.muscleGroup}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exercise Name */}
        <div className="mb-6">
          <Label className="text-white mb-2">Exercise Name</Label>
          <Input
            type="text"
            placeholder="Enter exercise name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white"
          />
        </div>

        {/* Muscle Group */}
        <div className="mb-6">
          <Label className="text-white mb-2">Muscle Group</Label>
          <div className="flex flex-wrap gap-2">
            {MUSCLE_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setMuscleGroup(group)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  muscleGroup === group
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Sets */}
        <div className="mb-6">
          <Label className="text-white mb-2">Number of Sets</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNumSets(Math.max(1, numSets - 1))}
              className="bg-zinc-900 border-zinc-800 text-white h-12 w-12"
            >
              <Minus size={20} />
            </Button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-bold text-white">{numSets}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNumSets(numSets + 1)}
              className="bg-zinc-900 border-zinc-800 text-white h-12 w-12"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        {/* Default Reps */}
        <div className="mb-6">
          <Label className="text-white mb-2">Default Reps</Label>
          <Input
            type="number"
            value={defaultReps}
            onChange={(e) => setDefaultReps(parseInt(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-center"
          />
        </div>

        {/* Default Weight */}
        <div className="mb-6">
          <Label className="text-white mb-2">Default Weight (kg)</Label>
          <Input
            type="number"
            value={defaultWeight}
            onChange={(e) => setDefaultWeight(parseFloat(e.target.value) || 0)}
            className="bg-zinc-900 border-zinc-800 text-white text-center"
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!exerciseName || !muscleGroup}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
          >
            {editExercise ? 'Save Changes' : 'Add Exercise'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
