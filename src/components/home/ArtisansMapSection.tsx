import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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

declare global {
  interface Window {
    google: typeof google;
  }
}

const ArtisansMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [artisans, setArtisans] = useState<ArtisanProfile[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
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

  // Geocode address to coordinates using Google Maps Geocoding API
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    if (!googleMapsApiKey) return null;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=ma&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return [location.lng, location.lat];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  };

  // Initialize Google Maps
  useEffect(() => {
    if (!mapContainer.current || !googleMapsApiKey || isMapLoaded) return;

    const loader = new Loader({
      apiKey: googleMapsApiKey,
      version: 'weekly',
      libraries: ['places', 'marker']
    });

    loader.load().then(() => {
      if (!mapContainer.current) return;

      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: 33.5167, lng: -7.6167 }, // Morocco center (Casablanca)
        zoom: 6,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapId: 'artisans-map'
      });

      setIsMapLoaded(true);
    }).catch(error => {
      console.error('Error loading Google Maps:', error);
    });

    return () => {
      setIsMapLoaded(false);
    };
  }, [googleMapsApiKey, isMapLoaded]);

  // Add artisan markers
  useEffect(() => {
    if (!map.current || !artisans.length || !isMapLoaded) return;

    const addMarkers = async () => {
      for (const artisan of artisans) {
        if (!artisan.address) continue;

        const coordinates = await geocodeAddress(artisan.address);
        if (!coordinates) continue;

        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'artisan-marker';
        markerElement.innerHTML = `
          <div class="w-10 h-10 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span class="text-white text-lg">${artisan.categories?.emoji || '🔧'}</span>
          </div>
        `;

        // Create info window content
        const infoWindowContent = `
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
              class="w-full bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
            >
              Voir le profil
            </button>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent,
        });

        // Use regular marker for better compatibility
        const marker = new window.google.maps.Marker({
          position: { lat: coordinates[1], lng: coordinates[0] },
          map: map.current,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="hsl(var(--primary))" stroke="white" stroke-width="2"/>
                <text x="20" y="28" text-anchor="middle" font-size="16" fill="white">${artisan.categories?.emoji || '🔧'}</text>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

        // Add click listener to marker
        marker.addListener('click', () => {
          infoWindow.open(map.current, marker);
        });
      }
    };

    addMarkers();

    // Global navigation function for info window buttons
    (window as any).navigateToArtisan = (userId: string) => {
      navigate(`/artisan/${userId}`);
    };

    return () => {
      delete (window as any).navigateToArtisan;
    };
  }, [artisans, isMapLoaded, navigate]);

  useEffect(() => {
    fetchArtisans();
  }, []);

  if (!googleMapsApiKey) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trouvez des Artisans Près de Chez Vous
            </h2>
            <p className="text-muted-foreground mb-6">
              Entrez votre clé API Google Maps pour voir la carte interactive des artisans
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Entrez votre clé API Google Maps..."
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
              />
              <Button onClick={() => setGoogleMapsApiKey(googleMapsApiKey)}>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Obtenez votre clé API sur{' '}
              <a 
                href="https://console.cloud.google.com/google/maps-apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
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