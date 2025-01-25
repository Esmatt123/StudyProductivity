import React, { useState, useEffect, useRef, FormEvent } from 'react';
import styles from '../Styles/_eventForm.module.css';
import { MAPBOX_ACCESS_TOKEN } from '../../pages/studymeetup/studymeetup';

// First, define a common interface for the event data
interface EventFormData {
  meetupEventId: string;
  title: string;
  description: string;
  meetupDate: string;  // Keep as string for form data
  locationName: string;
  address: string;
  createdByUserId: string | null;
  latitude: number;
  longitude: number;
}

interface UpdateEventFormProps {
  address: string;
  setAddress: (address: string) => void;
  createdByUserId: string | null;
  latitude: number;
  longitude: number;
  eventDetails: {
    title: string;
    description: string;
    meetupDate: Date;
    locationName: string;
    meetupEventId: string;
  };
  meetupEventId: string | null;
  onSubmit: (eventData: EventFormData) => Promise<void>;
}

interface MapboxGeometry {
  type: string;
  coordinates: [number, number];
}

interface MapboxContext {
  id: string;
  text: string;
  // Add other context properties if needed
}

interface MapboxFeature {
  bbox?: [number, number, number, number];
  center: [number, number];
  context: MapboxContext[];
  geometry: MapboxGeometry;
  id: string;
  place_name: string;
  place_type: string[];
  properties: {
    mapbox_id: string;
    wikidata?: string;
  };
  relevance: number;
  text: string;
  type: 'Feature';
}


const UpdateEventForm: React.FC<UpdateEventFormProps> = ({
  address,
  setAddress,
  createdByUserId,
  eventDetails,
  onSubmit
}) => {
  const [eventName, setEventName] = useState(eventDetails.title);
  const [locationName, setLocationName] = useState(eventDetails.locationName);
  const [eventDate, setEventDate] = useState(new Date(eventDetails.meetupDate).toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState(new Date(eventDetails.meetupDate).toISOString().split('T')[1].substring(0, 5)); // HH:mm
  const [eventDescription, setEventDescription] = useState(eventDetails.description);
  const [localAddress, setLocalAddress] = useState(address); 
  const [suggestions, setSuggestions] = useState<string[]>([]); 
  const prevAddressRef = useRef(address); 

  useEffect(() => {
    if (prevAddressRef.current !== address) {
      setLocalAddress(address); 
      prevAddressRef.current = address; 
    }
  }, [address]); 

  const fetchCoordinatesByAddress = async (address: string): Promise<{ lng: number; lat: number } | null> => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const { center } = data.features[0];
        return { lng: center[0], lat: center[1] };
      } else {
        throw new Error('No coordinates found for this address');
      }
    } catch (error) {
      console.error('Error fetching coordinates by address:', error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Fetch coordinates for the address, with error handling
      let coordinates;
      try {
        coordinates = await fetchCoordinatesByAddress(localAddress);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        alert("There was an error fetching the coordinates. Please check the address and try again.");
        return; // Stop the form submission if fetching coordinates fails
      }

      if (!coordinates) {
        console.error("Coordinates not found for the address.");
        alert("Could not find coordinates for the provided address.");
        return;
      }

      // Combine event date and time, with error handling
      let meetupDate;
      try {
        meetupDate = new Date(`${eventDate}T${eventTime}`);
        if (isNaN(meetupDate.getTime())) {
          throw new Error("Invalid date or time format");
        }
      } catch (error) {
        console.error("Error parsing date or time:", error);
        alert("There was an error with the date or time. Please ensure it's correct.");
        return; // Stop form submission if date parsing fails
      }

      // Format the date as a full ISO string (with the Z for UTC)
      const formattedDate = meetupDate.toISOString().replace(".000Z", "Z");
      console.log("meetupeventid: " + eventDetails.meetupEventId)
      // Prepare event data
      const eventData = {
        meetupEventId: eventDetails.meetupEventId, // Include meetupEventId here
        title: eventName,
        description: eventDescription,
        meetupDate: formattedDate, // Correct format with Z
        locationName: locationName,
        address: localAddress,
        createdByUserId: createdByUserId,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        
      };

      console.log(eventData.meetupEventId)
      
      // Submit the data to the parent component's onSubmit handler
      try {
        await onSubmit(eventData);
      } catch (error) {
        console.error("Error submitting event data:", error);
        alert("There was an error submitting the event. Please try again.");
      }
    } catch (generalError) {
      // Catch any unexpected errors
      console.error("Unexpected error during event submission:", generalError);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalAddress(value); 

    if (value) {
      const results = await fetchAddressSuggestions(value);
      setSuggestions(results);
    } else {
      setSuggestions([]); 
    }
  };

  const fetchAddressSuggestions = async (query: string): Promise<string[]> => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      console.log("feature data: ", data)
      return data.features?.map((feature: MapboxFeature) => feature.place_name) || [];
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      return [];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalAddress(suggestion); 
    setAddress(suggestion); 
    setSuggestions([]); 
  };

  return (
    <form className={styles.eventForm} onSubmit={handleSubmit}>
      <h3>Update Event</h3>
      <label htmlFor="eventName">Event Name:</label>
      <input
        type="text"
        id="eventName"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
        placeholder="Enter event name"
      />
      <label htmlFor="locationName">Location Name:</label>
      <input
        type="text"
        id="locationName"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        required
        placeholder="Enter location name"
      />
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        id="address"
        value={localAddress}
        onChange={handleAddressChange}
        required
        placeholder="Enter event address"
      />
      {suggestions.length > 0 && (
        <select
          onChange={(e) => handleSuggestionClick(e.target.value)}
          value={localAddress}
          className={styles.suggestionsSelect}
        >
          <option value="">Select an address...</option>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion}>
              {suggestion}
            </option>
          ))}
        </select>
      )}
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />
      <label htmlFor="time">Time:</label>
      <input
        type="time"
        id="time"
        value={eventTime}
        onChange={(e) => setEventTime(e.target.value)}
        required
      />
      <label htmlFor="description">Event Description:</label>
      <textarea
        id="description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        required
        placeholder="Enter event description"
        rows={5}
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateEventForm;
