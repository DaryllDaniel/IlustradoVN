import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, BookOpen } from 'lucide-react';

interface GameStats {
  totalChoicesMade: number;
  skillPointsEarned: number;
  awakeninglevelReached: number;
  dialoguesRead: number;
  pathsTaken: string[];
  finalSkills: {
    medicine: number;
    literature: number;
    fencing: number;
    languages: number;
  };
}

interface EndScreenProps {
  stats: GameStats;
  onReturnToTitle: () => void;
  endingType?: string;
}

export function EndScreen({ stats, onReturnToTitle, endingType = 'ending-revolutionary' }: EndScreenProps) {
  const wittyEndMessages = [
    "Your legacy lives on...",
    "The revolution continues...",
    "Rizal's dream endures...",
    "The nation remembers...",
    "Your sacrifice echoes through time...",
  ];

  const randomMessage = wittyEndMessages[Math.floor(Math.random() * wittyEndMessages.length)];

  const endingMessages: Record<string, { title: string; subtitle: string; description: string }> = {
    'ending-revolutionary': {
      title: 'The Revolutionary Martyr',
      subtitle: 'December 30, 1896 — Bagumbayan',
      description: 'You joined the Katipunan and fought for your people. Your sacrifice became the spark that ignited the revolution.',
    },
    'ending-healer': {
      title: 'The Healer\'s Legacy',
      subtitle: '1900 — Dapitan',
      description: 'You refused violence and dedicated yourself to healing. Your legacy became one of compassion and education.',
    },
    'ending-spy': {
      title: 'The Silent Operative',
      subtitle: '1898 — Underground Network',
      description: 'You became the revolution\'s greatest asset—a spy in plain sight, gathering intelligence and coordinating resistance.',
    },
    'ending-exile': {
      title: 'The Eternal Exile',
      subtitle: '1898 — Paris',
      description: 'You fled and continued your work from abroad. Your pen remained mightier than any sword.',
    },
    'ending-lover': {
      title: "The Lover's Choice",
      subtitle: '1895 — Dapitan',
      description: 'You chose love over revolution. In Josephine Bracken you found a reason to live — and built a quiet, beautiful life beside her in exile.',
    },
  };

  const currentEnding = endingMessages[endingType] || endingMessages['ending-revolutionary'];

  const highestSkill = Object.entries(stats.finalSkills).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  const backgroundClass = endingType === 'ending-lover'
    ? 'bg-gradient-to-br from-rose-900 via-pink-900 to-red-950'
    : 'bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-950';

  const closingQuote = endingType === 'ending-lover'
    ? { text: '"To live is to be among men, and to be among men is to struggle — but it is also to love."', author: '— Jose Rizal' }
    : { text: '"I die without seeing the dawn break on my country... But you shall see it and shall greet it with joy."', author: "— Jose Rizal's Last Letter" };

  return (
    <div className={`min-h-screen w-full ${backgroundClass} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Ornamental background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {endingType === 'ending-revolutionary' && (
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none">
          <img src="/images/cg/rizal_shot.png" alt="Bagumbayan" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 max-w-3xl w-full">
        {/* Title Section */}
        <div className="text-center mb-12 animate-in fade-in duration-700 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-primary/30 shadow-2xl">
          {/* Ornamental divider */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="text-accent text-3xl opacity-70">✦</div>
            <div className="text-accent text-3xl opacity-70">✦</div>
            <div className="text-accent text-3xl opacity-70">✦</div>
          </div>

          {/* Main message */}
          <h1 className="text-5xl md:text-6xl font-bold text-accent mb-4 tracking-tight drop-shadow-lg">
            {currentEnding.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-primary-foreground/90 font-serif italic drop-shadow-md">
            {currentEnding.subtitle}
          </p>

          {/* Ending Description */}
          <p className="text-lg text-primary-foreground mt-4 max-w-2xl mx-auto drop-shadow-md font-medium">
            {currentEnding.description}
          </p>

          {/* Ornamental divider */}
          <div className="flex justify-center gap-3 mt-6">
            <div className="text-accent text-3xl opacity-70">✦</div>
            <div className="text-accent text-3xl opacity-70">✦</div>
            <div className="text-accent text-3xl opacity-70">✦</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card/80 backdrop-blur-sm border-2 border-accent rounded-lg p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-accent mb-6 text-center">
            Your Journey in Numbers
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {/* Total Choices */}
            <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/30">
              <p className="text-3xl font-bold text-primary mb-1">
                {stats.totalChoicesMade}
              </p>
              <p className="text-sm text-muted-foreground">Choices Made</p>
            </div>

            {/* Skill Points */}
            <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/30">
              <p className="text-3xl font-bold text-primary mb-1">
                {stats.skillPointsEarned}
              </p>
              <p className="text-sm text-muted-foreground">Skill Points Earned</p>
            </div>

            {/* Awakening Level */}
            <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/30">
              <p className="text-3xl font-bold text-primary mb-1">
                {stats.awakeninglevelReached}
              </p>
              <p className="text-sm text-muted-foreground">Awakening Level</p>
            </div>

            {/* Dialogues Read */}
            <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/30">
              <p className="text-3xl font-bold text-primary mb-1">
                {stats.dialoguesRead}
              </p>
              <p className="text-sm text-muted-foreground">Dialogues Read</p>
            </div>

            {/* Highest Skill */}
            <div className="text-center p-4 bg-background/50 rounded-lg border border-primary/30 md:col-span-2">
              <p className="text-3xl font-bold text-primary mb-1">
                {highestSkill[0].charAt(0).toUpperCase() + highestSkill[0].slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                Highest Skill (Level {highestSkill[1]})
              </p>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-primary text-center mb-4">Final Skill Levels</p>
            {Object.entries(stats.finalSkills).map(([skill, level]) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground capitalize">
                  {skill}
                </span>
                <div className="flex-1 mx-4 h-2 bg-background rounded-full overflow-hidden border border-primary/30">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${(level / 10) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-primary w-8 text-right">{level}</span>
              </div>
            ))}
          </div>

          {/* Paths Taken */}
          {stats.pathsTaken.length > 0 && (
            <div className="border-t border-primary/30 pt-6">
              <p className="text-sm font-semibold text-primary mb-3">Paths Explored</p>
              <div className="flex flex-wrap gap-2">
                {stats.pathsTaken.map((path, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/50"
                  >
                    {path}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reflection Section */}
        <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 mb-8">
          <p className="text-center text-card-foreground italic leading-relaxed">
            {closingQuote.text}
          </p>
          <p className="text-center text-sm text-muted-foreground mt-4 font-serif">
            {closingQuote.author}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onReturnToTitle}
            className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            Return to the Beginning
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Thank you for experiencing Rizal's journey. Your choices matter.
          </p>
        </div>
      </div>
    </div>
  );
}
