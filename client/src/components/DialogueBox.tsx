import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGame, SKILL_POINT_MILESTONES } from '@/contexts/GameContext';
import { AlertCircle } from 'lucide-react';

interface DialogueOption {
  text: string;
  skillRequired?: 'medicine' | 'literature' | 'fencing' | 'languages';
  skillLevel?: number;
  awakeninglevelGain?: number;
  nextScene?: string;
}

interface DialogueBoxProps {
  character: string;
  dialogue: string;
  options: DialogueOption[];
  portraitUrl?: string;
  sceneId?: string;
  onOptionSelect: (option: DialogueOption) => void;
}

export function DialogueBox({
  character,
  dialogue,
  options,
  portraitUrl,
  sceneId,
  onOptionSelect,
}: DialogueBoxProps) {
  const { gameState, recordDialogue, recordChoice, addSkillPoints } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [skillPointsEarned, setSkillPointsEarned] = useState(0);
  const [skillPointsAwarded, setSkillPointsAwarded] = useState(false);

  // Check for skill point milestone - only award once per scene
  useEffect(() => {
    if (sceneId && SKILL_POINT_MILESTONES[sceneId] && isComplete && !skillPointsAwarded) {
      const points = SKILL_POINT_MILESTONES[sceneId];
      setSkillPointsEarned(points);
      addSkillPoints(points);
      setSkillPointsAwarded(true);
    }
  }, [sceneId, isComplete, skillPointsAwarded, addSkillPoints]);

  // Typewriter effect
  useEffect(() => {
    if (displayedText.length < dialogue.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(dialogue.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
    }
  }, [displayedText, dialogue, isComplete]);

  // Reset state when scene changes
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setSkillPointsEarned(0);
    setSkillPointsAwarded(false);
  }, [sceneId]);

  const handleOptionClick = (option: DialogueOption) => {
    recordChoice(option.text);
    recordDialogue(dialogue);
    onOptionSelect(option);
  };

  const isOptionAvailable = (option: DialogueOption): boolean => {
    if (!option.skillRequired || !option.skillLevel) return true;
    return gameState.skills[option.skillRequired] >= option.skillLevel;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Character Portrait and Dialogue */}
      <div className="flex gap-6 mb-6">
        {/* Portrait */}
        {portraitUrl && (
          <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
            <img
              src={portraitUrl}
              alt={character}
              className="w-full h-full object-cover rounded-lg border-2 border-primary shadow-lg"
            />
          </div>
        )}

        {/* Dialogue Box */}
        <div className="flex-1">
          {/* Character Name */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-primary">{character}</h3>
          </div>

          {/* Dialogue with ornamental border */}
          <div className="relative bg-card text-card-foreground p-6 rounded-lg border-2 border-primary shadow-lg">
            {/* Ornamental corner decorations */}
            <div className="absolute top-2 left-2 text-primary text-xl opacity-50">✦</div>
            <div className="absolute top-2 right-2 text-primary text-xl opacity-50">✦</div>
            <div className="absolute bottom-2 left-2 text-primary text-xl opacity-50">✦</div>
            <div className="absolute bottom-2 right-2 text-primary text-xl opacity-50">✦</div>

            {/* Dialogue text */}
            <p className="text-lg leading-relaxed italic text-card-foreground">
              {displayedText}
              {!isComplete && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Points Earned Notification */}
      {skillPointsEarned > 0 && isComplete && skillPointsAwarded && (
        <div className="mb-6 p-4 rounded-lg bg-accent/10 border-2 border-accent flex items-center gap-3 animate-in fade-in duration-500">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="font-bold text-accent">
              +{skillPointsEarned} Skill Points Earned!
            </p>
            <p className="text-sm text-muted-foreground">
              You now have {gameState.skillPointsAvailable} skill points to distribute.
            </p>
          </div>
        </div>
      )}

      {/* Dialogue Options */}
      {isComplete && (
        <div className="space-y-3 animate-in fade-in duration-500">
          {options.map((option, index) => {
            const available = isOptionAvailable(option);
            return (
              <div key={index} className="relative">
                <Button
                  onClick={() => handleOptionClick(option)}
                  disabled={!available}
                  className={`w-full text-left justify-start h-auto py-3 px-4 ${
                    available
                      ? 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  variant="outline"
                >
                  <span className="text-accent mr-3">→</span>
                  <span>{option.text}</span>
                  {option.skillRequired && option.skillLevel && (
                    <span className="ml-auto text-xs opacity-70">
                      ({option.skillRequired} {option.skillLevel}+)
                    </span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
