import React, { FunctionComponent, useEffect, useState } from 'react';
import styles from '../../src/Styles/_meetupList.module.css'; // Import the CSS Module styles
import { getAllMeetupsAsync, deleteMeetup, toggleAttendance } from '../../src/api/graphql'; // Adjust the path as necessary
import { Marker } from 'react-map-gl'; // Import Mapbox
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from './studymeetup';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useUserId } from '../../src/providers/useUserId';



// Dynamically import the Map component
const MapComponent = dynamic(() => import('react-map-gl').then((mod) => mod.default), {
  ssr: false, // Prevent server-side rendering
});

export interface Meetup {
  meetupEventId: string;
  title: string;
  description: string;
  meetupDate: Date;
  location: string;
  latitude: number;
  longitude: number;
  address: string;
  createdByUserId: string;
  attendees: Attendee[];
}
interface Attendee {
  userId: string;
  eventId: string;
  username: string;
}

const MeetupListPage: FunctionComponent = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [attending, setAttending] = useState(false);
  const router = useRouter();
  const { userId } = useUserId()

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }
  

  const fetchMeetups = async () => {
    if (!userId) {
      setError('User ID not found in local storage.');
      setLoading(false);
      return;
    }

    try {
      const meetupsData = await getAllMeetupsAsync(userId);
      if (meetupsData) {
        const formattedMeetups: Meetup[] = meetupsData.map((meetup: { meetupDate: Date, attendees?: string[] }) => ({
          ...meetup,
          meetupDate: new Date(meetup.meetupDate),
          attendees: meetup.attendees || [],
        }));
        setMeetups(formattedMeetups);
      } else {
        setError('No meetups found.');
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'An error occurred while fetching meetups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, []);

  const formatDate = (date: Date) => {
    // Format the date
    const formattedDate = new Intl.DateTimeFormat('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  
    // Format the time in 24-hour format
    const formattedTime = new Intl.DateTimeFormat('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  
    // Return both date and time, separated by a newline
    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

 


  

  const handleShow = (meetup: Meetup) => {
    setSelectedMeetup(meetup);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedMeetup(null);
    setShowModal(false);
  };

  const handleToggleAttendance = async (meetupEventId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to toggle attendance.');
      return;
    }

    setAttending(true);
    try {
      const message = await toggleAttendance(meetupEventId, userId);
      alert(message);
    } catch (error) {
      console.error('Error toggling attendance:', error);
      alert('Error toggling attendance. Please try again.');
    } finally {
      setAttending(false);
      handleClose();
    }
  };

  const handleDelete = async (meetupEventId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this meetup?');
    if (!confirmed) return;

    try {
        // Optimistically update the UI
        setMeetups(prevMeetups => prevMeetups.filter(
            meetup => meetup.meetupEventId !== meetupEventId
        ));
        
        // Close the modal
        handleClose();

        // Perform the deletion in the backend
        await deleteMeetup(meetupEventId, userId);
        
        // Refetch to ensure synchronization
        fetchMeetups();
        
        // Optional: Show success message
        alert('Meetup deleted successfully.');
    } catch (error) {
        console.error('Failed to delete the meetup:', error);
        alert('Error deleting the meetup. Please try again.');
        
        // Revert the optimistic update if the deletion failed
        fetchMeetups();
    }
};


  const handleEdit = (meetupEventId: string, existingEventData: Meetup) => {
    localStorage.setItem('eventDetails', JSON.stringify(existingEventData));
    router.push(`/updateStudyMeetup`);
  };

  const handleCreateEvent = () => {
    router.push('/studymeetup/studymeetup')
  };

  return (
    <div className={styles.meetupListing}>
      <h2>Your Meetups & Friends' Meetups</h2>
      <button className={styles.createEventButton} onClick={handleCreateEvent}>
        Create Event
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      <div className={styles.gridContainer}>
        {meetups.length > 0 ? (
          meetups.map((meetup) => {
            const { date, time } = formatDate(meetup.meetupDate); // Destructure formatted date and time

            return (
              <div key={meetup.meetupEventId} className={styles.gridItem}>
                <h3>{meetup.title}</h3>
                <p>{date}</p>
                <p>{time}</p>
                <p>{meetup.location}</p>
                <p>{Array.isArray(meetup.attendees) ? meetup.attendees.length : 0} attendees</p>

                {meetup.latitude !== undefined && meetup.longitude !== undefined ? (
                  <div className={styles.mapContainer}>
                    <MapComponent
                      initialViewState={{
                        longitude: meetup.longitude,
                        latitude: meetup.latitude,
                        zoom: 12,
                      }}
                      style={{ width: '100%', height: '200px' }}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                    >
                      <Marker latitude={meetup.latitude} longitude={meetup.longitude} />
                    </MapComponent>
                  </div>
                ) : (
                  <p className={styles.errorMessage}>Location data not available.</p>
                )}

                <button className={styles.detailsButton} onClick={() => handleShow(meetup)}>
                  View Details
                </button>
              </div>
            );
          })
        ) : (
          !loading && <p>No meetups available.</p>
        )}
      </div>

      {selectedMeetup && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleClose}>
              ✖
            </button>
            <h2>{selectedMeetup.title}</h2>
            <p><strong>Date:</strong> {formatDate(selectedMeetup.meetupDate).date}</p>
            <p><strong>Time:</strong> {formatDate(selectedMeetup.meetupDate).time}</p>
            <p><strong>Description:</strong> {selectedMeetup.description}</p>
            <p><strong>Location:</strong> {selectedMeetup.location}</p>
            <p><strong>Address:</strong> {selectedMeetup.address}</p>

            {selectedMeetup.latitude !== undefined && selectedMeetup.longitude !== undefined && (
              <div className={styles.mapContainer}>
                <MapComponent
                  initialViewState={{
                    longitude: selectedMeetup.longitude,
                    latitude: selectedMeetup.latitude,
                    zoom: 12,
                  }}
                  style={{ width: '100%', height: '200px' }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
                >
                  <Marker latitude={selectedMeetup.latitude} longitude={selectedMeetup.longitude} />
                </MapComponent>
              </div>
            )}
            {selectedMeetup.attendees && selectedMeetup.attendees.length > 0 ? (
              <div>
                <h3>Attendees:</h3>
                <ul>
                  {selectedMeetup.attendees.map(attendee => (
                    <li style={{ listStyleType: "none" }} key={attendee.userId}>{attendee.username}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No attendees yet.</p>
            )}

            {selectedMeetup.createdByUserId === localStorage.getItem('userId') ? (
              <>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(selectedMeetup.meetupEventId)}
                >
                  Delete
                </button>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(selectedMeetup.meetupEventId, selectedMeetup)}
                >
                  Edit
                </button>
              </>
            ) : (
              <button
                className={styles.attendButton}
                onClick={() => handleToggleAttendance(selectedMeetup.meetupEventId)}
                disabled={attending}
              >
                {attending ? 'Attending...' : 'Toggle Attendance'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetupListPage;
