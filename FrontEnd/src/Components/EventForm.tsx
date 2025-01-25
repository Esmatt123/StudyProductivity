import React, { useState, useEffect, useRef, FormEvent } from 'react';
import styles from '../Styles/_eventForm.module.css';
import { MAPBOX_ACCESS_TOKEN } from '../../pages/studymeetup/studymeetup';
import { createMeetupEvent } from '../api/graphql'; // Adjust the import path
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EventFormProps {
  address: string;
  setAddress: (address: string) => void;
  userId: string | null;
  latitude: number;
  longitude: number;
}


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


const EventForm: React.FC<EventFormProps> = ({ address, setAddress, userId, latitude, longitude }) => {
  const [eventName, setEventName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [localAddress, setLocalAddress] = useState(address);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const prevAddressRef = useRef(address);
  const router = useRouter();

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  useEffect(() => {
    if (prevAddressRef.current !== address) {
      setLocalAddress(address);
      prevAddressRef.current = address;
      console.log('Local address updated to:', address);
    }
  }, [address]);

  const fetchCoordinatesByAddress = async (address: string): Promise<{ lng: number; lat: number } | null> => {
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await fetch(geocodeUrl);
      if (!response.ok) throw new Error('Failed to fetch coordinates.');

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const { center } = data.features[0];
        return { lng: center[0], lat: center[1] };
      } else {
        throw new Error('No coordinates found for the provided address.');
      }
    } catch (error) {
      console.error('Error fetching coordinates by address:', error);
      toast.error('Error fetching coordinates. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const coordinates = await fetchCoordinatesByAddress(localAddress);
    if (coordinates) {
      latitude = coordinates.lat;
      longitude = coordinates.lng;
    } else {
      return; // Exit if coordinates are not fetched
    }

    const meetupDate = new Date(`${eventDate}T${eventTime}`).toISOString();

    const eventData = {
      title: eventName,
      description: eventDescription,
      meetupDate,
      locationName,
      address: localAddress,
      createdByUserId: userId,
      latitude,
      longitude
    };

    try {
      const createdEvent = await createMeetupEvent(
        eventData.title,
        eventData.description,
        eventData.meetupDate,
        eventData.locationName,
        eventData.address,
        eventData.createdByUserId,
        eventData.latitude,
        eventData.longitude
      );

      console.log('Meetup event created:', createdEvent);
      toast.success('Event created successfully!');

      setEventName('');
      setLocationName('');
      setLocalAddress('');
      setEventDate('');
      setEventTime('');
      setEventDescription('');
      setSuggestions([]);
      setAddress('');
      router.push('/studymeetup');
    } catch (error) {
      console.error('Failed to create meetup event:', error);
      toast.error('Failed to create event. Please try again.');
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
      return data.features?.map((feature: MapboxFeature) => feature.place_name) || [];
    } catch (error) {
      toast.error('Error fetching address suggestions:',);
      console.error(getErrorMessage(error))
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
      <h3>Create Event</h3>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventForm;
