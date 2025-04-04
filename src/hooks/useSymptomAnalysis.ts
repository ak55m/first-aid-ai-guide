
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { firstAidDatabase } from '@/data/firstAidData';
import { FirstAidGuidance } from '@/types/firstAidTypes';
import { toast } from 'sonner';

interface UseSymptomAnalysisProps {
  onGuidanceFound: (guidance: FirstAidGuidance) => void;
  onEmergencyDetected: (symptoms: string, reason: string) => void;
}

interface AnalysisResult {
  analysis: string;
  isEmergency: boolean;
  category?: string;
}

export function useSymptomAnalysis({ 
  onGuidanceFound, 
  onEmergencyDetected 
}: UseSymptomAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMounted = useRef(true);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const analyzeSymptoms = async (symptoms: string, image: string | null = null) => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    setIsLoading(true);
    setIsAnalyzing(true);
    
    try {
      // Enhance user query with first aid context
      const enhancedQuery = `What are first aid guidelines for: ${symptoms.trim()}`;
      console.log("Calling analyze-symptoms with enhanced query:", enhancedQuery);
      
      // Call our Supabase Edge Function to analyze symptoms
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { 
          symptoms: enhancedQuery,
          image: image,
          requestId: Date.now().toString()
        }
      });
      
      // Debug logs to see what we're getting back
      console.log("Edge function response:", data);
      console.log("Edge function error:", error);
      
      // If the component was unmounted, don't proceed
      if (!isMounted.current) {
        console.log("Component unmounted, cancelling analysis");
        return;
      }
      
      if (error) {
        console.error("Error calling analyze-symptoms:", error);
        toast.error(`Error analyzing symptoms: ${error.message || "Unknown error"}`);
        return;
      }
      
      if (!data) {
        console.error("No data returned from analyze-symptoms");
        toast.error("No response received from AI service");
        return;
      }
      
      if (data.error) {
        console.error("API error:", data.error);
        toast.error(`AI service error: ${data.error}`);
        return;
      }
      
      // At this point, we have a successful response and we're still mounted and analyzing
      processAnalysisResult(symptoms, data as AnalysisResult);
    } catch (error: any) {
      // Only show error if we're still analyzing (not cancelled)
      if (isAnalyzing && isMounted.current) {
        console.error("Error in symptom analysis:", error);
        toast.error(`An error occurred: ${error.message || "Unknown error"}`);
      } else {
        console.log("Error occurred but analysis was already cancelled");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsAnalyzing(false);
      }
    }
  };

  const processAnalysisResult = (symptoms: string, data: AnalysisResult) => {
    // Format the AI analysis to have better structure if it's a block of text
    let formattedAnalysis = data.analysis;
    
    // Handle emergency case
    if (data.isEmergency) {
      console.log("Emergency detected, showing emergency screen");
      onEmergencyDetected(
        symptoms,
        formattedAnalysis
      );
      return;
    }

    // Look for matching guidance either from AI suggestion or our database
    const foundGuidance = findMatchingGuidance(symptoms, data.category);
    console.log("Found guidance:", foundGuidance);
    
    if (foundGuidance) {
      // Add AI analysis to the guidance
      const enhancedGuidance = {
        ...foundGuidance,
        aiAnalysis: formattedAnalysis
      };
      console.log("Calling onGuidanceFound with:", enhancedGuidance);
      onGuidanceFound(enhancedGuidance);
    } else {
      toast.error("I couldn't find specific guidance for these symptoms. Please try describing them differently or seek professional medical advice.");
    }
  };

  const findMatchingGuidance = (symptoms: string, category: string | undefined): FirstAidGuidance | null => {
    let foundGuidance = null;
    
    // If AI suggested a category, try to find it in our database
    if (category) {
      for (const guide of firstAidDatabase) {
        if (guide.keywords.includes(category)) {
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
    
    return foundGuidance;
  };

  const cancelAnalysis = () => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
      setIsLoading(false);
      toast.info("Analysis cancelled");
    }
  };

  return {
    isLoading,
    isAnalyzing,
    analyzeSymptoms,
    cancelAnalysis
  };
}
