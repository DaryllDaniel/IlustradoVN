import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PuzzleGameProps {
  imageUrl: string;
  sceneTitle: string;
  onComplete: (puzzleId: string) => void;
}

const GRID_SIZE = 4;
const EMPTY_TILE_ID = GRID_SIZE * GRID_SIZE - 1;

export function PuzzleGame({ imageUrl, sceneTitle, onComplete }: PuzzleGameProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const checkComplete = useCallback((currentTiles: number[]) => {
    return currentTiles.every((id, index) => id === index);
  }, []);

  const initPuzzle = useCallback(() => {
    // Start with solved puzzle
    let initialTiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    
    // Scramble by making random valid moves to ensure solvability
    let emptyIdx = EMPTY_TILE_ID;
    const numShuffles = 150;
    
    for (let i = 0; i < numShuffles; i++) {
      const validMoves = [];
      const row = Math.floor(emptyIdx / GRID_SIZE);
      const col = emptyIdx % GRID_SIZE;
      
      if (row > 0) validMoves.push(emptyIdx - GRID_SIZE); // Up
      if (row < GRID_SIZE - 1) validMoves.push(emptyIdx + GRID_SIZE); // Down
      if (col > 0) validMoves.push(emptyIdx - 1); // Left
      if (col < GRID_SIZE - 1) validMoves.push(emptyIdx + 1); // Right
      
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      // Swap
      [initialTiles[emptyIdx], initialTiles[randomMove]] = [initialTiles[randomMove], initialTiles[emptyIdx]];
      emptyIdx = randomMove;
    }
    
    setTiles(initialTiles);
    setIsStarted(true);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  const handleTileClick = (index: number) => {
    if (isComplete) return;

    const emptyIdx = tiles.indexOf(EMPTY_TILE_ID);
    
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIdx / GRID_SIZE);
    const emptyCol = emptyIdx % GRID_SIZE;

    // Check if clicked tile is adjacent to empty tile
    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[index]];
      setTiles(newTiles);
      
      if (checkComplete(newTiles)) {
        setIsComplete(true);
      }
    }
  };

  const handleComplete = () => {
    const puzzleId = `puzzle-${sceneTitle.replace(/\s+/g, '-').toLowerCase()}`;
    onComplete(puzzleId);
  };

  if (!isStarted) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-background p-8 max-w-2xl w-full mx-4 relative">
        {/* Puzzle header and controls */}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif text-accent mb-2">Puzzle: {sceneTitle}</h2>
          <p className="text-muted-foreground">Slide the pieces to reveal the illustration</p>
        </div>

        {/* Puzzle Container */}
        <div
          className="relative bg-black/20 rounded-lg overflow-hidden mb-6 border border-accent/30"
          style={{ width: '400px', height: '400px', margin: '0 auto' }}
        >
          {/* Completed image background for hint */}
          <img
            src={imageUrl}
            alt="Puzzle target"
            className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${isComplete ? 'opacity-100' : 'opacity-20'}`}
          />

          {/* Puzzle tiles */}
          {!isComplete && tiles.map((id, index) => {
            if (id === EMPTY_TILE_ID) return null; // Don't render empty tile

            const currentRow = Math.floor(index / GRID_SIZE);
            const currentCol = index % GRID_SIZE;
            
            const originalRow = Math.floor(id / GRID_SIZE);
            const originalCol = id % GRID_SIZE;

            return (
              <div
                key={id}
                onClick={() => handleTileClick(index)}
                className="absolute w-[100px] h-[100px] cursor-pointer border border-background/50 hover:border-accent transition-all duration-200 ease-in-out shadow-sm"
                style={{
                  top: `${currentRow * 100}px`,
                  left: `${currentCol * 100}px`,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${-originalCol * 100}px ${-originalRow * 100}px`,
                  backgroundSize: '400px 400px',
                }}
              />
            );
          })}
        </div>

        {/* Complete Button */}
        {isComplete && (
          <div className="animate-in fade-in zoom-in duration-500">
            <Button
              onClick={handleComplete}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg py-6"
            >
              ✓ Puzzle Complete - Continue
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
