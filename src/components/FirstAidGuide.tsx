
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Award, CheckCircle, Clock, Bandage, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirstAidGuidance } from '@/types/firstAidTypes';

interface FirstAidGuideProps {
  guidance: FirstAidGuidance;
  onBack: () => void;
}

const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ guidance, onBack }) => {
  // Function to format AI text by removing prefixes and preserving the line breaks
  const formatAIText = (text: string | undefined) => {
    if (!text) return null;
    
    console.log("Formatting AI text:", text);
    
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{guidance.title}</CardTitle>
          <Award className="text-primary h-6 w-6" />
        </div>
        <CardDescription>
          Follow these step-by-step instructions carefully
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {guidance.aiAnalysis && (
          <div className="rounded-lg border p-4 bg-muted/30">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Bandage className="h-5 w-5 text-primary" />
              First Aid Guides
            </h3>
            {formatAIText(guidance.aiAnalysis)}
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Do's and Don'ts
          </h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-3 rounded-lg border border-success/20 bg-success/5">
              <h4 className="font-medium text-success flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Do
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {guidance.dos.map((item, index) => (
                  <li key={`do-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 p-3 rounded-lg border border-emergency/20 bg-emergency/5">
              <h4 className="font-medium text-emergency flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Don't
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {guidance.donts.map((item, index) => (
                  <li key={`dont-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-success" />
            Step-by-Step Instructions
          </h3>
          <ol className="mt-2 space-y-3">
            {guidance.steps.map((step, index) => (
              <li key={`step-${index}`} className="flex gap-3 items-start">
                <span className="flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary w-6 h-6 text-sm font-medium">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {guidance.medications && guidance.medications.length > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg border">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
              <Syringe className="h-5 w-5 text-primary" />
              Helpful Medications
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {guidance.medications.map((med, index) => (
                <li key={`med-${index}`}>{med}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Always follow package instructions and consult with a healthcare provider when unsure.
            </p>
          </div>
        )}

        {guidance.note && (
          <div className="p-4 rounded-lg border bg-warning/10 border-warning/20">
            <div className="flex gap-2 items-center mb-1">
              <Clock className="h-5 w-5 text-warning" />
              <h4 className="font-medium">Important Note</h4>
            </div>
            <p className="text-sm">{guidance.note}</p>
          </div>
        )}
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

export default FirstAidGuide;
