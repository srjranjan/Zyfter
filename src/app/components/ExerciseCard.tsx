import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

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

interface ExerciseCardProps {
  exercise: Exercise;
  onUpdateExercise: (exercise: Exercise) => void;
  onDeleteExercise: (id: string) => void;
  onEditExercise: (exercise: Exercise) => void;
}

export function ExerciseCard({ 
  exercise, 
  onUpdateExercise, 
  onDeleteExercise,
  onEditExercise 
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSet = (setIndex: number, field: keyof Set, value: any) => {
    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };
    onUpdateExercise({ ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    const newSet: Set = {
      setNumber: exercise.sets.length + 1,
      reps: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].reps : 10,
      weight: exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].weight : 0,
      completed: false,
    };
    onUpdateExercise({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const removeSet = (setIndex: number) => {
    const updatedSets = exercise.sets
      .filter((_, i) => i !== setIndex)
      .map((set, i) => ({ ...set, setNumber: i + 1 }));
    onUpdateExercise({ ...exercise, sets: updatedSets });
  };

  const completedSets = exercise.sets.filter(s => s.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 mb-3"
    >
      {/* Exercise Header */}
      <div
        className="p-4 cursor-pointer active:bg-zinc-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 text-zinc-500 cursor-grab active:cursor-grabbing">
            <GripVertical size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white truncate">{exercise.name}</h3>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={20} className="text-zinc-400 flex-shrink-0" />
              </motion.div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="bg-zinc-800 text-zinc-300 text-xs"
              >
                {exercise.muscleGroup}
              </Badge>
              <span className="text-sm text-zinc-500">
                {completedSets}/{totalSets} sets
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Sets Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 pt-2 border-t border-zinc-800">
              {/* Sets Header */}
              <div className="grid grid-cols-[40px_1fr_1fr_50px] gap-3 mb-3 text-xs text-zinc-500 font-medium px-2">
                <div>SET</div>
                <div>REPS</div>
                <div>WEIGHT</div>
                <div></div>
              </div>

              {/* Sets List */}
              <div className="space-y-2">
                {exercise.sets.map((set, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`grid grid-cols-[40px_1fr_1fr_50px] gap-3 items-center ${
                      set.completed ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="text-zinc-400 font-medium text-center">
                      {set.setNumber}
                    </div>
                    
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value) || 0)}
                      className="h-11 bg-zinc-800 border-zinc-700 text-white text-center"
                      disabled={set.completed}
                    />
                    
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="h-11 bg-zinc-800 border-zinc-700 text-white text-center"
                      disabled={set.completed}
                    />
                    
                    <div className="flex items-center justify-center gap-1">
                      <Checkbox
                        checked={set.completed}
                        onCheckedChange={(checked) => updateSet(index, 'completed', checked)}
                        className="h-6 w-6 border-zinc-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      {exercise.sets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSet(index)}
                          className="h-8 w-8 p-0 text-zinc-500 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSet}
                  className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Set
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditExercise(exercise)}
                  className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteExercise(exercise.id)}
                  className="bg-zinc-800 border-zinc-700 text-red-500 hover:bg-red-950/30"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
