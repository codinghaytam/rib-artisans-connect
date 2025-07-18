import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useArtisanMap } from '@/contexts/ArtisanMapContext';
import { useAuth } from '@/contexts/AuthContext';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ArtisansMapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const artisanMarkersRef = useRef<L.Marker[]>([]);
  
  const { 
    artisans, 
    setArtisans, 
    selectedArtisan,
    setSelectedArtisan
  } = useArtisanMap();

  // Fetch artisans with locations
  const fetchArtisans = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching artisans:', error);
    }
  };

  // Geocode address using Nominatim (OpenStreetMap)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Morocco')}&limit=1&countrycodes=ma`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
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
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  }, [user]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Morocco bounds
    const moroccoBounds: L.LatLngBoundsExpression = [
      [21.0, -17.0], // Southwest coordinates [lat, lng]
      [35.9, -1.0]   // Northeast coordinates [lat, lng]
    ];
    
    leafletMapRef.current = L.map(mapContainer.current, {
      center: [33.5167, -7.6167], // Morocco center (Casablanca) [lat, lng]
      zoom: 6,
      maxBounds: moroccoBounds,
      minZoom: 5,
      maxZoom: 16
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Add artisan markers
  useEffect(() => {
    if (!leafletMapRef.current || !artisans.length) return;

    // Clear existing markers
    artisanMarkersRef.current.forEach(marker => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    artisanMarkersRef.current = [];

    const addMarkersToMap = async () => {
      for (const artisan of artisans) {
        if (!artisan.address) continue;

        const coordinates = await geocodeAddress(artisan.address);
        if (!coordinates) continue;

        // Create custom icon for artisan
        const artisanIcon = L.divIcon({
          html: `
            <div style="
              width: 40px; 
              height: 40px; 
              border-radius: 50%; 
              background-color: hsl(var(--primary)); 
              border: 2px solid white; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              cursor: pointer; 
              transition: transform 0.2s ease;
            ">
              <span style="color: white; font-size: 18px;">${artisan.categories?.emoji || '🔧'}</span>
            </div>
          `,
          className: 'leaflet-artisan-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Create popup content
        const popupContent = `
          <div style="padding: 8px; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img 
                src="${artisan.profiles?.avatar_url || '/placeholder.svg'}" 
                alt="${artisan.profiles?.name || 'Artisan'}"
                style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;"
              />
              <div>
                <h3 style="font-weight: 600; font-size: 14px; margin: 0;">${artisan.profiles?.name || artisan.business_name || 'Artisan'}</h3>
                <p style="font-size: 12px; color: #666; margin: 0;">${artisan.categories?.name || 'Artisan'}</p>
              </div>
            </div>
            <p style="font-size: 12px; color: #333; margin: 0 0 8px 0;">${artisan.business_name || ''}</p>
            <p style="font-size: 12px; color: #666; margin: 0 0 8px 0;">${artisan.address}</p>
            <button 
              onclick="window.navigateToArtisan('${artisan.user_id}')"
              style="
                width: 100%; 
                background-color: hsl(var(--primary)); 
                color: white; 
                font-size: 12px; 
                padding: 4px 8px; 
                border-radius: 4px; 
                border: none; 
                cursor: pointer; 
                transition: background-color 0.2s ease;
              "
              onmouseover="this.style.backgroundColor='hsl(var(--primary) / 0.9)'"
              onmouseout="this.style.backgroundColor='hsl(var(--primary))'"
            >
              Voir le profil
            </button>
          </div>
        `;

        const marker = L.marker(coordinates, { icon: artisanIcon })
          .addTo(leafletMapRef.current!)
          .bindPopup(popupContent);

        // Add hover effects
        marker.on('mouseover', () => {
          setSelectedArtisan(artisan);
        });

        artisanMarkersRef.current.push(marker);
      }
    };

    addMarkersToMap();

    // Global navigation function for popup buttons
    (window as any).navigateToArtisan = (userId: string) => {
      navigate(`/artisan/${userId}`);
    };

    return () => {
      delete (window as any).navigateToArtisan;
    };
  }, [artisans, navigate, setSelectedArtisan]);

  // Add user location marker
  useEffect(() => {
    if (!leafletMapRef.current || !userLocation || !user) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      leafletMapRef.current.removeLayer(userMarkerRef.current);
    }

    // Create custom icon for user location
    const userIcon = L.divIcon({
      html: `
        <div style="
          width: 48px; 
          height: 48px; 
          border-radius: 50%; 
          background-color: hsl(var(--accent)); 
          border: 3px solid white; 
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          position: relative;
        ">
          <div style="
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            background-color: white;
          "></div>
          <div style="
            position: absolute; 
            inset: 0; 
            border-radius: 50%; 
            border: 2px solid hsl(var(--accent)); 
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
        </div>
      `,
      className: 'leaflet-user-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    // Create popup for user location
    const userPopupContent = `
      <div style="padding: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background-color: hsl(var(--accent)); display: flex; align-items: center; justify-content: center;">
            <span style="color: hsl(var(--accent-foreground)); font-size: 14px;">👤</span>
          </div>
          <div>
            <h3 style="font-weight: 600; font-size: 14px; margin: 0;">Votre position</h3>
            <p style="font-size: 12px; color: hsl(var(--muted-foreground)); margin: 0;">${user.name || 'Utilisateur'}</p>
          </div>
        </div>
      </div>
    `;

    userMarkerRef.current = L.marker(userLocation, { icon: userIcon })
      .addTo(leafletMapRef.current)
      .bindPopup(userPopupContent);

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