
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { firstAidDatabase } from '@/data/firstAidData';
import { toast } from 'sonner';
import { FirstAidGuidance } from '@/types/firstAidTypes';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

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
  // Add a controller for aborting fetch requests
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create a new AbortController for this request
      const controller = new AbortController();
      setAbortController(controller);
      
      // Enhance user query with first aid context
      const enhancedQuery = `What are first aid guidelines for: ${symptoms.trim()}`;
      console.log("Calling analyze-symptoms with enhanced query:", enhancedQuery);
      
      // Call our Supabase Edge Function to analyze symptoms
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: enhancedQuery,
          image: image
        },
        signal: controller.signal
      });
      
      // Clear the controller when done
      setAbortController(null);
      
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
      
      // Format the AI analysis to have better structure if it's a block of text
      let formattedAnalysis = data.analysis;
      
      // Handle emergency case
      if (data.isEmergency) {
        onEmergencyDetected(
          symptoms,
          formattedAnalysis
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
          aiAnalysis: formattedAnalysis
        };
        onGuidanceFound(enhancedGuidance);
      } else {
        toast.error("I couldn't find specific guidance for these symptoms. Please try describing them differently or seek professional medical advice.");
      }
    } catch (error) {
      // Check if this is an abort error (user cancelled)
      if (error.name === 'AbortError') {
        console.log("Request was cancelled by the user");
        toast.info("Analysis cancelled");
      } else {
        console.error("Error in symptom analysis:", error);
        toast.error(`An error occurred: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  // Handle cancellation of the request
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      toast.info("Analysis cancelled");
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
          disabled={isLoading}
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
                disabled={isLoading}
              >
                {condition}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isLoading ? (
          <>
            <Button 
              variant="destructive" 
              onClick={handleCancel} 
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel Analysis
            </Button>
            <Button 
              className="flex-1" 
              disabled={true}
            >
              Analyzing...
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={isLoading}
          >
            Get First Aid Guidance
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SymptomInput;
