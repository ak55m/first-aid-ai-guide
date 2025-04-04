
import { FirstAidGuidance } from '@/types/firstAidTypes';

/**
 * Checks if a text contains emergency keywords
 */
export function containsEmergencyKeywords(text: string): boolean {
  const emergencyKeywords = [
    "call 911", "emergency", "ambulance", "immediate", "hospital", "urgent care", 
    "severe", "critical", "life-threatening"
  ];
  
  const textLower = text.toLowerCase();
  return emergencyKeywords.some(keyword => 
    textLower.includes(keyword.toLowerCase())
  );
}

/**
 * Determines if a condition should be treated as an emergency
 */
export function isEmergencyCondition(
  isAIFlaggedEmergency: boolean,
  analysisText: string
): boolean {
  // For headaches specifically, only flag as emergency if it contains specific emergency keywords
  if (analysisText.toLowerCase().includes('headache')) {
    return containsEmergencyKeywords(analysisText) && 
           analysisText.toLowerCase().includes("seek medical attention") &&
           isAIFlaggedEmergency;
  }
  
  // For other conditions, check if AI flagged it AND we find emergency keywords
  return isAIFlaggedEmergency && containsEmergencyKeywords(analysisText);
}
