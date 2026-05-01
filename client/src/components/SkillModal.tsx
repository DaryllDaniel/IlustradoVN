import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdvancedSkillTree } from './AdvancedSkillTree';

interface SkillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillModal({ open, onOpenChange }: SkillModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-none bg-background/98 backdrop-blur-md border-0 border-t-4 border-accent p-0 flex flex-col gap-0">
        {/* Header */}
        <DialogHeader className="px-8 pt-6 pb-4 border-b border-accent/30 bg-black/40 flex-shrink-0">
          <DialogTitle className="text-accent font-serif text-4xl tracking-wide">
            ⚔️ Skill Arsenal
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Spend skill points to unlock new abilities and story paths
          </p>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
          <div className="max-w-6xl mx-auto">
            <AdvancedSkillTree />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
