import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationResult {
  lat: number;
  lon: number;
  formatted: string;
  city?: string;
  country?: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = "Rechercher une localisation...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Geocode using Geoapify
  const searchLocations = async (searchQuery: string): Promise<LocationResult[]> => {
    if (!searchQuery.trim()) return [];

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&limit=5&format=json&apiKey=5a9c3b7c17b54c4bb8a7e1f4a3e5d6c8&filter=countrycode:ma`
      );
      const data = await response.json();

      if (data && data.results) {
        return data.results.map((result: any) => ({
          lat: result.lat,
          lon: result.lon,
          formatted: result.formatted,
          city: result.city,
          country: result.country
        }));
      }
    } catch (error) {
      console.error('Location search error:', error);
    }

    return [];
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length > 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        const results = await searchLocations(value);
        setResults(results);
        setIsLoading(false);
        setShowResults(true);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationResult) => {
    setQuery(location.formatted);
    setShowResults(false);
    onLocationSelect(location);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=5a9c3b7c17b54c4bb8a7e1f4a3e5d6c8`
            );
            const data = await response.json();
            
            if (data && data.results && data.results.length > 0) {
              const result = data.results[0];
              const location: LocationResult = {
                lat: latitude,
                lon: longitude,
                formatted: result.formatted,
                city: result.city,
                country: result.country
              };
              
              setQuery(location.formatted);
              onLocationSelect(location);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1" ref={inputRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-10"
            onFocus={() => {
              if (results.length > 0) setShowResults(true);
            }}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
          
          {/* Results dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors border-b last:border-b-0 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{result.formatted}</div>
                    {result.city && result.country && (
                      <div className="text-xs text-muted-foreground">
                        {result.city}, {result.country}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex-shrink-0"
          title="Utiliser ma position actuelle"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LocationSearch;