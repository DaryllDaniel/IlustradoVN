import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Play, RotateCcw } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
  onResume: () => void;
  onOptions: () => void;
  hasProgress: boolean;
}

export function TitleScreen({ onStart, onResume, onOptions, hasProgress }: TitleScreenProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const wittyMessages = {
    start: "Ignite the Revolution",
    resume: "Continue the Struggle",
    options: "Adjust Your Arsenal",
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ornamental background patterns */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Title Section */}
        <div className="text-center mb-16 animate-in fade-in duration-700">
          {/* Ornamental divider */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="text-primary text-3xl opacity-50">✦</div>
            <div className="text-primary text-3xl opacity-50">✦</div>
            <div className="text-primary text-3xl opacity-50">✦</div>
          </div>

          {/* Main title */}
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
            Ilustrado
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-accent font-serif italic mb-2">
            The Path of the Hero
          </p>

          {/* Tagline */}
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            A journey through the life of Jose Rizal—scholar, writer, revolutionary, and martyr.
            Your choices will shape the destiny of a nation.
          </p>

          {/* Ornamental divider */}
          <div className="flex justify-center gap-3 mt-6">
            <div className="text-primary text-3xl opacity-50">✦</div>
            <div className="text-primary text-3xl opacity-50">✦</div>
            <div className="text-primary text-3xl opacity-50">✦</div>
          </div>
        </div>

        {/* Button Section */}
        <div className="space-y-4 mb-8">
          {/* Start Button */}
          <div
            onMouseEnter={() => setHoveredButton('start')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group"
          >
            <Button
              onClick={onStart}
              className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 mr-3" />
              {wittyMessages.start}
            </Button>
            {hoveredButton === 'start' && (
              <p className="text-center text-sm text-muted-foreground mt-2 italic animate-in fade-in duration-200">
                Begin a new journey through Rizal's life
              </p>
            )}
          </div>

          {/* Resume Button */}
          {hasProgress && (
            <div
              onMouseEnter={() => setHoveredButton('resume')}
              onMouseLeave={() => setHoveredButton(null)}
              className="group"
            >
              <Button
                onClick={onResume}
                variant="outline"
                className="w-full h-16 text-lg font-bold border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                {wittyMessages.resume}
              </Button>
              {hoveredButton === 'resume' && (
                <p className="text-center text-sm text-muted-foreground mt-2 italic animate-in fade-in duration-200">
                  Resume your previous adventure
                </p>
              )}
            </div>
          )}

          {/* Options Button */}
          <div
            onMouseEnter={() => setHoveredButton('options')}
            onMouseLeave={() => setHoveredButton(null)}
            className="group"
          >
            <Button
              onClick={onOptions}
              variant="outline"
              className="w-full h-14 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Settings className="w-5 h-5 mr-3" />
              {wittyMessages.options}
            </Button>
            {hoveredButton === 'options' && (
              <p className="text-center text-sm text-muted-foreground mt-2 italic animate-in fade-in duration-200">
                Customize your experience
              </p>
            )}
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center text-sm text-muted-foreground space-y-2 border-t-2 border-primary pt-8">
          <p>
            "The youth is the hope of our nation."
          </p>
          <p className="italic">
            — Jose Rizal
          </p>
        </div>
      </div>
    </div>
  );
}
