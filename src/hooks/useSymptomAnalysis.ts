
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { FirstAidGuidance } from '@/types/firstAidTypes';
import { analyzeSymptomWithAI, AnalysisResult } from '@/api/symptomAnalysisApi';
import { findMatchingGuidance, enhanceSymptomQuery } from '@/utils/firstAidUtils';
import { isEmergencyCondition } from '@/utils/emergencyUtils';

interface UseSymptomAnalysisProps {
  onGuidanceFound: (guidance: FirstAidGuidance) => void;
  onEmergencyDetected: (symptoms: string, reason: string) => void;
}

export function useSymptomAnalysis({ 
  onGuidanceFound, 
  onEmergencyDetected 
}: UseSymptomAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const analyzeSymptoms = async (symptoms: string, image: string | null = null) => {
    console.log("analyzeSymptoms called with:", symptoms);
    
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first");
      return;
    }

    // Reset state and cancel any in-progress requests before starting a new one
    setIsLoading(true);
    setIsAnalyzing(true);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      // Enhance user query with first aid context
      const enhancedQuery = enhanceSymptomQuery(symptoms);
      console.log("Enhanced query:", enhancedQuery);
      
      // Get analysis result from AI
      const data = await analyzeSymptomWithAI(
        enhancedQuery, 
        image,
        abortControllerRef.current?.signal
      );
      
      // If the component was unmounted or analysis was cancelled, don't proceed
      if (!isMounted.current || !isAnalyzing) {
        console.log("Component unmounted or analysis cancelled, stopping processing");
        return;
      }
      
      if (!data) {
        // Error already handled in analyzeSymptomWithAI
        setIsLoading(false);
        setIsAnalyzing(false);
        return;
      }
      
      // Only process the result if we haven't cancelled the analysis
      processAnalysisResult(symptoms, data);
      
    } catch (error: any) {
      // Only show error if we're still analyzing (not cancelled)
      if (isAnalyzing && isMounted.current) {
        console.error("Error in symptom analysis:", error);
        toast.error(`An error occurred: ${error.message || "Unknown error"}`);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsAnalyzing(false);
      }
    }
  };

  const processAnalysisResult = (symptoms: string, data: AnalysisResult) => {
    // If analysis has been cancelled, don't process the result
    if (!isAnalyzing || !isMounted.current) {
      console.log("Analysis was cancelled, not processing results");
      return;
    }
    
    console.log("Processing analysis result:", data);
    
    // Format the AI analysis to have better structure if it's a block of text
    let formattedAnalysis = data.analysis;
    
    // Check if the text truly indicates an emergency situation
    const isEmergency = isEmergencyCondition(data.isEmergency, formattedAnalysis);
    console.log("Is this an emergency?", isEmergency);
    
    if (isEmergency) {
      console.log("Emergency detected, showing emergency screen");
      onEmergencyDetected(symptoms, formattedAnalysis);
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
    
    // Ensure loading states are reset
    setIsLoading(false);
    setIsAnalyzing(false);
  };

  const cancelAnalysis = () => {
    console.log("Cancelling analysis");
    setIsAnalyzing(false);
    setIsLoading(false);
    
    // Attempt to abort the request if possible
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    toast.info("Analysis cancelled");
  };

  return {
    isLoading,
    isAnalyzing,
    analyzeSymptoms,
    cancelAnalysis
  };
}
