import { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
// Removed the import of Image from 'next/image'
import { updateUserProfile, useUserProfile } from '../../src/api/graphql'; // Import the new hook
import styles from '../../src/Styles/_profile.module.css';
import Link from 'next/link';

interface MeetupEvent {
  meetupEventId: string;
  title: string;
  meetupDate: string;
  description: string;
}

interface UserBasic {
  username: string;
  profileImageUrl?: string;
}

interface Friend {
  friendUserId: string;
  user: UserBasic;
  friendUser: UserBasic;
}

interface User {
  username: string;
  email: string;
  friends: Friend[];
  createdEvents: MeetupEvent[];
  joinedEvents: MeetupEvent[];
}

interface UserProfile {
  bio: string;
  profileImageUrl?: string;
  user: User;
}

// Define the query response type
interface GetUserProfileResponse {
  userProfile: UserProfile;
}

const ProfilePage: FunctionComponent = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { loading, error, profile, refetch } = useUserProfile(userId);
  const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;

  // Helper function to get relative path
  const getRelativePath = (absolutePath: string): string => {
    const marker = 'wwwroot';
    const index = absolutePath.indexOf(marker);
    return index !== -1
      ? absolutePath.substring(index + marker.length).replace(/\\/g, '/')
      : absolutePath;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    // Options for formatting
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',    // "Monday"
      year: 'numeric',    // "2023"
      month: 'long',      // "August"
      day: 'numeric',     // "25"
      hour: 'numeric',    // "5 PM"
      minute: '2-digit',  // "05"
      hour12: true,       // 12-hour clock
    };
    return date.toLocaleString(undefined, options);
  };

  useEffect(() => {
    if (profile) {
      setBioText(profile.bio || '');
    }
  }, [profile]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading profile information.</p>;
  }

  const handleEditBio = () => setIsEditing(true);

  const handleSaveBio = async () => {
    if (!userId) return;

    try {
      setIsEditing(false);
      await updateUserProfile(userId, bioText, profile?.profileImageUrl);
      await refetch(); // Refetch profile data after bio update
      alert('Bio updated successfully!');
    } catch (error) {
      console.error('Error saving bio:', error);
      alert('There was an error updating the bio.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile || !userId) return;
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/fileupload/uploadProfilePicture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('File upload failed');
      }
  
      const data = await response.json();
  
      // No need to call updateUserProfile here if the backend updates the profile picture
      await refetch(); // Refetch the profile data to get the updated profile picture URL
  
      alert('Profile picture updated successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('There was an error uploading the profile picture.');
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className={styles.profilePage}>
      <section className={styles.profileSection}>
        <div className={styles.profilePic}>
          {/* Replace Image component with img tag */}
          <img
            width={256}
            height={256}
            src={
              profile?.profileImageUrl
                ? `${getRelativePath(profile.profileImageUrl)}`
                : '/profile-placeholder.png' // Path to your default image
            }
            alt="Profile Pic"
          />
        </div>
        <div className={styles.uploadSection}>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button
            className={styles.uploadButton}
            onClick={handleUploadPicture}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Uploading...' : 'Upload Picture'}
          </button>
        </div>
        <div className={styles.userInfo}>
          <h1>{profile?.user?.username}</h1>
          <p>{profile?.user?.email}</p>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <h2>Bio</h2>
        {isEditing ? (
          <>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              rows={4}
              cols={50}
            />
            <button className={styles.editAboutButton} onClick={handleSaveBio}>
              Save
            </button>
          </>
        ) : (
          <>
            <p>{bioText || 'No bio information available'}</p>
            <button className={styles.editAboutButton} onClick={handleEditBio}>
              Edit Bio
            </button>
          </>
        )}
      </section>

      {/* Friends List */}
      <section className={styles.friendsList}>
        <h2>Friends</h2>
        <ul>
          {profile?.user?.friends.length > 0 ? (
            profile.user.friends.map((friend: Friend) => (
              <li className={styles.listedfriend} key={friend.friendUserId}>
                <Link href={`/profile/${friend.friendUserId}`}>
                  <div className={styles.friendCard}>
                    <img
                      width={50}
                      height={50}
                      src={
                        friend.friendUser.profileImageUrl
                          ? `${BACKEND_URL}${getRelativePath(friend.friendUser.profileImageUrl)}`
                          : '/profile-placeholder.png'
                      }
                      alt="Friend Pic"
                      className={styles.friendImage}
                    />

                    <span className={styles.friendName}>{friend.friendUser.username}</span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p>No friends added yet</p>
          )}
        </ul>
      </section>

      {/* Created Study Events Section */}
      <section className={styles.eventsSection}>
        <h2>Created Study Events</h2>
        {profile?.user?.createdEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {profile.user.createdEvents.map((event: MeetupEvent) => (
              <div key={event.meetupEventId} className={styles.eventCard}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDate}>{formatDate(event.meetupDate)}</p>
                <p className={styles.eventDescription}>{event.description}</p>
                {/* Optionally, add more event details or a button */}
              </div>
            ))}
          </div>
        ) : (
          <p>No created events yet</p>
        )}
      </section>

      {/* Joined Study Events Section */}
      {/* Joined Study Events Section */}
      <section className={styles.eventsSection}>
        <h2>Joined Study Events</h2>
        {profile?.user?.joinedEvents.length > 0 ? (
          <div className={styles.eventsGrid}>
            {profile.user.joinedEvents.map((event: MeetupEvent) => (
              <div key={event.meetupEventId} className={styles.eventCard}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDate}>{formatDate(event.meetupDate)}</p>
                <p className={styles.eventDescription}>{event.description}</p>
                {/* Optionally, add more event details or a button */}
              </div>
            ))}
          </div>
        ) : (
          <p>No joined events yet</p>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;