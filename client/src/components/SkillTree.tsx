import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Sword, Globe, Plus } from 'lucide-react';

const skillDescriptions = {
  literature: {
    name: 'Literature',
    description: 'Write influential articles and novels',
    icon: BookOpen,
    color: 'text-accent',
  },
  medicine: {
    name: 'Medicine',
    description: 'Heal NPCs and gain community trust',
    icon: Heart,
    color: 'text-destructive',
  },
  fencing: {
    name: 'Fencing & Martial Arts',
    description: 'Self-defense during travels',
    icon: Sword,
    color: 'text-primary',
  },
  languages: {
    name: 'Languages',
    description: 'Unlock dialogue with international characters',
    icon: Globe,
    color: 'text-secondary',
  },
};

export function SkillTree() {
  const { gameState, updateSkill } = useGame();

  const canUpgradeSkill = (skill: keyof typeof gameState.skills): boolean => {
    return gameState.skillPointsAvailable > 0 && gameState.skills[skill] < 10;
  };

  return (
    <div className="w-full bg-card text-card-foreground rounded-lg border-2 border-primary p-6 shadow-lg">
      {/* Title and Skill Points Display */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Polymath Skills</h2>
        <div className="bg-accent/10 border-2 border-accent rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground">Available Points</p>
          <p className="text-2xl font-bold text-accent">
            {gameState.skillPointsAvailable}
          </p>
        </div>
      </div>

      {/* Skill Points Info */}
      {gameState.skillPointsAvailable === 0 && (
        <div className="mb-6 p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          Complete story milestones to earn skill points!
        </div>
      )}

      {/* Constellation-style skill display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.entries(skillDescriptions) as Array<[keyof typeof skillDescriptions, typeof skillDescriptions[keyof typeof skillDescriptions]]>).map(
          ([skillKey, skillData]) => {
            const Icon = skillData.icon;
            const currentLevel = gameState.skills[skillKey as keyof typeof gameState.skills];
            const canUpgrade = canUpgradeSkill(skillKey as keyof typeof gameState.skills);

            return (
              <div
                key={skillKey}
                className="relative p-4 rounded-lg bg-popover border border-border hover:border-accent transition-colors"
              >
                {/* Skill Header */}
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${skillData.color}`} />
                  <div>
                    <h3 className="font-bold text-lg text-card-foreground">
                      {skillData.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {skillData.description}
                    </p>
                  </div>
                </div>

                {/* Skill Level Display */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Level
                    </span>
                    <span className="text-lg font-bold text-accent">
                      {currentLevel}/10
                    </span>
                  </div>

                  {/* Skill Level Bar */}
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-300"
                      style={{ width: `${(currentLevel / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Constellation dots */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < currentLevel ? 'bg-accent' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>

                {/* Upgrade Button */}
                <Button
                  onClick={() => updateSkill(skillKey as keyof typeof gameState.skills, 1)}
                  disabled={!canUpgrade}
                  className="w-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground"
                  size="sm"
                >
                  {currentLevel >= 10 ? (
                    'Mastered'
                  ) : canUpgrade ? (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Upgrade (1 point)
                    </>
                  ) : (
                    'No Points'
                  )}
                </Button>
              </div>
            );
          }
        )}
      </div>

      {/* Awakening Level */}
      <div className="mt-6 p-4 rounded-lg bg-popover border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">
          Filipino Awakening Level
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Influence on the people
          </span>
          <span className="text-lg font-bold text-accent">
            {gameState.awakeninglevel}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent to-primary h-full transition-all duration-300"
            style={{ width: `${gameState.awakeninglevel}%` }}
          />
        </div>
      </div>
    </div>
  );
}
