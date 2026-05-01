import React from 'react';

interface ImmersiveSceneProps {
  backgroundImage: string;
  children: React.ReactNode;
}

export function ImmersiveScene({ backgroundImage, children }: ImmersiveSceneProps) {
  return (
    <div
      className="h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none z-0" />

      {/* Full-screen content layer — children fill the entire scene */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>
    </div>
  );
}
