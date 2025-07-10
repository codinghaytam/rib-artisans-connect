import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

type ArtisanProfile = Database['public']['Tables']['artisan_profiles']['Row'] & {
  profiles: {
    name: string;
    avatar_url: string | null;
  };
  categories: {
    name: string;
    emoji: string | null;
  };
};

const ArtisansMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const navigate = useNavigate();

  // Fetch artisans with locations
  const fetchArtisans = async () => {
    const { data, error } = await supabase
      .from('artisan_profiles')
      .select(`
        *,
        profiles!inner (
          name,
          avatar_url
        ),
        categories!inner (
          name,
          emoji
        )
      `)
      .not('address', 'is', null)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching artisans:', error);
      return;
    }

    setArtisans(data || []);
  };

  // Geocode address to coordinates
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    if (!mapboxToken) return null;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=MA&limit=1`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.6167, 33.5167], // Morocco center (Casablanca)
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add artisan markers
  useEffect(() => {
    if (!map.current || !artisans.length || !mapboxToken) return;

    const addMarkers = async () => {
      for (const artisan of artisans) {
        if (!artisan.address) continue;

        const coordinates = await geocodeAddress(artisan.address);
        if (!coordinates) continue;

        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'artisan-marker';
        markerElement.innerHTML = `
          <div class="w-10 h-10 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span class="text-white text-lg">${artisan.categories?.emoji || '🔧'}</span>
          </div>
        `;

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <img 
                src="${artisan.profiles?.avatar_url || '/placeholder.svg'}" 
                alt="${artisan.profiles?.name}"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 class="font-semibold text-sm">${artisan.profiles?.name}</h3>
                <p class="text-xs text-gray-600">${artisan.categories?.name}</p>
              </div>
            </div>
            <p class="text-xs text-gray-700 mb-2">${artisan.business_name || ''}</p>
            <p class="text-xs text-gray-600 mb-2">${artisan.address}</p>
            <button 
              onclick="window.navigateToArtisan('${artisan.user_id}')"
              class="w-full bg-primary text-white text-xs py-1 px-2 rounded hover:bg-primary/90 transition-colors"
            >
              Voir le profil
            </button>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

        new mapboxgl.Marker(markerElement)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      }
    };

    addMarkers();

    // Global navigation function for popup buttons
    (window as any).navigateToArtisan = (userId: string) => {
      navigate(`/artisan/${userId}`);
    };

    return () => {
      delete (window as any).navigateToArtisan;
    };
  }, [artisans, mapboxToken, navigate]);

  useEffect(() => {
    fetchArtisans();
  }, []);

  if (!mapboxToken) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trouvez des Artisans Près de Chez Vous
            </h2>
            <p className="text-muted-foreground mb-6">
              Entrez votre token Mapbox pour voir la carte interactive des artisans
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Entrez votre token Mapbox..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button onClick={() => setMapboxToken(mapboxToken)}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Obtenez votre token sur{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/20 to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trouvez des Artisans Près de Chez Vous
          </h2>
          <p className="text-muted-foreground">
            Découvrez les artisans disponibles dans votre région
          </p>
        </div>
        
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-gray-700">
              {artisans.length} artisan{artisans.length > 1 ? 's' : ''} disponible{artisans.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisansMapSection;