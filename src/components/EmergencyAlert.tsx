
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
  // Function to format AI text by replacing markdown-style elements
  const formatAIText = (text: string | undefined) => {
    if (!text) return null;
    
    console.log("Emergency Alert - Formatting text:", text);
    
    // Replace markdown-style bold formatting (**text**) with span elements
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');
    
    // Split the text by paragraphs
    const paragraphs = formattedText.split('\n\n');
    
    return (
      <div className="prose prose-sm max-w-none">
        {paragraphs.map((paragraph, i) => {
          console.log(`Emergency Alert - Processing paragraph ${i}:`, paragraph);
          
          // Check if this is a numbered list paragraph
          if (/^\d+\.\s/.test(paragraph.trim())) {
            // Split by line breaks to get individual list items
            const listItems = paragraph.split('\n')
              .filter(item => item.trim().length > 0)
              .map(item => item.trim());
            
            console.log("Emergency Alert - Found numbered list:", listItems);
            
            // Create a proper numbered list
            return (
              <ol key={i} className="list-decimal pl-5 space-y-2 my-3">
                {listItems.map((item, j) => {
                  // Strip out the number prefix (e.g., "1. ")
                  const cleanedItem = item.replace(/^\d+\.\s*/, '');
                  return (
                    <li key={j} dangerouslySetInnerHTML={{ __html: cleanedItem }} />
                  );
                })}
              </ol>
            );
          }
          // Check if paragraph contains hyphen list items
          else if (paragraph.includes('\n-')) {
            // Split by line breaks and process each item
            const items = paragraph.split('\n')
              .filter(item => item.trim().length > 0);
            
            // Check if the paragraph is a mix of text and list items or just list items
            if (items[0].startsWith('-')) {
              // All items are list items
              return (
                <ul key={i} className="list-disc pl-5 space-y-2 my-3">
                  {items.map((item, j) => {
                    // Clean the hyphen
                    const cleanedItem = item.replace(/^-\s*/, '');
                    return <li key={j} dangerouslySetInnerHTML={{ __html: cleanedItem }} />;
                  })}
                </ul>
              );
            } else {
              // Mix of text and list items
              // First item is descriptive text, rest are list items
              return (
                <div key={i} className="my-3">
                  <p dangerouslySetInnerHTML={{ __html: items[0] }} className="mb-2" />
                  <ul className="list-disc pl-5 space-y-1">
                    {items.slice(1).map((item, j) => {
                      const cleanedItem = item.replace(/^-\s*/, '');
                      return <li key={j} dangerouslySetInnerHTML={{ __html: cleanedItem }} />;
                    })}
                  </ul>
                </div>
              );
            }
          }
          // Handle standalone hyphen items that don't include newlines
          else if (paragraph.trim().startsWith('-')) {
            // Individual hyphen items without newlines
            const items = paragraph.split('\n')
              .filter(item => item.trim().length > 0);
            
            return (
              <ul key={i} className="list-disc pl-5 space-y-2 my-3">
                {items.map((item, j) => {
                  const cleanedItem = item.replace(/^-\s*/, '');
                  return <li key={j} dangerouslySetInnerHTML={{ __html: cleanedItem }} />;
                })}
              </ul>
            );
          } else {
            // Regular paragraph
            return (
              <p key={i} className="mb-3" dangerouslySetInnerHTML={{ __html: paragraph }} />
            );
          }
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
          <h3 className="text-lg font-medium mb-2">First Aid Guides:</h3>
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
