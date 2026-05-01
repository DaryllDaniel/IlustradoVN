import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicControlsProps {
  isPlaying: boolean;
  volume: number;
  currentTrack?: string;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
}

export function MusicControls({
  isPlaying,
  volume,
  currentTrack,
  onTogglePlay,
  onVolumeChange,
}: MusicControlsProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-sm border border-accent/30 rounded-lg p-3 shadow-lg">
      {/* Music Icon */}
      <Music className="w-4 h-4 text-accent" />

      {/* Play/Pause Button */}
      <Button
        onClick={onTogglePlay}
        size="sm"
        variant="ghost"
        className="text-accent hover:bg-accent/20"
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? '⏸' : '▶'}
      </Button>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-32">
        {volume === 0 ? (
          <VolumeX className="w-4 h-4 text-accent/60" />
        ) : (
          <Volume2 className="w-4 h-4 text-accent" />
        )}
        <Slider
          value={[volume]}
          onValueChange={(value) => onVolumeChange(value[0])}
          max={1}
          step={0.01}
          className="flex-1"
        />
      </div>

      {/* Volume Percentage */}
      <span className="text-xs text-accent/70 w-8 text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
