import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Zap } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  requiredLevel?: number;
  category: 'literature' | 'medicine' | 'fencing' | 'languages';
  icon: string;
  unlocks?: string[];
}

const SKILL_TREE: Record<string, SkillNode> = {
  // LITERATURE TREE
  'lit-1': {
    id: 'lit-1',
    name: 'Eloquent Writing',
    description: 'Master the art of persuasive writing and rhetoric',
    level: 1,
    maxLevel: 3,
    category: 'literature',
    icon: '✍️',
    unlocks: ['lit-2', 'lit-3'],
  },
  'lit-2': {
    id: 'lit-2',
    name: 'Satirical Critique',
    description: 'Write biting social commentary that exposes injustice',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'literature',
    icon: '⚔️',
    unlocks: ['lit-4'],
  },
  'lit-3': {
    id: 'lit-3',
    name: 'Poetic Expression',
    description: 'Craft beautiful verses that move hearts and minds',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'literature',
    icon: '🌹',
    unlocks: ['lit-5'],
  },
  'lit-4': {
    id: 'lit-4',
    name: 'Revolutionary Novel',
    description: 'Write a novel that will inspire a nation (Noli Me Tangere)',
    level: 3,
    maxLevel: 1,
    requiredLevel: 3,
    category: 'literature',
    icon: '📖',
    unlocks: [],
  },
  'lit-5': {
    id: 'lit-5',
    name: 'Propaganda Mastery',
    description: 'Create propaganda that spreads revolutionary ideas',
    level: 3,
    maxLevel: 2,
    requiredLevel: 3,
    category: 'literature',
    icon: '📢',
    unlocks: [],
  },

  // MEDICINE TREE
  'med-1': {
    id: 'med-1',
    name: 'Medical Knowledge',
    description: 'Study the science of healing and human anatomy',
    level: 1,
    maxLevel: 3,
    category: 'medicine',
    icon: '💊',
    unlocks: ['med-2', 'med-3'],
  },
  'med-2': {
    id: 'med-2',
    name: 'Surgical Expertise',
    description: 'Master advanced surgical techniques',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'medicine',
    icon: '🔬',
    unlocks: ['med-4'],
  },
  'med-3': {
    id: 'med-3',
    name: 'Herbalism',
    description: 'Understand traditional Filipino healing plants',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'medicine',
    icon: '🌿',
    unlocks: ['med-5'],
  },
  'med-4': {
    id: 'med-4',
    name: 'Healer of Nations',
    description: 'Become a doctor who serves the people',
    level: 3,
    maxLevel: 1,
    requiredLevel: 3,
    category: 'medicine',
    icon: '⚕️',
    unlocks: [],
  },
  'med-5': {
    id: 'med-5',
    name: 'Plague Doctor',
    description: 'Combat epidemics and disease outbreaks',
    level: 3,
    maxLevel: 2,
    requiredLevel: 3,
    category: 'medicine',
    icon: '🦠',
    unlocks: [],
  },

  // FENCING TREE
  'fen-1': {
    id: 'fen-1',
    name: 'Basic Swordsmanship',
    description: 'Learn fundamental fencing techniques',
    level: 1,
    maxLevel: 3,
    category: 'fencing',
    icon: '🗡️',
    unlocks: ['fen-2', 'fen-3'],
  },
  'fen-2': {
    id: 'fen-2',
    name: 'Duelist',
    description: 'Master the art of one-on-one combat',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'fencing',
    icon: '⚡',
    unlocks: ['fen-4'],
  },
  'fen-3': {
    id: 'fen-3',
    name: 'Martial Discipline',
    description: 'Develop physical strength and combat readiness',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'fencing',
    icon: '💪',
    unlocks: ['fen-5'],
  },
  'fen-4': {
    id: 'fen-4',
    name: 'Master Swordsman',
    description: 'Achieve mastery in combat and defense',
    level: 3,
    maxLevel: 1,
    requiredLevel: 3,
    category: 'fencing',
    icon: '👑',
    unlocks: [],
  },
  'fen-5': {
    id: 'fen-5',
    name: 'Revolutionary Fighter',
    description: 'Join armed resistance with combat skills',
    level: 3,
    maxLevel: 2,
    requiredLevel: 3,
    category: 'fencing',
    icon: '🔥',
    unlocks: [],
  },

  // LANGUAGES TREE
  'lang-1': {
    id: 'lang-1',
    name: 'Polyglot',
    description: 'Master multiple languages (Spanish, English, German)',
    level: 1,
    maxLevel: 3,
    category: 'languages',
    icon: '🗣️',
    unlocks: ['lang-2', 'lang-3'],
  },
  'lang-2': {
    id: 'lang-2',
    name: 'Diplomatic Speech',
    description: 'Negotiate and persuade across cultural boundaries',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'languages',
    icon: '🤝',
    unlocks: ['lang-4'],
  },
  'lang-3': {
    id: 'lang-3',
    name: 'Underground Network',
    description: 'Communicate secretly with resistance members',
    level: 2,
    maxLevel: 3,
    requiredLevel: 2,
    category: 'languages',
    icon: '🕵️',
    unlocks: ['lang-5'],
  },
  'lang-4': {
    id: 'lang-4',
    name: 'International Influence',
    description: 'Gain support from foreign allies and intellectuals',
    level: 3,
    maxLevel: 1,
    requiredLevel: 3,
    category: 'languages',
    icon: '🌍',
    unlocks: [],
  },
  'lang-5': {
    id: 'lang-5',
    name: 'Espionage Master',
    description: 'Gather intelligence for the revolution',
    level: 3,
    maxLevel: 2,
    requiredLevel: 3,
    category: 'languages',
    icon: '🎭',
    unlocks: [],
  },
};



