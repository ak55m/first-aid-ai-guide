
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Phone, ArrowLeft, Clock, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyAlertProps {
  symptoms: string;
  reason: string;
  onBack: () => void;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ 
  symptoms, 
  reason, 
  onBack 
}) => {
  // Function to format AI text by simply preserving the line breaks and removing prefixes
  const formatAIText = (text: string | undefined) => {
    if (!text) return null;
    
    console.log("Emergency Alert - Formatting text:", text);
    
    // Remove "What are first aid guidelines for:" or similar prefixes
    let cleanedText = text;
    const prefixesToRemove = [
      "What are first aid guidelines for:", 
      "What are first aid guidelines for", 
      "First aid guidelines for:",
      "First aid guidelines for"
    ];
    
    prefixesToRemove.forEach(prefix => {
      if (cleanedText.startsWith(prefix)) {
        cleanedText = cleanedText.substring(prefix.length).trim();
      }
    });
    
    // Split the text by line breaks
    const lines = cleanedText.split('\n');
    
    return (
      <div className="prose prose-sm max-w-none">
        {lines.map((line, i) => {
          // Check if the line is empty (just a line break)
          if (line.trim() === '') {
            return <br key={`br-${i}`} />;
          }
          
          // Check if line starts with a hyphen - apply indentation
          if (line.trim().startsWith('-')) {
            return (
              <div key={`hyphen-${i}`} className="ml-4">
                {line}
              </div>
            );
          }
          
          // Regular line of text
          return <div key={`line-${i}`}>{line}</div>;
        })}
      </div>
    );
  };

  return (
    <Card className="border-emergency">
      <CardHeader className="bg-emergency text-emergency-foreground">
        <div className="flex items-center gap-2 justify-center">
          <AlertTriangle className="h-6 w-6" />
          <CardTitle className="text-center">Emergency Medical Attention Needed</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="p-4 bg-emergency/10 rounded-lg text-center">
          <p className="font-medium text-emergency mb-2 text-center">Your described symptoms:</p>
          <p className="italic text-center">"<span className="font-medium">{symptoms}</span>"</p>
        </div>
        
        <div>
          {formatAIText(reason)}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Immediate Actions:</h3>
          
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Phone className="h-5 w-5 text-emergency mt-0.5" />
            <div>
              <p className="font-medium">Call 911 (Emergency Services)</p>
              <p className="text-sm text-muted-foreground">For immediate emergency assistance</p>
              <a 
                href="tel:911" 
                className="mt-2 inline-flex items-center justify-center rounded-md bg-emergency px-4 py-2 text-sm font-medium text-emergency-foreground hover:bg-emergency/90 w-full md:w-auto"
              >
                Call 911 Now
              </a>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Clock className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">While Waiting for Help:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                <li>Stay calm and reassure the affected person</li>
                <li>Don't move them unless absolutely necessary</li>
                <li>Loosen any tight clothing</li>
                <li>Monitor breathing and consciousness</li>
                <li>Be prepared to perform CPR if trained</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 border rounded-lg">
            <Hospital className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Find Nearest Medical Facilities</p>
              <p className="text-sm text-muted-foreground">Locate emergency rooms near you</p>
              <Button 
                variant="outline"
                className="mt-2 w-full md:w-auto"
                onClick={() => window.open("https://www.google.com/maps/search/emergency+room+near+me", "_blank")}
              >
                Find Nearby Facilities
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Symptoms
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmergencyAlert;
