
import React, { useState } from 'react';
import { FirstAidGuidance } from '@/data/firstAidData';
import Header from '@/components/Header';
import SymptomInput from '@/components/SymptomInput';
import FirstAidGuide from '@/components/FirstAidGuide';
import EmergencyAlert from '@/components/EmergencyAlert';
import NearbyFacilities from '@/components/NearbyFacilities';

const Index = () => {
  const [view, setView] = useState<'input' | 'guidance' | 'emergency'>('input');
  const [selectedGuidance, setSelectedGuidance] = useState<FirstAidGuidance | null>(null);
  const [emergencyData, setEmergencyData] = useState({
    symptoms: '',
    reason: ''
  });

  const handleGuidanceFound = (guidance: FirstAidGuidance) => {
    setSelectedGuidance(guidance);
    setView('guidance');
    window.scrollTo(0, 0);
  };

  const handleEmergencyDetected = (symptoms: string, reason: string) => {
    setEmergencyData({ symptoms, reason });
    setView('emergency');
    window.scrollTo(0, 0);
  };

  const handleBackToInput = () => {
    setView('input');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6 max-w-4xl">
        <div className="space-y-8">
          {view === 'input' && (
            <>
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                  First Aid AI Assistant
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get instant guidance for common injuries and health concerns. 
                  In case of serious emergencies, please call 911 immediately.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <SymptomInput 
                    onGuidanceFound={handleGuidanceFound}
                    onEmergencyDetected={handleEmergencyDetected}
                  />
                </div>
                <div className="md:col-span-1">
                  <NearbyFacilities />
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg text-sm text-center text-muted-foreground">
                <p>
                  This AI assistant provides general first aid guidance only. It is not a substitute for professional medical advice, 
                  diagnosis, or treatment. Always seek the advice of a qualified healthcare provider for any medical condition.
                </p>
              </div>
            </>
          )}
          
          {view === 'guidance' && selectedGuidance && (
            <FirstAidGuide 
              guidance={selectedGuidance} 
              onBack={handleBackToInput}
            />
          )}
          
          {view === 'emergency' && (
            <EmergencyAlert
              symptoms={emergencyData.symptoms}
              reason={emergencyData.reason}
              onBack={handleBackToInput}
            />
          )}
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            First Aid AI Guide &copy; {new Date().getFullYear()} | 
            <span className="mx-1">Not a substitute for professional medical advice</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