interface AdvancedSkillTreeProps {
  onBack?: () => void;
}

export function AdvancedSkillTree({ onBack }: AdvancedSkillTreeProps) {
  const { gameState, updateSkill } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'literature' | 'medicine' | 'fencing' | 'languages'>('literature');
  const [skillToUpgrade, setSkillToUpgrade] = useState<SkillNode | null>(null);

  const categoryColors = {
    literature: 'from-amber-600 to-yellow-600',
    medicine: 'from-green-600 to-emerald-600',
    fencing: 'from-red-600 to-rose-600',
    languages: 'from-blue-600 to-cyan-600',
  };

  const categoryIcons = {
    literature: '📚',
    medicine: '⚕️',
    fencing: '🗡️',
    languages: '🌐',
  };

  const categoryNames = {
    literature: 'Literature',
    medicine: 'Medicine',
    fencing: 'Fencing',
    languages: 'Languages',
  };

  const getCategorySkills = () => {
    return Object.values(SKILL_TREE).filter((skill) => skill.category === selectedCategory);
  };

  const isSkillUnlocked = (skill: SkillNode): boolean => {
    if (!skill.requiredLevel) return true;
    return gameState.skills[skill.category] >= skill.requiredLevel;
  };

  // Skill points spend at the CATEGORY level (0–10). Node maxLevel is only
  // used for the progress dots display — it is NOT a hard upgrade cap.
  // A node is considered "maxed out" visually when the category skill has
  // reached or exceeded that node's tier ceiling.
  const CATEGORY_SKILL_CAP = 10;

  const canUpgradeSkill = (skill: SkillNode): boolean => {
    const currentLevel = gameState.skills[skill.category];
    const requiredLevel = skill.requiredLevel || 0;
    // A node is "full" when the category level has progressed through all its available dots
    const isNodeFull = currentLevel >= (requiredLevel + skill.maxLevel);
    
    return (
      isSkillUnlocked(skill) &&
      gameState.skillPointsAvailable > 0 &&
      currentLevel < CATEGORY_SKILL_CAP &&
      !isNodeFull
    );
  };

  const confirmUpgrade = (skill: SkillNode) => {
    setSkillToUpgrade(skill);
  };

  const executeUpgrade = () => {
    if (skillToUpgrade && canUpgradeSkill(skillToUpgrade)) {
      updateSkill(skillToUpgrade.category, 1);
      setSkillToUpgrade(null);
    }
  };

  const categorySkills = getCategorySkills();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      {/* ── Header ── */}
      <div className="flex-shrink-0 px-6 md:px-12 py-6 border-b border-accent/20 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Removed Return Button */}
          <div className="h-10 w-px bg-accent/20 mx-2 hidden md:block" />
          <div>
            <h1 className="text-accent font-serif text-3xl md:text-4xl tracking-wide leading-tight">
              ⚔️ Skill Arsenal
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-0.5 font-medium uppercase tracking-widest opacity-80">
              Forge your destiny through knowledge and strength
            </p>
          </div>
        </div>

        {/* Skill Points Display */}
        <div className="flex items-center gap-4 bg-accent/10 border border-accent/30 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.1)]">
          <Zap className="w-5 h-5 text-accent fill-accent" />
          <div className="flex flex-col">
            <span className="text-[10px] text-accent uppercase font-bold tracking-tighter leading-none mb-0.5">Points Available</span>
            <span className="text-2xl font-black text-white leading-none">{gameState.skillPointsAvailable}</span>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
          
          {/* Category Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(categoryNames) as Array<keyof typeof categoryNames>).map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`h-auto min-h-[5rem] text-sm md:text-base font-bold flex flex-col items-center justify-center gap-2 p-4 transition-all duration-300 rounded-xl ${
                  selectedCategory === category 
                    ? `bg-gradient-to-br ${categoryColors[category]} text-white shadow-[0_8px_20px_rgba(0,0,0,0.4)] scale-[1.02]` 
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-3xl flex-shrink-0 filter drop-shadow-md">{categoryIcons[category]}</span>
                <span className="truncate tracking-wide">{categoryNames[category]}</span>
              </Button>
            ))}
          </div>

      {/* Skill Tree Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorySkills.map((skill) => {
          const isUnlocked = isSkillUnlocked(skill);
          const currentLevel = gameState.skills[skill.category];
          const canUpgrade = canUpgradeSkill(skill);

          return (
            <div
              key={skill.id}
              className={`border-2 rounded-xl p-6 flex flex-col transition-all shadow-xl backdrop-blur-sm ${
                isUnlocked
                  ? `border-accent/40 bg-slate-900/90 ${canUpgrade ? 'hover:border-accent hover:bg-slate-800 hover:-translate-y-1' : ''}`
                  : 'border-muted/20 bg-slate-950/40 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-accent/10 rounded-lg text-4xl flex-shrink-0">
                  {skill.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-lg leading-tight mb-1 drop-shadow-sm">{skill.name}</h4>
                  {!isUnlocked && skill.requiredLevel && (
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-tighter">
                      Requires {skill.category} Lvl {skill.requiredLevel}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed flex-1 mb-5 font-medium">{skill.description}</p>

              {/* Unlocks Info */}
              {isUnlocked && skill.unlocks && skill.unlocks.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 opacity-80">Next Unlocks:</p>
                  <div className="flex flex-wrap gap-2">
                    {skill.unlocks.map((unlockedId) => {
                      const unlockedSkill = SKILL_TREE[unlockedId];
                      const isUnlockedSkillAvailable = isSkillUnlocked(unlockedSkill);
                      return (
                        <span
                          key={unlockedId}
                          className={`text-xs px-2.5 py-1 rounded-md border ${
                            isUnlockedSkillAvailable
                              ? 'bg-accent/20 border-accent/30 text-accent font-semibold'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                          }`}
                        >
                          {unlockedSkill.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upgrade Section */}
              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                {isUnlocked ? (
                  <>
                    <div className="flex gap-1.5">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => {
                        const isFilled = currentLevel > (skill.requiredLevel || 0) + i;
                        return (
                          <div
                            key={i}
                            className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all duration-500 ${
                              isFilled
                                ? 'bg-accent shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                                : 'bg-slate-800'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <Button
                      onClick={() => confirmUpgrade(skill)}
                      disabled={!canUpgrade}
                      size="sm"
                      className={`font-bold transition-all min-w-[100px] ${
                        canUpgrade 
                          ? 'bg-accent text-slate-950 hover:bg-white hover:scale-105 shadow-lg' 
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {canUpgrade ? (
                        <>
                          <Zap className="w-4 h-4 mr-1 fill-current" />
                          UPGRADE
                        </>
                      ) : (
                        currentLevel >= CATEGORY_SKILL_CAP || (currentLevel >= (skill.requiredLevel || 0) + skill.maxLevel) ? 'MAXED' : 'LOCKED'
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex justify-center text-slate-600 py-1 bg-slate-950/30 rounded-lg">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-slate-950/60 border border-white/10 rounded-xl p-6 text-sm text-slate-300 space-y-3 shadow-inner">
        <p className="font-bold text-accent mb-2 flex items-center gap-2">
          <Unlock className="w-4 h-4" />
          Mastering the Path:
        </p>
        <ul className="space-y-2 list-none">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Earn <strong className="text-white">Skill Points</strong> by completing key narrative milestones and puzzles.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Reach higher <strong className="text-white">Category Levels</strong> to unlock advanced skills in the tree.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Unlocked skills reveal <strong className="text-white">new dialogue options</strong> and secret story paths.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Balance your growth — different paths lead to drastically different <strong className="text-white">What-If endings</strong>.</span>
          </li>
        </ul>
      </div>
      </div>

      <AlertDialog open={!!skillToUpgrade} onOpenChange={(open) => !open && setSkillToUpgrade(null)}>
        <AlertDialogContent className="bg-slate-900 border border-slate-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-accent">Upgrade {skillToUpgrade?.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              This will cost 1 Skill Point and permanently increase your capabilities in the '{skillToUpgrade?.category}' path.
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeUpgrade}
              className="bg-accent text-slate-950 hover:bg-amber-400 font-bold"
            >
              Confirm Upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    </div>
  );
}
