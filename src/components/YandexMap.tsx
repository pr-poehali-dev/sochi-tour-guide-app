import { useEffect, useRef } from 'react';

interface MapLocation {
  id: number;
  name: string;
  coords: [number, number];
  description: string;
  category: string;
}

interface YandexMapProps {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
}

const YandexMap = ({ locations, onLocationClick }: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (typeof window !== 'undefined' && (window as any).ymaps) {
        (window as any).ymaps.ready(() => {
          if (!mapInstance.current && mapRef.current) {
            const map = new (window as any).ymaps.Map(mapRef.current, {
              center: [43.585472, 39.723098],
              zoom: 11,
              controls: ['zoomControl', 'geolocationControl', 'searchControl']
            });

            mapInstance.current = map;

            locations.forEach((location) => {
              const placemark = new (window as any).ymaps.Placemark(
                location.coords,
                {
                  balloonContentHeader: location.name,
                  balloonContentBody: location.description,
                  hintContent: location.name
                },
                {
                  preset: 'islands#icon',
                  iconColor: location.category === 'nature' ? '#22c55e' :
                            location.category === 'beach' ? '#3b82f6' :
                            location.category === 'culture' ? '#8b5cf6' :
                            location.category === 'food' ? '#f97316' : '#6366f1'
                }
              );

              placemark.events.add('click', () => {
                if (onLocationClick) {
                  onLocationClick(location);
                }
              });

              map.geoObjects.add(placemark);
            });
          }
        });
      }
    };

    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, [locations, onLocationClick]);

  return <div ref={mapRef} className="w-full h-full min-h-[600px]" />;
};

export default YandexMap;
