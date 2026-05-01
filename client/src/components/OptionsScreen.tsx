import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Volume2, VolumeX, Music } from 'lucide-react';

interface OptionsScreenProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
  onClose: () => void;
}

export function OptionsScreen({
  volume,
  onVolumeChange,
  isPlaying,
  onToggleMusic,
  onClose,
}: OptionsScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Options Modal */}
      <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-950 border-2 border-accent rounded-lg p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Ornamental background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-accent">Adjust Your Arsenal</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-accent hover:bg-accent/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Ornamental divider */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="text-accent text-2xl opacity-70">✦</div>
            <div className="text-accent text-2xl opacity-70">✦</div>
            <div className="text-accent text-2xl opacity-70">✦</div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* Audio Settings */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-accent flex items-center gap-2">
                <Music className="w-5 h-5" />
                Audio Settings
              </h3>

              {/* Volume Control */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary-foreground/80">
                    Master Volume
                  </label>
                  <span className="text-sm text-accent font-bold">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-accent/60 flex-shrink-0" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-accent flex-shrink-0" />
                  )}
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => onVolumeChange(value[0])}
                    max={1}
                    step={0.01}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Music Toggle */}
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-primary-foreground/80">
                    Background Music
                  </label>
                  <Button
                    onClick={onToggleMusic}
                    variant={isPlaying ? 'default' : 'outline'}
                    size="sm"
                    className={isPlaying ? 'bg-accent text-accent-foreground' : ''}
                  >
                    {isPlaying ? '🎵 On' : '🔇 Off'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-3 bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-bold text-accent">About This Game</h3>
              <p className="text-xs text-primary-foreground/70 leading-relaxed">
                Ilustrado: The Path of the Hero is a narrative RPG exploring the life of Jose Rizal through branching choices, skill progression, and multiple endings based on your decisions.
              </p>
            </div>

            {/* Ornamental divider */}
            <div className="flex justify-center gap-2">
              <div className="text-accent text-lg opacity-70">✦</div>
              <div className="text-accent text-lg opacity-70">✦</div>
              <div className="text-accent text-lg opacity-70">✦</div>
            </div>

            {/* Close Button */}
            <Button
              onClick={onClose}
              className="w-full bg-accent text-accent-foreground hover:bg-primary font-bold py-3 rounded-lg"
            >
              Return to Story
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
