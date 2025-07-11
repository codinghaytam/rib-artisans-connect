import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArtisanProfile } from '@/hooks/useTopArtisans';

interface ArtisanMapContextType {
  artisans: ArtisanProfile[];
  setArtisans: (artisans: ArtisanProfile[]) => void;
  selectedArtisan: ArtisanProfile | null;
  setSelectedArtisan: (artisan: ArtisanProfile | null) => void;
  hoveredArtisan: ArtisanProfile | null;
  setHoveredArtisan: (artisan: ArtisanProfile | null) => void;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>;
  highlightArtisanOnMap: (artisanId: string) => void;
  resetMapHighlight: () => void;
  flyToArtisan: (artisan: ArtisanProfile) => void;
}

const ArtisanMapContext = createContext<ArtisanMapContextType | undefined>(undefined);

export const useArtisanMap = () => {
  const context = useContext(ArtisanMapContext);
  if (!context) {
    throw new Error('useArtisanMap must be used within an ArtisanMapProvider');
  }
  return context;
};

export const ArtisanMapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanProfile | null>(null);
  const [hoveredArtisan, setHoveredArtisan] = useState<ArtisanProfile | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const highlightArtisanOnMap = useCallback((artisanId: string) => {
    markersRef.current.forEach((marker) => {
      const element = marker.getElement();
      const isTarget = element.dataset.artisanId === artisanId;
      
      if (isTarget) {
        element.style.transform = 'scale(1.2)';
        element.style.zIndex = '1000';
        element.classList.add('ring-4', 'ring-primary/50');
      } else {
        element.style.transform = 'scale(1)';
        element.style.zIndex = '1';
        element.classList.remove('ring-4', 'ring-primary/50');
      }
    });
  }, []);

  const resetMapHighlight = useCallback(() => {
    markersRef.current.forEach((marker) => {
      const element = marker.getElement();
      element.style.transform = 'scale(1)';
      element.style.zIndex = '1';
      element.classList.remove('ring-4', 'ring-primary/50');
    });
  }, []);

  const flyToArtisan = useCallback(async (artisan: ArtisanProfile) => {
    if (!mapRef.current || !artisan.address) return;

    try {
      // Find the marker for this artisan
      const targetMarker = markersRef.current.find(
        marker => marker.getElement().dataset.artisanId === artisan.user_id
      );

      if (targetMarker) {
        const lngLat = targetMarker.getLngLat();
        mapRef.current.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 12,
          duration: 1500
        });

        // Highlight the marker
        highlightArtisanOnMap(artisan.user_id);
        
        // Show popup after animation
        setTimeout(() => {
          targetMarker.togglePopup();
        }, 1500);
      }
    } catch (error) {
      console.error('Error flying to artisan:', error);
    }
  }, [highlightArtisanOnMap]);

  const value: ArtisanMapContextType = {
    artisans,
    setArtisans,
    selectedArtisan,
    setSelectedArtisan,
    hoveredArtisan,
    setHoveredArtisan,
    mapRef,
    markersRef,
    highlightArtisanOnMap,
    resetMapHighlight,
    flyToArtisan,
  };

  return (
    <ArtisanMapContext.Provider value={value}>
      {children}
    </ArtisanMapContext.Provider>
  );
};