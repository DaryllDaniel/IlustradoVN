import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { AdvancedSkillTree } from './AdvancedSkillTree';

interface SkillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillDrawer({ isOpen, onClose }: SkillDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] p-0 bg-slate-950 border-t border-accent/30 overflow-hidden"
      >
        <AdvancedSkillTree onBack={onClose} />
      </SheetContent>
    </Sheet>
  );
}
