
import { FirstAidGuidance } from '@/types/firstAidTypes';

/**
 * Checks if a text contains emergency keywords
 */
export function containsEmergencyKeywords(text: string): boolean {
  const emergencyKeywords = [
    "call 911", "emergency", "ambulance", "immediate", "hospital", "urgent care", 
    "severe", "critical", "life-threatening"
  ];
  
  return emergencyKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Determines if a condition should be treated as an emergency
 */
export function isEmergencyCondition(
  isAIFlaggedEmergency: boolean,
  analysisText: string
): boolean {
  // Check if the AI flagged it as an emergency AND we can find emergency keywords
  // This prevents false positives
  return isAIFlaggedEmergency && containsEmergencyKeywords(analysisText);
}
