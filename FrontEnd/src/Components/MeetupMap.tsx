import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from '../../pages/studymeetup/studymeetup';

interface MeetupMapProps {
  setAddress: (address: string) => void; // Function to set the address
  currentAddress: string; // New prop to pass the current address for forward geocoding
  updateCoordinates: (lng: number, lat: number) => void; // New prop for updating coordinates
}

const MeetupMap: FunctionComponent<MeetupMapProps> = ({ setAddress, currentAddress, updateCoordinates }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Reference to the map instance
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({ lng: -74.5, lat: 40 }); // Default coordinates

  // Effect for initializing the map
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN as string;
    console.log("Map initialized");

    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coordinates.lng, coordinates.lat],
        zoom: 9,
      });

      mapRef.current = map; // Store the map instance

      // Create and add the marker
      markerRef.current = new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map);

      // Define the click handler function
      const handleMapClick = async (event: { lngLat: { lng: number; lat: number; }; }) => {
        const { lng: clickedLng, lat: clickedLat } = event.lngLat;

        // Update coordinates on click
        setCoordinates({ lng: clickedLng, lat: clickedLat }); // Update local coordinates state
        updateCoordinates(clickedLng, clickedLat); // Use the updateCoordinates function to update coordinates

        // Get address from clicked coordinates
        const address = await getAddressFromCoordinates(clickedLng, clickedLat);
        if (address) {
          setAddress(address);
        }
      };

      // Attach the click event listener
      map.on('click', handleMapClick);

      // Cleanup function
      return () => {
        map.off('click', handleMapClick); // Remove the event listener on cleanup
        map.remove(); // Remove the map
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Effect for updating marker position and centering the map when coordinates change
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([coordinates.lng, coordinates.lat]); // Update marker position
      if (mapRef.current) {
        mapRef.current.flyTo({ center: [coordinates.lng, coordinates.lat], essential: true }); // Center the map on the marker
      }
    }
  }, [coordinates]); // Update when coordinates change

  // Effect for forward geocoding when the address changes
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (currentAddress) {
        const coords = await getCoordinatesFromAddress(currentAddress);
        if (coords) {
          setCoordinates({lat: coords.lat, lng: coords.lng}); // Update coordinates state
          markerRef.current?.setLngLat([coords.lng, coords.lat]); // Update marker position
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [coords.lng, coords.lat], essential: true }); // Center the map on the new address
          }
        }
      }
    };

    fetchCoordinates();
  }, [currentAddress]); // Run when the currentAddress prop changes

  const getCoordinatesFromAddress = async (address: string): Promise<{ lng: number; lat: number } | null> => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const feature = data.features?.[0];
      if (feature) {
        return { lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] };
      } else {
        console.error('No features found for this address');
      }
    } catch (error) {
      console.error('Error fetching coordinates from address:', error);
    }
    return null;
  };

  const getAddressFromCoordinates = async (lng: number, lat: number): Promise<string | null> => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.features?.[0]?.place_name || null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  return <div style={{ width: '100%', height: '100%' }} ref={mapContainerRef} />;
};

export default MeetupMap;
