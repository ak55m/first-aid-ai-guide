
import { firstAidDatabase } from '@/data/firstAidData';
import { FirstAidGuidance } from '@/types/firstAidTypes';

/**
 * Finds matching guidance from symptoms description or category
 */
export function findMatchingGuidance(
  symptoms: string, 
  category: string | undefined
): FirstAidGuidance | null {
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
}

/**
 * Enhances user query with first aid context
 */
export function enhanceSymptomQuery(symptoms: string): string {
  return `What are first aid guidelines for: ${symptoms.trim()}`;
}
