import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Settings, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PuzzleGallery } from '@/components/PuzzleGallery';

const RIZAL_TRIVIA = [
  {
    fact: "Rizal spoke over 22 languages, including Tagalog, Spanish, German, French, English, Latin, Greek, Arabic, Malay, Hebrew, and Sanskrit.",
    source: "Historical Records"
  },
  {
    fact: "Rizal was a polymath — he was simultaneously a novelist, poet, ophthalmologist, sculptor, painter, educator, farmer, historian, and fencer.",
    source: "Austin Craig, 'Lineage, Life and Labors of José Rizal'"
  },
  {
    fact: "Rizal's famous poem 'Mi Último Adiós' (My Last Farewell) was smuggled out of Fort Santiago inside an oil lamp the night before his execution.",
    source: "Ambeth Ocampo, 'Rizal Without the Overcoat'"
  },
  {
    fact: "He used the pen name 'Laong Laan' (one who is ever prepared) and 'Dimasalang' (one who cannot be touched) in his writings to evade Spanish censors.",
    source: "National Historical Commission of the Philippines"
  },
  {
    fact: "Rizal retracted to Catholicism hours before his execution. To this day, historians debate whether the retraction was genuine or coerced.",
    source: "Jaime Bulatao SJ, 'The Rizal Retraction'"
  },
  {
    fact: "While in Dapitan, Rizal built his own water pipeline system for the town — a feat of engineering accomplished during his four years of exile.",
    source: "Ricardo Pascual, 'Rizal Beyond the Grave'"
  },
  {
    fact: "Rizal won first prize in the Ateneo de Manila's poetry contest at age 14, defeating older students with his poem 'To the Philippine Youth'.",
    source: "National Historical Commission of the Philippines"
  },
  {
    fact: "He annotated Antonio Morga's 'Sucesos de las Islas Filipinas' (1609) to prove that Filipinos had a rich civilization before Spanish colonization.",
    source: "Leon Ma. Guerrero, 'The First Filipino'"
  },
  {
    fact: "Rizal was an avid chess player and reportedly never lost a game in Dapitan. He also bred fighting cocks and cultivated over 50 hectares of land.",
    source: "Ambeth Ocampo, 'Looking Back'"
  },
  {
    fact: "His novel 'El Filibusterismo' was dedicated to the three martyred priests — Fathers Mariano Gomez, José Burgos, and Jacinto Zamora (GomBurZa) — whose execution in 1872 inspired his lifelong fight for justice.",
    source: "Jose Rizal, 'El Filibusterismo' (1891)"
  },
];

interface GameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
  completedPuzzles: string[];
  visitedScenes: string[];
}

export function GameDrawer({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  isPlaying,
  onToggleMusic,
  completedPuzzles,
  visitedScenes,
}: GameDrawerProps) {
  const [triviaIndex, setTriviaIndex] = useState(0);

  const prevTrivia = () => setTriviaIndex((i) => (i - 1 + RIZAL_TRIVIA.length) % RIZAL_TRIVIA.length);
  const nextTrivia = () => setTriviaIndex((i) => (i + 1) % RIZAL_TRIVIA.length);

  const currentTrivia = RIZAL_TRIVIA[triviaIndex];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-96 bg-background/95 backdrop-blur-sm border-accent/50 p-8 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-accent font-serif text-2xl flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Options
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8 mt-6">
          {/* Audio Settings */}
          <div className="space-y-4">
            <h3 className="text-accent font-serif text-lg">Audio</h3>
            
            {/* Music Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-foreground">Background Music</span>
              <Button
                onClick={onToggleMusic}
                variant={isPlaying ? 'default' : 'outline'}
                size="sm"
                className={isPlaying ? 'bg-accent text-accent-foreground' : ''}
              >
                {isPlaying ? '♫ On' : '♫ Off'}
              </Button>
            </div>
            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-foreground">Volume</label>
                <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>

          {/* Did You Know? Trivia */}
          <div className="pt-6 border-t border-accent/30 space-y-3">
            <h3 className="text-accent font-serif text-lg flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Did You Know?
            </h3>
            <div className="bg-black/40 border border-primary/30 rounded-xl p-4 space-y-3 min-h-[120px] flex flex-col justify-between">
              <p className="text-sm text-foreground leading-relaxed italic">
                "{currentTrivia.fact}"
              </p>
              <p className="text-xs text-muted-foreground text-right">— {currentTrivia.source}</p>
            </div>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={prevTrivia} className="text-accent hover:text-accent/80">
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                {triviaIndex + 1} / {RIZAL_TRIVIA.length}
              </span>
              <Button variant="ghost" size="sm" onClick={nextTrivia} className="text-accent hover:text-accent/80">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Puzzle Gallery */}
          <div className="pt-6 border-t border-accent/30">
            <PuzzleGallery completedPuzzles={completedPuzzles} visitedScenes={visitedScenes} />
          </div>

          {/* Game Information */}
          <div className="space-y-4 pt-6 border-t border-accent/30">
            <h3 className="text-accent font-serif text-lg">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Ilustrado: The Path of the Hero</strong> is a narrative RPG that explores the life of Jose Rizal through interactive choices, skill development, and branching storylines that lead to different historical outcomes.
            </p>
            <p className="text-xs text-muted-foreground">
              Your choices shape the destiny of a nation.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
