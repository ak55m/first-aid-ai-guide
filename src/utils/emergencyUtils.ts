
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
  // Only treat as emergency if AI flagged it AND we find emergency keywords
  // This prevents non-emergency conditions from triggering the emergency screen
  return isAIFlaggedEmergency && containsEmergencyKeywords(analysisText);
}
