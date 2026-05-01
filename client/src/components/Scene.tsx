import React from 'react';

interface SceneProps {
  title: string;
  location: string;
  backgroundImage?: string;
  children: React.ReactNode;
}

export function Scene({
  title,
  location,
  backgroundImage,
  children,
}: SceneProps) {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Scene Header with ornamental design */}
      <div className="relative text-center py-8 border-y-2 border-primary bg-card/50">
        {/* Ornamental dividers */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-primary text-2xl opacity-50">✦</div>
          <div className="text-primary text-2xl opacity-50">✦</div>
          <div className="text-primary text-2xl opacity-50">✦</div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>

        {/* Location */}
        <p className="text-lg text-muted-foreground italic">{location}</p>

        {/* Ornamental dividers */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-primary text-2xl opacity-50">✦</div>
          <div className="text-primary text-2xl opacity-50">✦</div>
          <div className="text-primary text-2xl opacity-50">✦</div>
        </div>
      </div>

      {/* Scene Content */}
      <div className="bg-background text-foreground">
        {children}
      </div>
    </div>
  );
}
