import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PuzzleGallery } from '@/components/PuzzleGallery';

interface GameDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
  completedPuzzles: string[];
}

export function GameDrawer({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  isPlaying,
  onToggleMusic,
  completedPuzzles,
}: GameDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-96 bg-background/95 backdrop-blur-sm border-accent/50 p-8">
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

          {/* Puzzle Gallery */}
          <div className="pt-6 border-t border-accent/30">
            <PuzzleGallery completedPuzzles={completedPuzzles} />
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
