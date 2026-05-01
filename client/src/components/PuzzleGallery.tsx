import React from 'react';
import { Lock, Check } from 'lucide-react';

interface PuzzleGalleryProps {
  completedPuzzles: string[];
}

export const PUZZLE_LIBRARY: Record<string, { title: string; imageUrl: string }> = {
  'puzzle-calamba-intro': {
    title: 'The Seed of Calamba',
    imageUrl: '/images/cg/rizal_child.png',
  },
  'puzzle-calamba-father': {
    title: 'Father\'s Wisdom',
    imageUrl: '/images/cg/rizal_child.png',
  },
  'puzzle-ateneo-intro': {
    title: 'The Student of Manila',
    imageUrl: '/images/cg/rizal_school.png',
  },
  'puzzle-ateneo-friends': {
    title: 'Kindred Spirits',
    imageUrl: '/images/cg/rizal_school.png',
  },
  'puzzle-ateneo-love': {
    title: 'A Heart\'s Dilemma',
    imageUrl: '/images/cg/rizal_love.png',
  },
  'puzzle-europe-intro': {
    title: 'The Wanderer in Europe',
    imageUrl: '/images/cg/rizal_europe.png',
  },
  'puzzle-europe-berlin': {
    title: 'The Ilustrado',
    imageUrl: '/images/cg/rizal_europe.png',
  },
  'puzzle-dapitan-intro': {
    title: 'Exile and Redemption',
    imageUrl: '/images/cg/rizal_europe.png', // Or maybe reuse school or love?
  },
  'puzzle-ending-revolutionary': {
    title: 'The Final Dawn',
    imageUrl: '/images/cg/rizal_shot.png',
  },
};

export function PuzzleGallery({ completedPuzzles }: PuzzleGalleryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-accent font-serif text-lg">Puzzle Gallery</h3>
      <p className="text-xs text-muted-foreground">
        Complete puzzles during scene transitions to unlock illustrations
      </p>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {Object.entries(PUZZLE_LIBRARY).map(([puzzleId, puzzle]) => {
          const isCompleted = completedPuzzles.includes(puzzleId);

          return (
            <div
              key={puzzleId}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                isCompleted
                  ? 'border-accent bg-accent/10 cursor-pointer hover:bg-accent/20'
                  : 'border-muted-foreground/30 bg-black/40 opacity-50'
              }`}
            >
              {/* Thumbnail */}
              <img
                src={puzzle.imageUrl}
                alt={puzzle.title}
                className="w-full h-24 object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {isCompleted ? (
                  <div className="text-center">
                    <Check className="w-6 h-6 text-accent mx-auto mb-1" />
                    <p className="text-xs font-semibold text-accent text-center px-1 line-clamp-2">
                      {puzzle.title}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground text-center px-1">Locked</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Stats */}
      <div className="bg-black/40 rounded-lg p-3 border border-accent/30">
        <p className="text-xs text-muted-foreground">
          <span className="text-accent font-semibold">{completedPuzzles.length}</span> / {Object.keys(PUZZLE_LIBRARY).length} puzzles completed
        </p>
        <div className="w-full bg-black/40 rounded-full h-1.5 mt-2">
          <div
            className="bg-accent h-full rounded-full transition-all"
            style={{ width: `${(completedPuzzles.length / Object.keys(PUZZLE_LIBRARY).length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
