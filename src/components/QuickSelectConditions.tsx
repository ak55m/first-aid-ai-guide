
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickSelectConditionsProps {
  onSelect: (condition: string) => void;
  disabled: boolean;
}

const commonConditions = [
  "Cut/Scrape", "Burn", "Fever", "Sprain", "Headache", 
  "Allergic Reaction", "Insect Bite", "Nosebleed"
];

const QuickSelectConditions: React.FC<QuickSelectConditionsProps> = ({ 
  onSelect, 
  disabled 
}) => {
  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground mb-2">Common conditions:</p>
      <div className="flex flex-wrap gap-2">
        {commonConditions.map((condition) => (
          <Button 
            key={condition} 
            variant="outline" 
            size="sm"
            onClick={() => onSelect(condition)}
            disabled={disabled}
          >
            {condition}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickSelectConditions;
