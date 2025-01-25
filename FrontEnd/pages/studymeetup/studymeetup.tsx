import React, { useEffect, useState } from 'react';
import MeetupMap from '../../src/Components/MeetupMap';
import EventForm from '../../src/Components/EventForm';
import styles from '../../src/Styles/_studyMeetupPage.module.css';

export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_VITE_MAPBOX_API_KEY;

const StudyMeetupPage = () => {
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({ lng: -74.5, lat: 40 });
  const [eventAddress, setEventAddress] = useState<string>(''); // Create address state
  const [userId, setUserId] = useState<string | null>(null); // State to store userId


  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId); // Set userId from localStorage on component mount
  }, []); // Run only once on mount

  const reverseGeocode = async (lng: number, lat: number) => {
    const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await fetch(reverseGeocodeUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name; // Get the human-readable address
        return address;
      } else {
        throw new Error('No address found for these coordinates');
      }
    } catch (error) {
      console.error('Error fetching reverse geocoding data:', error);
      alert('Failed to fetch address data. Please try again.');
      return null;
    }
  };

  // Update the coordinates handler to reverse geocode after setting coordinates
  const updateCoordinates = async (lng: number, lat: number) => {
   
    setCoordinates({ lng, lat });
    const address = await reverseGeocode(lng, lat); // Reverse geocode the new coordinates
    if (address) {
      setEventAddress(address); // Update the eventAddress in EventForm
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <EventForm 
          address={eventAddress} // Pass the current address as a prop
          setAddress={setEventAddress} // Pass the address updater function
          userId={userId} 
          latitude={coordinates.lat} 
          longitude={coordinates.lng}        
        />
      </div>
      <div className={styles.mapContainer}>
        <MeetupMap
          currentAddress={eventAddress} // Pass the current address for forward geocoding
          setAddress={setEventAddress} // Pass the address updater function to map
          updateCoordinates={updateCoordinates} // Pass the updateCoordinates function directly
        />
      </div>
    </div>
  );
};

export default StudyMeetupPage;
