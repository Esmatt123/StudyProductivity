import React, { useEffect, useState } from 'react';
import MeetupMap from '../src/Components/MeetupMap';
import UpdateEventForm from '../src/Components/UpdateEventForm'; // Import the update form
import styles from '../src/Styles/_studyMeetupPage.module.css';
import { MAPBOX_ACCESS_TOKEN } from '../pages/studymeetup/studymeetup'; // Adjust this import based on your structure
import { useRouter } from 'next/router';
import { updateMeetupEvent } from '../src/api/graphql';
import { toast } from 'react-toastify';

interface EventData {
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

interface EventDetails {
  title: string;
  description: string;
  meetupDate: Date;
  address: string;
  latitude: number;
  longitude: number;
  locationName: string;
  meetupEventId: string; // Add this to match UpdateEventForm's expectations
}

const UpdateStudyMeetupPage: React.FC = () => {
  const router = useRouter(); // Initialize history for navigation
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({ lng: 0, lat: 0 });
  const [eventAddress, setEventAddress] = useState<string>(''); 
  const [userId, setUserId] = useState<string | null>(null); 
  const [eventDetails, setEventDetails] = useState<{
    title: string; 
    description: string; 
    meetupDate: Date; 
    address: string; 
    latitude: number; 
    longitude: number;
    locationName: string; 
  } | null>(null); // Use null initially
  const [meetupEventId, setMeetupEventId] = useState<string | null>(null); // Add state for meetupEventId

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  
    // Retrieve the event details from local storage
    const storedEventDetails = localStorage.getItem('eventDetails');
  
    // Check if storedEventDetails is valid
    if (storedEventDetails) {
      try {
        const parsedDetails = JSON.parse(storedEventDetails);
        
        // Ensure that the parsed details contain the expected properties
        if (parsedDetails && parsedDetails.longitude && parsedDetails.latitude && parsedDetails.address) {
          setEventDetails(parsedDetails);
          setCoordinates({ lng: parsedDetails.longitude, lat: parsedDetails.latitude });
          setEventAddress(parsedDetails.address);
          setMeetupEventId(parsedDetails.meetupEventId); // Set meetupEventId from parsed details
        } else {
          // Handle invalid data
          toast.error('Event details are missing required properties.');
          router.push('/studymeetup'); // Redirect to the meetup list if details are invalid
        }
      } catch (error) {
        console.error('Failed to parse event details:', error);
        toast.error('Error retrieving event details. Please try again.');
        router.push('/studymeetup'); // Redirect to the meetup list on error
      }
    } else {
      // Handle the case where no event details are found
      toast.error('No event details found.');
      router.push('/studymeetup'); // Redirect to the meetup list if no details
    }
  }, [router]);

  const reverseGeocode = async (lng: number, lat: number) => {
    const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    try {
      const response = await fetch(reverseGeocodeUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name; // Get the human-readable address
      } else {
        throw new Error('No address found for these coordinates');
      }
    } catch (error) {
      console.error('Error fetching reverse geocoding data:', error);
      alert('Failed to fetch address data. Please try again.');
      return null;
    }
  };

  const updateCoordinates = async (lng: number, lat: number) => {
    setCoordinates({ lng, lat });
    const address = await reverseGeocode(lng, lat);
    if (address) {
      setEventAddress(address); // Update the eventAddress in UpdateEventForm
    }
  };

  const handleSubmit = async (eventData: EventData) => {
    if (!eventDetails || !userId || !meetupEventId) {
      alert('Event details, user ID, or meetup event ID are missing.');
      return;
    }

    try {
      const meetupDate = typeof eventDetails.meetupDate === 'string' 
        ? new Date(eventDetails.meetupDate) 
        : eventDetails.meetupDate;

      if (!meetupDate || isNaN(meetupDate.getTime())) {
        throw new Error('Invalid date format for meetupDate');
      }

      const formattedDate = meetupDate.toISOString();
      await updateMeetupEvent(
        eventData.meetupEventId, // Pass meetupEventId here
        eventData.title,
        eventData.description,
        formattedDate,
        eventData.latitude,
        eventData.longitude,
        eventData.locationName,
        eventData.address,
        userId
      );

      router.push('/studymeetup');
    } catch (error) {
      console.error("Error updating meetup event:", error);
      alert("There was an error updating the event. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {eventDetails && ( // Ensure eventDetails is not null before rendering
          <UpdateEventForm 
            address={eventAddress} 
            setAddress={setEventAddress} 
            createdByUserId={userId} // Change this prop to createdByUserId
            latitude={coordinates.lat} 
            longitude={coordinates.lng}        
            eventDetails={eventDetails as EventDetails } 
            meetupEventId={meetupEventId} // Pass meetupEventId to the form
            onSubmit={handleSubmit} // Pass the handleSubmit function
          />
        )}
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

export default UpdateStudyMeetupPage;
