import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, MapPin } from 'lucide-react';

interface ChapterSelectProps {
  onChapterSelect: (sceneId: string) => void;
}

const chapters = [
  {
    id: 1,
    title: 'The Seed of Calamba',
    startScene: 'calamba-intro',
    description: 'Your journey begins in Calamba, where your mother teaches you about enlightenment and the struggle of your people.',
    location: 'Calamba, Laguna Province, 1861',
    icon: '🌱',
  },
  {
    id: 2,
    title: 'The Student of Manila',
    startScene: 'ateneo-intro',
    description: 'At Ateneo Municipal, you pursue rigorous education and discover the power of literature and poetry.',
    location: 'Ateneo Municipal, Manila, 1872',
    icon: '📚',
  },
  {
    id: 3,
    title: 'The Wanderer in Europe',
    startScene: 'europe-intro',
    description: 'In Europe, you study medicine, master languages, and write "Noli Me Tangere" to expose injustice.',
    location: 'Madrid, Berlin, Paris, 1882-1887',
    icon: '🌍',
  },
  {
    id: 4,
    title: 'The Exile of Dapitan',
    startScene: 'dapitan-intro',
    description: 'Exiled to Dapitan, you continue to serve your people through teaching and healing.',
    location: 'Dapitan, Mindanao, 1892',
    icon: '⛰️',
  },
  {
    id: 5,
    title: 'The Martyr of Bagumbayan',
    startScene: 'bagumbayan-intro',
    description: 'Your final test awaits. Your legacy will inspire generations to come.',
    location: 'Bagumbayan, Manila, December 30, 1896',
    icon: '⭐',
  },
];

export function ChapterSelect({ onChapterSelect }: ChapterSelectProps) {
  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div className="text-center py-8 border-b-2 border-primary">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Choose Your Path
        </h1>
        <p className="text-lg text-muted-foreground italic">
          Select a chapter to begin or continue your journey through the life of Jose Rizal
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="relative p-6 rounded-lg bg-card border-2 border-primary hover:border-accent transition-all duration-300 hover:shadow-lg group"
          >
            {/* Chapter Number */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
              {chapter.id}
            </div>

            {/* Icon */}
            <div className="text-4xl mb-3">{chapter.icon}</div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-primary mb-2">
              {chapter.title}
            </h2>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{chapter.location}</span>
            </div>

            {/* Description */}
            <p className="text-card-foreground mb-4 leading-relaxed">
              {chapter.description}
            </p>

            {/* Button */}
            <Button
              onClick={() => onChapterSelect(chapter.startScene)}
              className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground group-hover:translate-y-[-2px] transition-transform"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Begin Chapter {chapter.id}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center py-6 border-t-2 border-primary text-muted-foreground italic">
        <p>
          Each chapter contains multiple branching paths and what-if scenarios.
          Your choices will shape Rizal's legacy and influence the awakening of the Filipino people.
        </p>
      </div>
    </div>
  );
}
