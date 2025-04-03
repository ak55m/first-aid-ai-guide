
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface Facility {
  name: string;
  type: 'hospital' | 'pharmacy';
  distance: string;
  address: string;
}

const NearbyFacilities: React.FC = () => {
  // This is static data for now. In a real app, this would come from a geolocation API
  const fakeFacilities: Facility[] = [
    { 
      name: "City General Hospital", 
      type: "hospital", 
      distance: "1.3 miles", 
      address: "123 Medical Center Blvd" 
    },
    { 
      name: "QuickCare Pharmacy", 
      type: "pharmacy", 
      distance: "0.8 miles", 
      address: "456 Health Street" 
    },
    { 
      name: "Community Medical Center", 
      type: "hospital", 
      distance: "2.5 miles", 
      address: "789 Wellness Ave" 
    },
    { 
      name: "24/7 Drugstore", 
      type: "pharmacy", 
      distance: "1.1 miles", 
      address: "321 Remedy Road" 
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Nearby Medical Facilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fakeFacilities.map((facility, index) => (
            <div key={index} className="flex items-start gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <MapPin className={`h-5 w-5 mt-0.5 ${facility.type === 'hospital' ? 'text-emergency' : 'text-primary'}`} />
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{facility.name}</p>
                  <span className="text-sm text-muted-foreground">{facility.distance}</span>
                </div>
                <p className="text-sm">{facility.address}</p>
                <p className="text-xs text-muted-foreground capitalize">{facility.type}</p>
              </div>
            </div>
          ))}
          <div className="text-center mt-4">
            <button 
              className="text-primary text-sm hover:underline" 
              onClick={() => window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank")}
            >
              View more on Google Maps
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyFacilities;
