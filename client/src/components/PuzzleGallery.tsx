import React, { useState } from 'react';
import { Lock, Check, Image } from 'lucide-react';

interface PuzzleGalleryProps {
  completedPuzzles: string[];
  visitedScenes: string[];
}

export const PUZZLE_LIBRARY: Record<string, { title: string; imageUrl: string }> = {
  'puzzle-calamba-father': {
    title: "Father's Wisdom",
    imageUrl: '/images/cg/rizal_child.png',
  },
  'puzzle-ateneo-love': {
    title: "A Heart's Dilemma",
    imageUrl: '/images/cg/rizal_love.png',
  },
  'puzzle-europe-berlin': {
    title: 'The Ilustrado',
    imageUrl: '/images/cg/rizal_europe.png',
  },
  'puzzle-dapitan-intro': {
    title: 'Exile and Redemption',
    imageUrl: '/images/cg/rizal_shot.png',
  },
};

// Transition illustrations — unlocked when the player visits the transition scene
const ILLUSTRATION_LIBRARY: Array<{ sceneId: string; title: string; imageUrl: string; chapter: string }> = [
  {
    sceneId: 'calamba-father-transition',
    title: 'The Mentor',
    imageUrl: '/images/characters/Mentor_Transition.png',
    chapter: 'Chapter 1',
  },
  {
    sceneId: 'ateneo-love-transition',
    title: 'A Fateful Meeting',
    imageUrl: '/images/characters/Leonor_Transition.png',
    chapter: 'Chapter 2',
  },
  {
    sceneId: 'europe-intro-transition',
    title: 'Arrival in Europe',
    imageUrl: '/images/cg/europe_transition.png',
    chapter: 'Chapter 3',
  },
  {
    sceneId: 'dapitan-intro-transition',
    title: 'Exile in Dapitan',
    imageUrl: '/images/cg/dapitan_transition.png',
    chapter: 'Chapter 4',
  },
  {
    sceneId: 'trial-final-night-transition',
    title: 'Mi Último Adiós',
    imageUrl: '/images/cg/trial_final_night_transition.png',
    chapter: 'Chapter 5',
  },
];

export function PuzzleGallery({ completedPuzzles, visitedScenes }: PuzzleGalleryProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* --- Puzzle Gallery --- */}
      <div className="space-y-3">
        <h3 className="text-accent font-serif text-lg">Puzzle Gallery</h3>
        <p className="text-xs text-muted-foreground">
          Complete puzzles during scene transitions to unlock illustrations
        </p>

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
                onClick={() => isCompleted && setLightboxSrc(puzzle.imageUrl)}
              >
                <img
                  src={puzzle.imageUrl}
                  alt={puzzle.title}
                  className="w-full h-24 object-cover"
                />
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

      {/* --- Transition Illustrations --- */}
      <div className="space-y-3 pt-4 border-t border-accent/20">
        <h3 className="text-accent font-serif text-lg flex items-center gap-2">
          <Image className="w-4 h-4" />
          Illustrations
        </h3>
        <p className="text-xs text-muted-foreground">
          Unlocked as you journey through Rizal's story
        </p>

        <div className="grid grid-cols-2 gap-3">
          {ILLUSTRATION_LIBRARY.map((illus) => {
            const isUnlocked = visitedScenes.includes(illus.sceneId);

            return (
              <div
                key={illus.sceneId}
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                  isUnlocked
                    ? 'border-primary bg-primary/10 cursor-pointer hover:bg-primary/20'
                    : 'border-muted-foreground/30 bg-black/40 opacity-40'
                }`}
                onClick={() => isUnlocked && setLightboxSrc(illus.imageUrl)}
              >
                <img
                  src={illus.imageUrl}
                  alt={illus.title}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  {isUnlocked ? (
                    <div className="text-center px-1">
                      <p className="text-xs font-semibold text-primary-foreground line-clamp-2">{illus.title}</p>
                      <p className="text-xs text-primary-foreground/60 mt-0.5">{illus.chapter}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{illus.chapter}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-black/40 rounded-lg p-3 border border-primary/30">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-semibold">
              {ILLUSTRATION_LIBRARY.filter((i) => visitedScenes.includes(i.sceneId)).length}
            </span> / {ILLUSTRATION_LIBRARY.length} illustrations unlocked
          </p>
          <div className="w-full bg-black/40 rounded-full h-1.5 mt-2">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{
                width: `${(ILLUSTRATION_LIBRARY.filter((i) => visitedScenes.includes(i.sceneId)).length / ILLUSTRATION_LIBRARY.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-pointer"
          onClick={() => setLightboxSrc(null)}
        >
          <img
            src={lightboxSrc}
            alt="Full illustration"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <p className="absolute bottom-6 text-white/50 text-sm">Click anywhere to close</p>
        </div>
      )}
    </div>
  );
}
