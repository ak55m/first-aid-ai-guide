
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { FirstAidGuidance } from '@/types/firstAidTypes';
import { useSymptomAnalysis } from '@/hooks/useSymptomAnalysis';
import QuickSelectConditions from '@/components/QuickSelectConditions';

interface SymptomInputProps {
  onGuidanceFound: (guidance: FirstAidGuidance) => void;
  onEmergencyDetected: (symptoms: string, reason: string) => void;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ 
  onGuidanceFound, 
  onEmergencyDetected 
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);
  
  const { 
    isLoading, 
    isAnalyzing, 
    analyzeSymptoms, 
    cancelAnalysis 
  } = useSymptomAnalysis({
    onGuidanceFound,
    onEmergencyDetected
  });

  useEffect(() => {
    setIsSubmitEnabled(!isLoading);
  }, [isLoading]);

  const handleSubmit = () => {
    if (symptoms.trim() && isSubmitEnabled) {
      console.log("Submit button clicked, analyzing symptoms:", symptoms);
      analyzeSymptoms(symptoms, image);
    }
  };

  const handleQuickSelect = (condition: string) => {
    setSymptoms(condition);
    setTimeout(() => {
      if (isSubmitEnabled) {
        console.log("Quick select triggered analysis for:", condition);
        analyzeSymptoms(condition, image);
      }
    }, 300);
  };

  const handleCancelAnalysis = () => {
    console.log("Cancel button clicked, calling cancelAnalysis");
    cancelAnalysis();
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
          disabled={isLoading}
        />
        <QuickSelectConditions 
          onSelect={handleQuickSelect}
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        {isLoading ? (
          <>
            <Button 
              className="flex-1" 
              disabled={true}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelAnalysis} 
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={!isSubmitEnabled || !symptoms.trim()}
          >
            Get First Aid Guidance
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SymptomInput;
