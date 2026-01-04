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
  'Core',
  'Glutes',
  'Cardio',
  'Forearms',
  'Hamstrings',
  'Quads',
  'Calves',
  'Adductors',
  'Abductors',
];

const COMMON_EXERCISES = [

  // ===================== CHEST =====================
  { name: 'Barbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Flat Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Barbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Decline Barbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Close Grip Bench Press', muscleGroup: 'Chest' },
  { name: 'Paused Bench Press', muscleGroup: 'Chest' },
  { name: 'Floor Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Decline Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Neutral Grip Dumbbell Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest' },
  { name: 'Flat Dumbbell Fly', muscleGroup: 'Chest' },
  { name: 'Incline Dumbbell Fly', muscleGroup: 'Chest' },
  { name: 'Cable Fly', muscleGroup: 'Chest' },
  { name: 'Cable Crossover', muscleGroup: 'Chest' },
  { name: 'Low to High Cable Fly', muscleGroup: 'Chest' },
  { name: 'High to Low Cable Fly', muscleGroup: 'Chest' },
  { name: 'Single Arm Cable Fly', muscleGroup: 'Chest' },
  { name: 'Machine Chest Press', muscleGroup: 'Chest' },
  { name: 'Incline Chest Press Machine', muscleGroup: 'Chest' },
  { name: 'Pec Deck Fly', muscleGroup: 'Chest' },
  { name: 'Butterfly Machine', muscleGroup: 'Chest' },
  { name: 'Push-ups', muscleGroup: 'Chest' },
  { name: 'Wide Push-ups', muscleGroup: 'Chest' },
  { name: 'Decline Push-ups', muscleGroup: 'Chest' },
  { name: 'Chest Dips', muscleGroup: 'Chest' },

  // ===================== BACK =====================
  { name: 'Deadlift', muscleGroup: 'Back' },
  { name: 'Conventional Deadlift', muscleGroup: 'Back' },
  { name: 'Sumo Deadlift', muscleGroup: 'Back' },
  { name: 'Trap Bar Deadlift', muscleGroup: 'Back' },
  { name: 'Rack Pull', muscleGroup: 'Back' },
  { name: 'Deficit Deadlift', muscleGroup: 'Back' },
  { name: 'Romanian Deadlift', muscleGroup: 'Back' },
  { name: 'Snatch Grip Deadlift', muscleGroup: 'Back' },
  { name: 'Barbell Row', muscleGroup: 'Back' },
  { name: 'Bent Over Row', muscleGroup: 'Back' },
  { name: 'Pendlay Row', muscleGroup: 'Back' },
  { name: 'Dumbbell Row', muscleGroup: 'Back' },
  { name: 'Single Arm Dumbbell Row', muscleGroup: 'Back' },
  { name: 'Chest Supported Row', muscleGroup: 'Back' },
  { name: 'Seal Row', muscleGroup: 'Back' },
  { name: 'T-Bar Row', muscleGroup: 'Back' },
  { name: 'Landmine Row', muscleGroup: 'Back' },
  { name: 'Pull-ups', muscleGroup: 'Back' },
  { name: 'Wide Grip Pull-ups', muscleGroup: 'Back' },
  { name: 'Neutral Grip Pull-ups', muscleGroup: 'Back' },
  { name: 'Chin-ups', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Wide Grip Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Close Grip Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Single Arm Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', muscleGroup: 'Back' },
  { name: 'Single Arm Cable Row', muscleGroup: 'Back' },
  { name: 'Straight Arm Pulldown', muscleGroup: 'Back' },
  { name: 'Face Pull', muscleGroup: 'Back' },
  { name: 'Back Extension', muscleGroup: 'Back' },
  { name: 'Hyperextension', muscleGroup: 'Back' },
  { name: 'Reverse Hyperextension', muscleGroup: 'Back' },
  { name: 'Good Morning', muscleGroup: 'Back' },
  { name: 'Dumbbell Shrugs', muscleGroup: 'Back' },
  { name: 'Barbell Shrugs', muscleGroup: 'Back' },

  // ===================== SHOULDERS =====================
  { name: 'Barbell Overhead Press', muscleGroup: 'Shoulders' },
  { name: 'Standing Military Press', muscleGroup: 'Shoulders' },
  { name: 'Push Press', muscleGroup: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Seated Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders' },
  { name: 'Landmine Press', muscleGroup: 'Shoulders' },
  { name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Cable Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Lean Away Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Machine Lateral Raise', muscleGroup: 'Shoulders' },
  { name: 'Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Plate Front Raise', muscleGroup: 'Shoulders' },
  { name: 'Rear Delt Fly', muscleGroup: 'Shoulders' },
  { name: 'Cable Rear Delt Fly', muscleGroup: 'Shoulders' },
  { name: 'Reverse Pec Deck', muscleGroup: 'Shoulders' },
  { name: 'Upright Row', muscleGroup: 'Shoulders' },
  { name: 'Wide Grip Upright Row', muscleGroup: 'Shoulders' },

  // ===================== BICEPS =====================
  { name: 'Barbell Curl', muscleGroup: 'Biceps' },
  { name: 'EZ Bar Curl', muscleGroup: 'Biceps' },
  { name: 'Wide Grip Curl', muscleGroup: 'Biceps' },
  { name: 'Close Grip Curl', muscleGroup: 'Biceps' },
  { name: 'Drag Curl', muscleGroup: 'Biceps' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Alternating Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Cross Body Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps' },
  { name: 'Spider Curl', muscleGroup: 'Biceps' },
  { name: 'Cable Curl', muscleGroup: 'Biceps' },
  { name: 'Single Arm Cable Curl', muscleGroup: 'Biceps' },
  { name: 'High Cable Curl', muscleGroup: 'Biceps' },
  { name: 'Machine Bicep Curl', muscleGroup: 'Biceps' },
  { name: 'Reverse Curl', muscleGroup: 'Biceps' },
  { name: 'Reverse EZ Curl', muscleGroup: 'Biceps' },

  // ===================== TRICEPS =====================
  { name: 'Close Grip Bench Press', muscleGroup: 'Triceps' },
  { name: 'Dips (Triceps Focus)', muscleGroup: 'Triceps' },
  { name: 'Skull Crushers', muscleGroup: 'Triceps' },
  { name: 'EZ Bar Skull Crushers', muscleGroup: 'Triceps' },
  { name: 'Overhead Dumbbell Extension', muscleGroup: 'Triceps' },
  { name: 'Single Arm Dumbbell Extension', muscleGroup: 'Triceps' },
  { name: 'Overhead Cable Extension', muscleGroup: 'Triceps' },
  { name: 'Overhead Rope Extension', muscleGroup: 'Triceps' },
  { name: 'Cable Pushdown', muscleGroup: 'Triceps' },
  { name: 'Rope Pushdown', muscleGroup: 'Triceps' },
  { name: 'V-Bar Pushdown', muscleGroup: 'Triceps' },
  { name: 'Reverse Grip Pushdown', muscleGroup: 'Triceps' },
  { name: 'Kickbacks', muscleGroup: 'Triceps' },
  { name: 'JM Press', muscleGroup: 'Triceps' },

  // ===================== QUADS =====================
  { name: 'Back Squat', muscleGroup: 'Quads' },
  { name: 'Front Squat', muscleGroup: 'Quads' },
  { name: 'High Bar Squat', muscleGroup: 'Quads' },
  { name: 'Heel Elevated Squat', muscleGroup: 'Quads' },
  { name: 'Goblet Squat', muscleGroup: 'Quads' },
  { name: 'Box Squat', muscleGroup: 'Quads' },
  { name: 'Hack Squat', muscleGroup: 'Quads' },
  { name: 'Leg Press', muscleGroup: 'Quads' },
  { name: 'Narrow Leg Press', muscleGroup: 'Quads' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'Quads' },
  { name: 'Walking Lunges', muscleGroup: 'Quads' },
  { name: 'Reverse Lunges', muscleGroup: 'Quads' },
  { name: 'Step-ups', muscleGroup: 'Quads' },
  { name: 'Leg Extension', muscleGroup: 'Quads' },
  { name: 'Wall Sit', muscleGroup: 'Quads' },
  { name: 'Pistol Squat', muscleGroup: 'Quads' },
  { name: 'Jump Squats', muscleGroup: 'Quads' },

  // ===================== HAMSTRINGS =====================
  { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings' },
  { name: 'Stiff Leg Deadlift', muscleGroup: 'Hamstrings' },
  { name: 'Seated Leg Curl', muscleGroup: 'Hamstrings' },
  { name: 'Lying Leg Curl', muscleGroup: 'Hamstrings' },
  { name: 'Nordic Ham Curl', muscleGroup: 'Hamstrings' },
  { name: 'Glute Ham Raise', muscleGroup: 'Hamstrings' },
  { name: 'Cable Hamstring Curl', muscleGroup: 'Hamstrings' },
  { name: 'Single Leg Romanian Deadlift', muscleGroup: 'Hamstrings' },

  // ===================== GLUTES =====================
  { name: 'Hip Thrust', muscleGroup: 'Glutes' },
  { name: 'Barbell Hip Thrust', muscleGroup: 'Glutes' },
  { name: 'Dumbbell Hip Thrust', muscleGroup: 'Glutes' },
  { name: 'Glute Bridge', muscleGroup: 'Glutes' },
  { name: 'Barbell Glute Bridge', muscleGroup: 'Glutes' },
  { name: 'Cable Pull Through', muscleGroup: 'Glutes' },
  { name: 'Cable Kickback', muscleGroup: 'Glutes' },
  { name: 'Machine Kickback', muscleGroup: 'Glutes' },
  { name: 'Smith Machine Hip Thrust', muscleGroup: 'Glutes' },
  { name: 'Frog Pumps', muscleGroup: 'Glutes' },
  { name: 'Step-back Lunges', muscleGroup: 'Glutes' },

  // ===================== ADDUCTORS =====================
  { name: 'Hip Adduction Machine', muscleGroup: 'Adductors' },
  { name: 'Cable Hip Adduction', muscleGroup: 'Adductors' },
  { name: 'Cossack Squat', muscleGroup: 'Adductors' },
  { name: 'Sumo Squat', muscleGroup: 'Adductors' },
  { name: 'Wide Stance Leg Press', muscleGroup: 'Adductors' },

  // ===================== ABDUCTORS =====================
  { name: 'Hip Abduction Machine', muscleGroup: 'Abductors' },
  { name: 'Cable Hip Abduction', muscleGroup: 'Abductors' },
  { name: 'Banded Side Walks', muscleGroup: 'Abductors' },
  { name: 'Clamshells', muscleGroup: 'Abductors' },

  // ===================== CALVES =====================
  { name: 'Standing Calf Raise', muscleGroup: 'Calves' },
  { name: 'Seated Calf Raise', muscleGroup: 'Calves' },
  { name: 'Single Leg Calf Raise', muscleGroup: 'Calves' },
  { name: 'Donkey Calf Raise', muscleGroup: 'Calves' },
  { name: 'Leg Press Calf Raise', muscleGroup: 'Calves' },
  { name: 'Smith Machine Calf Raise', muscleGroup: 'Calves' },

  // ===================== CORE =====================
  { name: 'Plank', muscleGroup: 'Core' },
  { name: 'Side Plank', muscleGroup: 'Core' },
  { name: 'Weighted Plank', muscleGroup: 'Core' },
  { name: 'Crunches', muscleGroup: 'Core' },
  { name: 'Cable Crunch', muscleGroup: 'Core' },
  { name: 'Machine Crunch', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core' },
  { name: 'Captain Chair Leg Raise', muscleGroup: 'Core' },
  { name: 'Lying Leg Raise', muscleGroup: 'Core' },
  { name: 'Toes to Bar', muscleGroup: 'Core' },
  { name: 'Russian Twist', muscleGroup: 'Core' },
  { name: 'Cable Woodchopper', muscleGroup: 'Core' },
  { name: 'Pallof Press', muscleGroup: 'Core' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Core' },

  // ===================== FOREARMS =====================
  { name: 'Wrist Curl', muscleGroup: 'Forearms' },
  { name: 'Reverse Wrist Curl', muscleGroup: 'Forearms' },
  { name: 'Behind the Back Wrist Curl', muscleGroup: 'Forearms' },
  { name: 'Farmer’s Walk', muscleGroup: 'Forearms' },
  { name: 'Dead Hang', muscleGroup: 'Forearms' },
  { name: 'Plate Pinch Hold', muscleGroup: 'Forearms' },
  { name: 'Towel Pull-ups', muscleGroup: 'Forearms' },

  // ===================== CARDIO =====================
  { name: 'Treadmill Running', muscleGroup: 'Cardio' },
  { name: 'Incline Walking', muscleGroup: 'Cardio' },
  { name: 'Stationary Cycling', muscleGroup: 'Cardio' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio' },
  { name: 'Stair Climber', muscleGroup: 'Cardio' },
  { name: 'Jump Rope', muscleGroup: 'Cardio' },
  { name: 'Battle Ropes', muscleGroup: 'Cardio' },
  { name: 'Sled Push', muscleGroup: 'Cardio' },
  { name: 'Sled Drag', muscleGroup: 'Cardio' },
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
