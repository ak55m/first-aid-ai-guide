
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { firstAidDatabase } from '@/data/firstAidData';
import { toast } from '@/components/ui/sonner';

interface SymptomInputProps {
  onGuidanceFound: (guidance: FirstAidGuidance) => void;
  onEmergencyDetected: (symptoms: string, reason: string) => void;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ 
  onGuidanceFound, 
  onEmergencyDetected 
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const symptomsLower = symptoms.toLowerCase();
      
      // Check for emergency keywords
      const emergencyKeywords = [
        'chest pain', 'heart attack', 'stroke', 'unconscious', 'breathing', 
        'choking', 'drowning', 'seizure', 'severe bleeding', 'head injury', 'suicide'
      ];
      
      const emergencyTrigger = emergencyKeywords.find(keyword => 
        symptomsLower.includes(keyword)
      );
      
      if (emergencyTrigger) {
        onEmergencyDetected(
          symptoms, 
          `Your symptoms may indicate a serious medical emergency. Medical attention for "${emergencyTrigger}" should not be delayed.`
        );
        setIsLoading(false);
        return;
      }
      
      // Search for matching first aid guidance
      let foundGuidance = null;
      
      // Look for keyword matches
      for (const guide of firstAidDatabase) {
        for (const keyword of guide.keywords) {
          if (symptomsLower.includes(keyword.toLowerCase())) {
            foundGuidance = guide;
            break;
          }
        }
        if (foundGuidance) break;
      }
      
      if (foundGuidance) {
        onGuidanceFound(foundGuidance);
      } else {
        toast.error("I couldn't find specific guidance for these symptoms. Please try describing them differently or seek professional medical advice.");
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const commonConditions = [
    "Cut/Scrape", "Burn", "Fever", "Sprain", "Headache", 
    "Allergic Reaction", "Insect Bite", "Nosebleed"
  ];

  const handleQuickSelect = (condition: string) => {
    setSymptoms(condition);
    // Auto-submit after a brief delay
    setTimeout(() => handleSubmit(), 300);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Describe Your Symptoms</CardTitle>
        <CardDescription>
          Tell us what's happening and we'll provide first aid guidance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Describe your symptoms or injury in detail..."
          className="min-h-[120px]"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Common conditions:</p>
          <div className="flex flex-wrap gap-2">
            {commonConditions.map((condition) => (
              <Button 
                key={condition} 
                variant="outline" 
                size="sm"
                onClick={() => handleQuickSelect(condition)}
              >
                {condition}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Get First Aid Guidance"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SymptomInput;
