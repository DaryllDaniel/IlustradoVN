import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { AlertCircle, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HISTORICAL_TERMS } from '@/lib/historicalTerms';

interface DialogueOption {
  text: string;
  skillRequired?: 'medicine' | 'literature' | 'fencing' | 'languages';
  skillLevel?: number;
  awakeninglevelGain?: number;
  nextScene?: string;
}

interface TransparentDialogueBoxProps {
  character: string;
  dialogue: string;
  options: DialogueOption[];
  portraitUrl?: string;
  sceneId?: string;
  skillPointReward?: number;
  onOptionSelect: (option: DialogueOption) => void;
  onOpenSkills?: () => void;
}

export function TransparentDialogueBox({
  character,
  dialogue,
  options,
  portraitUrl,
  sceneId,
  skillPointReward = 0,
  onOptionSelect,
  onOpenSkills,
}: TransparentDialogueBoxProps) {
  const { gameState, recordDialogue, recordChoice, addSkillPoints } = useGame();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [skillPointsEarned, setSkillPointsEarned] = useState(skillPointReward);
  const [skillPointsAwarded, setSkillPointsAwarded] = useState(false);

  // Check for skill point milestone - only award once per scene
  // Skill points are awarded based on sceneId through the parent component
  useEffect(() => {
    if (isComplete && !skillPointsAwarded && skillPointsEarned > 0) {
      addSkillPoints(skillPointsEarned);
      setSkillPointsAwarded(true);
      if (onOpenSkills) {
        // Slight delay to let the points notification render first
        setTimeout(onOpenSkills, 500);
      }
    }
  }, [isComplete, skillPointsAwarded, skillPointsEarned, addSkillPoints, onOpenSkills]);

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
    setSkillPointsEarned(skillPointReward);
    setSkillPointsAwarded(false);
    setPortraitError(false); // Fix: Reset error state so next scene's portrait can load
  }, [sceneId, skillPointReward, portraitUrl]);

  const handleOptionClick = (option: DialogueOption) => {
    recordChoice(option.text);
    recordDialogue(dialogue);
    onOptionSelect(option);
  };

  const isOptionAvailable = (option: DialogueOption): boolean => {
    if (!option.skillRequired || !option.skillLevel) return true;
    return gameState.skills[option.skillRequired] >= option.skillLevel;
  };

  const renderWithTooltips = (text: string) => {
    const terms = Object.keys(HISTORICAL_TERMS);
    if (terms.length === 0) return text;
    
    // Sort terms by length descending so longer phrases match first (e.g. Noli Me Tangere before Noli)
    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
    // Escape special regex characters
    const escapedTerms = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const termsRegex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
    
    const parts = text.split(termsRegex);
    
    return parts.map((part, i) => {
      const termKey = sortedTerms.find(t => t.toLowerCase() === part.toLowerCase());
      if (termKey) {
        return (
          <Tooltip key={i} delayDuration={0}>
            <TooltipTrigger asChild>
              <span className="text-amber-400 font-bold underline decoration-dotted decoration-amber-400/50 cursor-help hover:text-amber-300 transition-colors inline-block relative z-10">
                {part}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm leading-snug p-3 bg-black/90 border border-amber-500/30 text-amber-50">
              {HISTORICAL_TERMS[termKey]}
            </TooltipContent>
          </Tooltip>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const [portraitError, setPortraitError] = useState(false);
  const showChoices = isComplete && options.length > 0;
  const showPortrait = portraitUrl && !showChoices;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-end">

      {/* ── Character Sprite illustration (Larger, standing on background) ── */}
      <AnimatePresence mode="wait">
        {showPortrait && (
          <motion.div 
            key={portraitUrl}
            initial={{ x: -100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute bottom-[20vh] left-0 md:left-[10%] z-10 pointer-events-none h-[500px] flex items-end"
          >
            <div className="relative h-[500px] w-auto">
              {!portraitError ? (
                <img
                  src={portraitUrl}
                  alt={character}
                  onError={() => setPortraitError(true)}
                  className="h-[500px] w-auto object-contain object-bottom drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-b from-slate-700/50 to-transparent" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dark scrim + choices (above the dialogue box, no overlap) ── */}
      {showChoices && (
        <>
          <div className="absolute inset-0 bg-black/60 z-30 pointer-events-auto" />
          <div className="absolute top-0 left-0 right-0 z-50 pointer-events-auto px-4 pt-24">
            <div className="flex flex-col gap-3 max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
              {options.map((option, index) => {
                const available = isOptionAvailable(option);
                return (
                  <Button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={!available}
                    className={`w-full text-center h-auto py-4 px-6 text-lg font-medium transition-all whitespace-normal flex-wrap ${
                      available
                        ? 'bg-slate-900/95 text-white hover:bg-slate-800 hover:scale-[1.01] border-2 border-slate-500 hover:border-blue-400 shadow-2xl'
                        : 'bg-slate-900/60 text-white/40 cursor-not-allowed border-2 border-slate-700'
                    }`}
                    variant="outline"
                  >
                    <span>{option.text}</span>
                    {option.skillRequired && option.skillLevel && (
                      <span className="ml-3 text-sm opacity-70 border border-current px-2 py-0.5 rounded">
                        [{option.skillRequired} Lvl {option.skillLevel}+]
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Skill Points & Upgrade button (hidden when choices are showing) ── */}
      {!showChoices && (
        <div className="absolute bottom-[200px] right-4 md:right-8 z-30 pointer-events-auto flex flex-col items-end gap-3">
          {skillPointsEarned > 0 && isComplete && skillPointsAwarded && (
            <div className="p-3 rounded-lg bg-accent/90 backdrop-blur-md border-2 border-white shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-500">
              <AlertCircle className="w-6 h-6 text-slate-900 flex-shrink-0" />
              <p className="font-bold text-slate-900 text-sm">
                +{skillPointsEarned} Skill Points!
              </p>
            </div>
          )}
          {isComplete && (
            <Button
              onClick={onOpenSkills}
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl font-bold flex items-center gap-2 py-6 px-6 rounded-full animate-in fade-in duration-500"
              title="Upgrade your skills"
            >
              <Zap className="w-5 h-5" />
              <span>Upgrade Skills</span>
            </Button>
          )}
        </div>
      )}

      {/* ── Dialogue box (always at the bottom) ── */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={sceneId}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-20 pointer-events-auto w-full"
        >
          {/* Character Name Tab — clean, no portrait/initials */}
          <div className="absolute -top-10 left-4 md:left-8 bg-gradient-to-r from-blue-900 to-slate-800 border-t-2 border-l-2 border-r-2 border-blue-400/70 px-6 py-2 rounded-t-lg shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
            <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-md">
              {character}
            </span>
          </div>

          {/* Text Box */}
          <div className="w-full bg-slate-900/90 backdrop-blur-md border-t-2 border-blue-500/40 p-6 md:p-10 min-h-[180px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <p className="text-lg md:text-xl text-white leading-relaxed tracking-wide font-medium max-w-5xl mx-auto">
              {renderWithTooltips(displayedText)}
              {!isComplete && <span className="animate-pulse ml-1 text-accent">▼</span>}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
