
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirstAidGuidance } from '@/types/firstAidTypes';

interface FirstAidGuideProps {
  guidance: FirstAidGuidance;
  onBack: () => void;
}

const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ guidance, onBack }) => {
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
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            Do's and Don'ts
          </h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-success">Do</h4>
              <ul className="list-disc pl-5 space-y-1">
                {guidance.dos.map((item, index) => (
                  <li key={`do-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-emergency">Don't</h4>
              <ul className="list-disc pl-5 space-y-1">
                {guidance.donts.map((item, index) => (
                  <li key={`dont-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Step-by-Step Instructions
          </h3>
          <ol className="mt-2 list-decimal pl-5 space-y-3">
            {guidance.steps.map((step, index) => (
              <li key={`step-${index}`} className="pl-2">
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {guidance.medications && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-medium mb-2">Helpful Medications</h3>
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
          <div className="p-4 border border-muted rounded-lg">
            <p className="text-sm italic">{guidance.note}</p>
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
