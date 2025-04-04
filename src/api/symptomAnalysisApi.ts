
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnalysisResult {
  analysis: string;
  isEmergency: boolean;
  category?: string;
}

/**
 * Calls the Supabase Edge Function to analyze symptoms
 */
export async function analyzeSymptomWithAI(
  symptoms: string, 
  image: string | null = null,
  signal?: AbortSignal
): Promise<AnalysisResult | null> {
  try {
    console.log("Calling analyze-symptoms with enhanced query:", symptoms);
    
    // Call our Supabase Edge Function to analyze symptoms
    const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
      body: { 
        symptoms: symptoms,
        image: image,
        requestId: Date.now().toString()
      }
    });
    
    // Debug logs to see what we're getting back
    console.log("Edge function response:", data);
    console.log("Edge function error:", error);
    
    if (error) {
      console.error("Error calling analyze-symptoms:", error);
      toast.error(`Error analyzing symptoms: ${error.message || "Unknown error"}`);
      return null;
    }
    
    if (!data) {
      console.error("No data returned from analyze-symptoms");
      toast.error("No response received from AI service");
      return null;
    }
    
    if (data.error) {
      console.error("API error:", data.error);
      toast.error(`AI service error: ${data.error}`);
      return null;
    }
    
    return data as AnalysisResult;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Request was aborted');
      return null;
    }
    
    console.error("Error in symptom analysis:", error);
    toast.error(`An error occurred: ${error.message || "Unknown error"}`);
    return null;
  }
}
