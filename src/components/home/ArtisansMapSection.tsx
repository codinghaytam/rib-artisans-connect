import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useArtisanMap } from '@/contexts/ArtisanMapContext';
import { useAuth } from '@/contexts/AuthContext';

const ArtisansMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapboxToken = 'pk.eyJ1IjoiaGF5dGFtMTIzIiwiYSI6ImNtY3pjdmNmMzB0M2UyaXNidXlvZnFzeWUifQ.r_6ckMpjvRIbJsn6JeAOQg';
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  
  const { 
    artisans, 
    setArtisans, 
    mapRef, 
    markersRef, 
    selectedArtisan,
    setSelectedArtisan,
    hoveredArtisan 
  } = useArtisanMap();

  // Fetch artisans with locations
  const fetchArtisans = async () => {
    const { data, error } = await supabase
      .from('artisan_profiles')
      .select(`
        *,
        profiles!user_id (
          id,
          name,
          avatar_url,
          phone,
          email
        ),
        categories!category_id (
          id,
          name,
          emoji
        ),
        cities!city_id (
          id,
          name,
          region
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

  // Get user's current location
  useEffect(() => {
    if (user && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  }, [user]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Morocco bounds
    const moroccoBounds = new mapboxgl.LngLatBounds(
      [-17.0, 21.0], // Southwest coordinates
      [-1.0, 35.9]   // Northeast coordinates
    );
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-7.6167, 33.5167], // Morocco center (Casablanca)
      zoom: 6,
      maxBounds: moroccoBounds, // Restrict to Morocco
      minZoom: 5,
      maxZoom: 16
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      mapRef.current?.remove();
    };
  }, [mapboxToken]);

  // Add artisan markers
  useEffect(() => {
    if (!mapRef.current || !artisans.length || !mapboxToken) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const addMarkers = async () => {
      for (const artisan of artisans) {
        if (!artisan.address) continue;

        const coordinates = await geocodeAddress(artisan.address);
        if (!coordinates) continue;

        // Create marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'artisan-marker transition-all duration-200';
        markerElement.dataset.artisanId = artisan.user_id;
        markerElement.innerHTML = `
          <div class="w-10 h-10 rounded-full bg-primary border-2 border-background shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span class="text-primary-foreground text-lg">${artisan.categories?.emoji || '🔧'}</span>
          </div>
        `;

        // Add hover effects
        markerElement.addEventListener('mouseenter', () => {
          setSelectedArtisan(artisan);
          markerElement.style.transform = 'scale(1.1)';
        });

        markerElement.addEventListener('mouseleave', () => {
          if (hoveredArtisan?.user_id !== artisan.user_id) {
            markerElement.style.transform = 'scale(1)';
          }
        });

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <img 
                src="${artisan.profiles?.avatar_url || '/placeholder.svg'}" 
                alt="${artisan.profiles?.name || 'Artisan'}"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <h3 class="font-semibold text-sm">${artisan.profiles?.name || artisan.business_name || 'Artisan'}</h3>
                <p class="text-xs text-gray-600">${artisan.categories?.name || 'Artisan'}</p>
              </div>
            </div>
            <p class="text-xs text-gray-700 mb-2">${artisan.business_name || ''}</p>
            <p class="text-xs text-gray-600 mb-2">${artisan.address}</p>
            <button 
              onclick="window.navigateToArtisan('${artisan.user_id}')"
              class="w-full bg-primary text-primary-foreground text-xs py-1 px-2 rounded hover:bg-primary/90 transition-colors"
            >
              Voir le profil
            </button>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
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
  }, [artisans, mapboxToken, navigate, setSelectedArtisan, hoveredArtisan]);

  // Add user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation || !user) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create user marker element
    const userMarkerElement = document.createElement('div');
    userMarkerElement.className = 'user-marker';
    userMarkerElement.innerHTML = `
      <div class="w-12 h-12 rounded-full bg-accent border-3 border-background shadow-xl flex items-center justify-center relative">
        <div class="w-6 h-6 rounded-full bg-accent-foreground"></div>
        <div class="absolute inset-0 rounded-full border-2 border-accent animate-pulse"></div>
      </div>
    `;

    // Create popup for user location
    const userPopup = new mapboxgl.Popup({ offset: 15 }).setHTML(`
      <div class="p-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
            <span class="text-accent-foreground text-sm">👤</span>
          </div>
          <div>
            <h3 class="font-semibold text-sm">Votre position</h3>
            <p class="text-xs text-muted-foreground">${user.name}</p>
          </div>
        </div>
      </div>
    `);

    userMarkerRef.current = new mapboxgl.Marker(userMarkerElement)
      .setLngLat(userLocation)
      .setPopup(userPopup)
      .addTo(mapRef.current);

  }, [userLocation, user]);

  useEffect(() => {
    fetchArtisans();
  }, []);


  return (
    <section className="py-16 bg-gradient-to-br from-secondary/20 to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trouvez des Artisans Près de Chez Vous
          </h2>
          <p className="text-muted-foreground">
            Découvrez les artisans disponibles dans votre région au Maroc
          </p>
        </div>
        
        <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
            <p className="text-sm font-medium text-card-foreground">
              {artisans.length} artisan{artisans.length > 1 ? 's' : ''} disponible{artisans.length > 1 ? 's' : ''}
            </p>
            {user && userLocation && (
              <p className="text-xs text-muted-foreground mt-1">
                📍 Votre position affichée
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisansMapSection;