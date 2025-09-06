/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import L from 'leaflet';

// Narrow type for map needs; compatible with both public and contact views
export type MapArtisan = {
  id?: string | null;
  user_id: string;
  business_name?: string | null;
  address?: string | null; // Only present for authenticated/contact view
  categories?: { emoji?: string | null; name?: string | null } | null;
  cities?: { name?: string | null; region?: string | null } | null;
  profiles?: { name?: string | null; avatar_url?: string | null } | null;
};

interface ArtisanMapContextType {
  artisans: MapArtisan[];
  setArtisans: (artisans: MapArtisan[]) => void;
  selectedArtisan: MapArtisan | null;
  setSelectedArtisan: (artisan: MapArtisan | null) => void;
  hoveredArtisan: MapArtisan | null;
  setHoveredArtisan: (artisan: MapArtisan | null) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
  markersRef: React.MutableRefObject<L.Marker[]>;
  highlightArtisanOnMap: (artisanId: string) => void;
  resetMapHighlight: () => void;
  flyToArtisan: (artisan: MapArtisan) => void;
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
  const [artisans, setArtisans] = useState<MapArtisan[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<MapArtisan | null>(null);
  const [hoveredArtisan, setHoveredArtisan] = useState<MapArtisan | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

  const flyToArtisan = useCallback(async (artisan: MapArtisan) => {
    if (!mapRef.current || !artisan.address) return;

    try {
      // Find the marker for this artisan
      const targetMarker = markersRef.current.find((marker) => {
        const el = marker.getElement() as HTMLElement | null;
        return el?.dataset?.artisanId === artisan.user_id;
      });

      if (targetMarker) {
        const latLng = targetMarker.getLatLng();
        mapRef.current.flyTo([latLng.lat, latLng.lng], 12, {
          duration: 1.5
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