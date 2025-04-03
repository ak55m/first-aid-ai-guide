
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { firstAidDatabase } from '@/data/firstAidData';
import { toast } from 'sonner';
import { FirstAidGuidance } from '@/types/firstAidTypes';
import { supabase } from '@/integrations/supabase/client';

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
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Calling analyze-symptoms with:", symptoms);
      
      // Call our Supabase Edge Function to analyze symptoms
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: symptoms.trim(),
          image: image
        }
      });
      
      console.log("Edge function response:", data);
      console.log("Edge function error:", error);
      
      if (error) {
        console.error("Error calling analyze-symptoms:", error);
        toast.error(`Error analyzing symptoms: ${error.message || "Unknown error"}`);
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        console.error("No data returned from analyze-symptoms");
        toast.error("No response received from AI service");
        setIsLoading(false);
        return;
      }
      
      if (data.error) {
        console.error("API error:", data.error);
        toast.error(`AI service error: ${data.error}`);
        setIsLoading(false);
        return;
      }
      
      // Handle emergency case
      if (data.isEmergency) {
        onEmergencyDetected(
          symptoms,
          `AI analysis indicates this may be a medical emergency: ${data.analysis}`
        );
        setIsLoading(false);
        return;
      }

      // Look for matching guidance either from AI suggestion or our database
      let foundGuidance = null;
      
      // If AI suggested a category, try to find it in our database
      if (data.category) {
        for (const guide of firstAidDatabase) {
          if (guide.keywords.includes(data.category)) {
            foundGuidance = guide;
            break;
          }
        }
      }
      
      // If no guidance found from AI category, fall back to keyword search
      if (!foundGuidance) {
        const symptomsLower = symptoms.toLowerCase();
        
        for (const guide of firstAidDatabase) {
          for (const keyword of guide.keywords) {
            if (symptomsLower.includes(keyword.toLowerCase())) {
              foundGuidance = guide;
              break;
            }
          }
          if (foundGuidance) break;
        }
      }
      
      if (foundGuidance) {
        // Add AI analysis to the guidance
        const enhancedGuidance = {
          ...foundGuidance,
          aiAnalysis: data.analysis
        };
        onGuidanceFound(enhancedGuidance);
      } else {
        toast.error("I couldn't find specific guidance for these symptoms. Please try describing them differently or seek professional medical advice.");
      }
    } catch (error) {
      console.error("Error in symptom analysis:", error);
      toast.error(`An error occurred: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
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
