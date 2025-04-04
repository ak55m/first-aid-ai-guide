
import { firstAidDatabase } from '@/data/firstAidData';
import { FirstAidGuidance } from '@/types/firstAidTypes';

/**
 * Finds matching guidance from symptoms description or category
 */
export function findMatchingGuidance(
  symptoms: string, 
  category: string | undefined
): FirstAidGuidance | null {
  // Log to debug
  console.log("Finding guidance for symptoms:", symptoms, "category:", category);
  
  let foundGuidance = null;
  const symptomsLower = symptoms.toLowerCase();
  
  // Remove the query prefix to get cleaner matching
  const cleanSymptoms = symptomsLower
    .replace("what are first aid guidelines for:", "")
    .replace("what are first aid guidelines for", "")
    .trim();
  
  // If AI suggested a category, try to find it in our database
  if (category) {
    console.log("Looking up category:", category);
    for (const guide of firstAidDatabase) {
      if (guide.keywords.includes(category.toLowerCase())) {
        foundGuidance = guide;
        console.log("Found guidance by category:", guide.title);
        break;
      }
    }
  }
  
  // If no guidance found from AI category, fall back to keyword search
  if (!foundGuidance) {
    console.log("No guidance found by category, searching by keywords in:", cleanSymptoms);
    
    // Try to find direct keyword matches
    for (const guide of firstAidDatabase) {
      for (const keyword of guide.keywords) {
        if (cleanSymptoms.includes(keyword.toLowerCase())) {
          foundGuidance = guide;
          console.log("Found guidance by keyword:", keyword, "->", guide.title);
          break;
        }
      }
      if (foundGuidance) break;
    }
    
    // If cleanSymptoms contains "headache", explicitly use the headache guide
    if (!foundGuidance && cleanSymptoms.includes("headache")) {
      foundGuidance = firstAidDatabase.find(guide => guide.id === "headache");
      console.log("Found headache guidance by direct ID match");
    }
    
    // If still no match, use a fallback (first aid kit guidance)
    if (!foundGuidance && firstAidDatabase.length > 0) {
      console.log("No specific guidance found, using first item as fallback");
      // Use the first guidance as a general fallback
      foundGuidance = firstAidDatabase[0];
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
