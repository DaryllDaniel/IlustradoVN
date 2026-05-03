import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SkillLevel {
  medicine: number;
  literature: number;
  fencing: number;
  languages: number;
}

export interface GameState {
  currentChapter: number;
  currentScene: string;
  playerName: string;
  skills: SkillLevel;
  skillPointsAvailable: number;
  awakeninglevel: number;
  dialogueHistory: string[];
  choices: string[];
  completedPuzzles: string[];
  visitedScenes: string[];
}

interface GameContextType {
  gameState: GameState;
  updateSkill: (skill: keyof SkillLevel, amount: number) => void;
  addSkillPoints: (amount: number) => void;
  updateAwakeningLevel: (amount: number) => void;
  advanceScene: (sceneId: string) => void;
  recordDialogue: (dialogue: string) => void;
  recordChoice: (choice: string) => void;
  completePuzzle: (puzzleId: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  currentChapter: 1,
  currentScene: 'calamba-intro',
  playerName: 'Jose Rizal',
  skills: {
    medicine: 0,
    literature: 0,
    fencing: 0,
    languages: 0,
  },
  skillPointsAvailable: 0,
  awakeninglevel: 0,
  dialogueHistory: [],
  choices: [],
  completedPuzzles: [],
  visitedScenes: [],
};

const LOCAL_STORAGE_KEY = 'ilustrado_rpg_save';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (e) {
      console.error('Failed to parse saved game state', e);
    }
    return initialGameState;
  });

  // Save game state to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }, [gameState]);

  const updateSkill = (skill: keyof SkillLevel, amount: number) => {
    setGameState((prev) => {
      const newSkillLevel = Math.min(prev.skills[skill] + amount, 10);
      const pointsUsed = newSkillLevel - prev.skills[skill];
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [skill]: newSkillLevel,
        },
        skillPointsAvailable: Math.max(0, prev.skillPointsAvailable - pointsUsed),
      };
    });
  };

  const addSkillPoints = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      skillPointsAvailable: prev.skillPointsAvailable + amount,
    }));
  };

  const updateAwakeningLevel = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      awakeninglevel: Math.min(prev.awakeninglevel + amount, 100),
    }));
  };

  const advanceScene = (sceneId: string) => {
    setGameState((prev) => ({
      ...prev,
      currentScene: sceneId,
      visitedScenes: prev.visitedScenes.includes(sceneId)
        ? prev.visitedScenes
        : [...prev.visitedScenes, sceneId],
    }));
  };

  const recordDialogue = (dialogue: string) => {
    setGameState((prev) => ({
      ...prev,
      dialogueHistory: [...prev.dialogueHistory, dialogue],
    }));
  };

  const recordChoice = (choice: string) => {
    setGameState((prev) => ({
      ...prev,
      choices: [...prev.choices, choice],
    }));
  };

  const completePuzzle = (puzzleId: string) => {
    setGameState((prev) => ({
      ...prev,
      completedPuzzles: [...prev.completedPuzzles, puzzleId],
    }));
  };

  const resetGame = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove saved game state', e);
    }
    setGameState(initialGameState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        updateSkill,
        addSkillPoints,
        updateAwakeningLevel,
        advanceScene,
        recordDialogue,
        recordChoice,
        completePuzzle,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Skill point distribution milestones
export const SKILL_POINT_MILESTONES: Record<string, number> = {
  'calamba-moth': 3,
  'ateneo-poetry': 3,
  'europe-noli': 3,
  'dapitan-intro': 3,
};
