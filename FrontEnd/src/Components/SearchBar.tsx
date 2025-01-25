import { FunctionComponent, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { SEARCH_USERS, ADD_FRIEND } from '../api/graphql'; // Import the correct queries/mutations
import styles from '../Styles/_searchBar.module.css'; // Import your CSS module for styling

interface searchBarProps{
  userId: string | null
}

const SearchBar: FunctionComponent<searchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Track if the search is active
  const [searchUsers] = useLazyQuery(SEARCH_USERS); // Lazy query to search users
  const [addFriend] = useMutation(ADD_FRIEND); // Mutation to add friend
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])


  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    } 

    setLoading(true);
    setIsSearching(true);
    try {
      const { data } = await searchUsers({ variables: { searchTerm } }); // Pass searchTerm to query
      setSearchResults(data?.searchUsers || []); // Update search results
    } catch (error) {
      console.error('Error in search:', error);
    }
    setLoading(false);
  };

  const handleAddFriend = async (friendUserId: string) => {
    if (!userId) {
      console.error('No user ID found in localStorage.');
      return;
    }

    if (userId === friendUserId) {
      alert('You cannot add yourself as a friend.');
      return;
    }

    try {
      await addFriend({
        variables: {
          userId, // Current user's ID
          friendUserId, // Friend's ID
        },
      });
      alert('Friend added successfully');
    } catch (error) {
      console.error('Error adding friend:', JSON.stringify(error, null, 2));
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for users..."
        onKeyUp={handleSearch} // Trigger search on key up
        className={styles.searchInput}
      />
      <button onClick={handleSearch} disabled={loading} className={styles.searchButton}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Dropdown visible only when searching and results are available */}
      {isSearching && searchResults.length > 0 && (
        <div className={styles.dropdown}>
          {searchResults.map((user) => (
            <div key={user.userId} className={styles.dropdownItem}>
              <p>{user.username}</p>
              <button onClick={() => handleAddFriend(user.userId)}>Add Friend</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
