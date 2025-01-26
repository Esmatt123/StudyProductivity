import { gql, useQuery, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import fetch from 'cross-fetch'

const BACKEND_URL = "https://studyproductivityapp-backend.azurewebsites.net";
// Define the GraphQL endpoint
const GRAPHQL_ENDPOINT = `${BACKEND_URL}/graphql`; // Adjust to your actual endpoint

const link = new HttpLink({
  uri: GRAPHQL_ENDPOINT, // Replace with your actual GraphQL API endpoint
  fetch,                // Use cross-fetch for making requests
});

export const client = new ApolloClient({
  link,                 // Use the HttpLink with fetch
  cache: new InMemoryCache(),
});



// Define types for user login response

// Define a function for user login
export async function loginUser(email, password) {
  const query = `
      mutation {
        loginUser(input: {
          email: "${email}",
          password: "${password}"
        }) {
          token,
          userId
        }
      }
    `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    const { token, userId } = result.data.loginUser;

    // Store the token and userId in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);

    return { token, userId };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Function to fetch all documents
export async function getAllDocuments() {
  const query = `
    query {
      documents {
        id
        name
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token if required for auth
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    return result.data.documents;
  } catch (error) {
    console.error('Error fetching documents:', JSON.stringify(error, null, 2));
    throw error;
  }
}

// Function to delete a document
export async function deleteDocument(id, userId) {
  const query = `
    mutation DeleteDocument($id: String!, $userId: String!) {
      deleteDocument(id: $id, userId: $userId)
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token if required for auth
      },
      body: JSON.stringify({
        query,
        variables: { id, userId } // Pass both id and userId as variables
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    if (!result.data.deleteDocument) {
      throw new Error('Failed to delete document');
    }

    return true; // Indicate successful deletion
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}


// Function to update a document
export async function updateDocument(documentId, newName, userId) {
  const query = `
    mutation UpdateDocument($input: DocumentUpdateInput!) {
      updateDocument(input: $input) {
        id
        name
      }
    }
  `;
  console.log(GRAPHQL_ENDPOINT)

  const variables = {
    input: {
      id: documentId,
      name: newName,
      userId: userId
    },
  };

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token if required for auth
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    console.log("result", result)

    if (result.errors) {
      console.log("error occurs here")
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    return result.data.updateDocument;
  } catch (error) {
    console.error('Error updating document:', error.message);
    throw error;
  }
}

// Define the query to get accessible documents
export const GET_ACCESSIBLE_DOCUMENTS = gql`
  query GetAccessibleDocuments($userId: String!) {
    accessibleDocuments(userId: $userId) {
      id
      name
      shares {
        userId
        canRead
        canWrite
      }
    }
  }
`;

// Use Apollo Client's useQuery hook to get accessible documents
export function useAccessibleDocuments(userId) {
  try {
    const { loading, error, data } = useQuery(GET_ACCESSIBLE_DOCUMENTS, {
      variables: { userId },
    });
  
    return {
      loading,
      error,
      documents: data?.accessibleDocuments || [],
    };
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))
  }
  
}

// Function to create or find a document
export async function createOrFindDocument(documentId, documentName, ownerId) {
  const query = `
    mutation {
      createOrFindDocument(
        documentId: "${documentId}",
        documentName: "${documentName}",
        ownerId: "${ownerId}"
      ) {
        id
        name
        ownerId
        data
        canRead
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token if required for auth
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }
    console.log(result.data.createOrFindDocument)

    return result.data.createOrFindDocument;
  } catch (error) {
    console.error('Error creating or finding document:', error);
    throw error;
  }
}


export const GET_CAN_WRITE_PERMISSION = gql`
  query CanWritePermission($documentId: String!, $userId: String!) {
    canWritePermission(documentId: $documentId, userId: $userId)
  }
`;

// Function to fetch 'canWrite' permission
export async function fetchCanWritePermission(documentId, userId, apolloClient = client) {
  try {
    // Execute the query using Apollo Client
    const { data } = await apolloClient.query({
      query: GET_CAN_WRITE_PERMISSION,
      variables: { documentId, userId },
    });

    console.log(data)

    // Return the 'canWrite' value
    return data.canWritePermission;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
}

// Define the mutation
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($userId: String!, $bio: String!, $profilePicUrl: String!) {
    updateUserProfile(userId: $userId, bio: $bio, profilePicUrl: $profilePicUrl) {
      userId
      bio
      profileImageUrl
    }
  }
`;



// Function to update user profile
export async function updateUserProfile(userId, bio, profilePicUrl, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_USER_PROFILE,
      variables: { userId, bio, profilePicUrl },
    });

    return data.updateUserProfile; // Return the updated user profile
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Define the user profile query
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
     userProfile(userId: $userId) {
    bio
    profileImageUrl
    user {
      username
      email
      friends {
        friendUserId
        user {
          username 
          profileImageUrl
        }
        friendUser { 
          username 
          profileImageUrl
        }
      }
      createdEvents {
        meetupEventId
        title
        meetupDate
        description
      }
      joinedEvents {
        meetupEventId
        title
        meetupDate
        description
      }
    }
  }
  }
`;

// Create a function to fetch the user profile
export function useUserProfile(userId) {
  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { userId }, // Pass the userId as a variable

  });

  // Return the loading state, error, and user profile data
  return {
    loading,
    error,
    profile: data?.userProfile || null, // Return the user profile if available
    refetch
  };
}


export const CREATE_MEETUP_EVENT = gql`
  mutation CreateMeetup(
    $title: String!,
    $description: String!,
    $meetupDate: String!,
    $locationName: String!,
    $address: String!,
    $createdByUserId: String!,
    $latitude: Float!,
    $longitude: Float!
  ) {
    createMeetup(
      title: $title,
      description: $description,
      meetupDate: $meetupDate,
      locationName: $locationName,
      address: $address,
      latitude: $latitude,
      longitude: $longitude
      createdByUserId: $createdByUserId,
    ) {
      meetupEventId
      title
      description
      meetupDate
      locationName
      address
      createdByUserId
      latitude
      longitude
    }
  }
`;

// Function to create a meetup event
export async function createMeetupEvent(title, description, meetupDate, locationName, address, createdByUserId, latitude, longitude, apolloClient = client) {
  try {
    console.log('Creating meetup event:', { title, description, meetupDate, locationName, address, createdByUserId, latitude, longitude });

    // Call the mutate function of the Apollo client
    const { data } = await apolloClient.mutate({
      mutation: CREATE_MEETUP_EVENT,
      variables: {
        title,
        description,
        meetupDate,
        locationName,
        address,
        createdByUserId,
        latitude,
        longitude
      },
    });

    console.log(data)

    // Return the created meetup event
    return data.createMeetup;
  } catch (error) {
    console.error('Error creating meetup event:', JSON.stringify(error, null, 2));
    throw error; // Rethrow the error for further handling if needed
  }
}


// Define the GraphQL query to get all meetups for a user
export const GET_ALL_MEETUPS = gql`
  query AllMeetups($userId: String!) {
    allMeetups(userId: $userId) {
      meetupEventId
      title
      description
      meetupDate
      locationName
      address
      latitude
      longitude
      createdByUserId
      attendees{
      userId
      eventId
      username
      }
    }
  }
`;

// Function to fetch all meetups for a user
export async function getAllMeetupsAsync(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_MEETUPS,
      variables: { userId },
    });

    // Return the list of meetups
    console.log(data);
    return data.allMeetups;
  } catch (error) {
    console.error(error.message);
    throw error; // Rethrow the error for further handling if needed
  }
}

// Function to toggle attendance for a meetup event
export async function toggleAttendance(meetupEventId, userId) {
  const mutation = `
    mutation {
      toggleAttendance(meetupEventId: "${meetupEventId}", userId: "${userId}")
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token if required
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    return result.data.toggleAttendance; // Return the success message
  } catch (error) {
    console.error('Error toggling attendance for meetup:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}


// Define the mutation for deleting a meetup
export const DELETE_MEETUP = gql`
  mutation DeleteMeetup($meetupEventId: String!, $userId: String!) {
    deleteMeetup(meetupEventId: $meetupEventId, userId: $userId)
  }
`;

// Function to delete a meetup event
export async function deleteMeetup(meetupEventId, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_MEETUP,
      variables: {
        meetupEventId,
        userId,
      },
    });

    return data.deleteMeetup; // Return the result of deletion
  } catch (error) {
    console.error('Error deleting meetup:', JSON.stringify(error, null, 2));
    throw error; // Rethrow the error for further handling if needed
  }
}

// Define the mutation for updating a meetup
export const UPDATE_MEETUP = gql`
  mutation UpdateMeetup(
    $meetupEventId: String!,
    $title: String!,
    $description: String!,
    $meetupDate: DateTime!,  # Change this to DateTime!
    $latitude: Float!,
    $longitude: Float!,
    $locationName: String!,
    $address: String!,
    $createdByUserId: String!
  ) {
    updateMeetup(
      meetup: {
        meetupEventId: $meetupEventId,
        title: $title,
        description: $description,
        meetupDate: $meetupDate,
        latitude: $latitude,
        longitude: $longitude,
        locationName: $locationName,
        address: $address,
        createdByUserId: $createdByUserId
      }
    )
  }
`;



// Function to update a meetup event
export async function updateMeetupEvent(
  meetupEventId,
  title,
  description,
  meetupDate,
  latitude,
  longitude,
  locationName,
  address,
  createdByUserId,
  apolloClient = client // Default to the actual client
) {
  try {
    console.log("meetupeventid from graphql " + meetupEventId);
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_MEETUP,
      variables: {
        meetupEventId,
        title,
        description,
        meetupDate,
        latitude,
        longitude,
        locationName,
        address,
        createdByUserId,
      },
    });

    console.log(data);
    return data.updateMeetup;
  } catch (error) {
    console.error('Error updating meetup event:', JSON.stringify(error, null, 2));
    throw error;
  }
}



export const GET_USER_FRIENDS = gql`
  query GetUserFriends($userId: String!) {
    friends(userId: $userId) {
      friendUserId
      user {
        username
        profileImageUrl
      }
      friendUser {
        username
        profileImageUrl
      }
    }
  }
`;

// Implement the hook
export function useUserFriends(userId) {
  const { loading, error, data } = useQuery(GET_USER_FRIENDS, {
    variables: { userId },
  });

  return {
    loading,
    error,
    friends: data?.friends || [],
  };
}

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      userId
      username
    }
  }
`;

export async function searchUsers(searchTerm, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: SEARCH_USERS,
      variables: { searchTerm },
    });

    console.log('Search users result:', data.searchUsers);
    return data.searchUsers;
  } catch (error) {
    console.error('Error searching for users:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export const ADD_FRIEND = gql`
  mutation AddFriend($userId: String!, $friendUserId: String!) {
    addFriend(userId: $userId, friendUserId: $friendUserId){
    friendId
    userId
    friendUserId
    friendUser {
      username
      email
      profileImageUrl
    }
  }
  }
`;

export async function addFriend(userId, friendUserId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_FRIEND,
      variables: { userId, friendUserId },
    });

    console.log('Friend added successfully:', data.addFriend);
    return data.addFriend;
  } catch (error) {
    console.error('Error adding friend:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export const CREATE_GROUP_CHAT = gql`
  mutation CreateGroupChat($input: CreateGroupChatInput!) {
    createGroupChat(input: $input) {
    id
    groupName
    creatorId
    createdAt
    members {
      userId
      username
      }
    } 
  }
`;


export const createGroupChat = async (
  groupName,
  creatorId,
  initialFriends,
  apolloClient = client // Default to the actual client
) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_GROUP_CHAT,
      variables: {
        input: {
          groupName,
          creatorId,
          initialFriendIds: initialFriends.map((id) => ({ userId: id })), // Ensure the structure is correct
        },
      },
    });

    console.log('Group chat created successfully:', data.createGroupChat);
    return data.createGroupChat;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
};






export const GET_USER_GROUP_CHATS = gql`
  query GetUserGroupChats($userId: String!) {
    userGroupChats(userId: $userId) {
      id
      groupName
      creatorId
      createdAt
      members {
        userId
        user {
        username
        }
      }
      messages {
        messageId
        content
        userId
        sentAt
      }
    }
  }
`;

export async function fetchUserGroupChats(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_GROUP_CHATS,
      variables: { userId },
    });

    console.log('User group chats fetched successfully:', data.userGroupChats);
    return data.userGroupChats;
  } catch (error) {
    console.error('Error fetching user group chats:', JSON.stringify(error, null, 2));
    throw error;
  }
}
export const GET_CHAT_ROOMS_BY_USER_IDS = gql`
  query GetChatRoomsByUserIds($userId1: String!, $userId2: String!) {
    chatRoomsByUserIds(userId1: $userId1, userId2: $userId2) {
      chatRoomId
      isGroupChat
    }
  }
`;

export async function getChatRoomsByUserIds(userId1, userId2, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_CHAT_ROOMS_BY_USER_IDS,
      variables: { userId1, userId2 },
    });

    console.log('Chat rooms fetched successfully:', data.chatRoomsByUserIds);
    return data.chatRoomsByUserIds;
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw error;
  }
}

export const IS_GROUP_CHAT_QUERY = gql`
  query IsGroupChat($chatId: ID!) {
    isGroupChat(chatId: $chatId)
  }
`;

export async function isGroupChat(chatId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: IS_GROUP_CHAT_QUERY,
      variables: { chatId },
    });

    console.log(`Chat ID ${chatId} is group chat:`, data.isGroupChat);
    return data.isGroupChat;
  } catch (error) {
    console.error('Error checking if chat is group chat:', error);
    throw error;
  }
}

export const FETCH_MESSAGES_QUERY = `
query FetchMessages($chatId: String!, $offset: Int!, $limit: Int!) {
  messages(chatId: $chatId, offset: $offset, limit: $limit) {
    messageId
    content
    sentAt
    chatRoomId
    groupChatId
    user {
      userId
      username
    }
    isQueued
    isDelivered
    }
  }
`;

export async function fetchMessages(chatId, offset, limit, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: FETCH_MESSAGES_QUERY,
      variables: { chatId, offset, limit },
    });

    console.log(`Messages fetched successfully for chat ID ${chatId}:`, data.messages);
    return data.messages;
  } catch (error) {
    console.error('Error fetching messages:', JSON.stringify(error, null, 2));
    throw error;
  }
}

export const DELETE_GROUP_CHAT = gql`
  mutation deleteGroupChat($groupId: String!) {
    deleteGroupChat(groupId: $groupId)
  }
`;

export async function deleteGroupChat(groupId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_GROUP_CHAT,
      variables: { groupId },
    });

    console.log('Group chat deleted successfully:', data.deleteGroupChat);
    return data.deleteGroupChat;
  } catch (error) {
    console.error('Error deleting group chat:', error);
    throw error;
  }
}

// Mutation for deleting all messages in a chat
export const DELETE_ALL_MESSAGES = gql`
  mutation deleteAllMessages($chatId: String!, $isGroupChat: Boolean!) {
    deleteAllMessages(chatId: $chatId, isGroupChat: $isGroupChat)
  }
`;

export async function deleteAllMessages(chatId, isGroupChat, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_ALL_MESSAGES,
      variables: { chatId, isGroupChat },
    });

    console.log('All messages deleted successfully:', data.deleteAllMessages);
    return data.deleteAllMessages;
  } catch (error) {
    console.error('Error deleting all messages:', error);
    throw error;
  }
}

// Mutation for kicking members from a group chat
export const KICK_MEMBER_FROM_GROUP_CHAT = gql`
  mutation kickMembersFromGroupChat($groupId: String!, $memberId: String!, $requesterId: String!) {
    kickMembersFromGroupChat(groupId: $groupId, memberId: $memberId, requesterId: $requesterId)
  }
`;

export async function kickMembersFromGroupChat(
  groupId,
  memberId,
  requesterId,
  apolloClient = client
) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: KICK_MEMBER_FROM_GROUP_CHAT,
      variables: { groupId, memberId, requesterId },
    });

    console.log('Member kicked successfully:', data.kickMembersFromGroupChat);
    return data.kickMembersFromGroupChat;
  } catch (error) {
    console.error('Error kicking member from group chat:', error);
    throw error;
  }
}

export const ADD_FRIEND_TO_GROUP = gql`
  mutation addFriendToGroup($groupId: String!, $friendId: String!) {
    addFriendToGroup(groupId: $groupId, friendId: $friendId)
  }
`;

export async function addFriendToGroup(groupId, friendId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_FRIEND_TO_GROUP,
      variables: { groupId, friendId },
    });

    console.log('Friend added to group successfully:', data.addFriendToGroup);
    return data.addFriendToGroup;
  } catch (error) {
    console.error('Error adding friend to group:', error);
    throw error;
  }
}



// Queries
export const GET_FILES_BY_PARENT_FOLDER_ID = gql`
  query getFilesByParentFolderId($parentFolderId: Int!, $userId: String!) {
    getFilesByParentFolderId(parentFolderId: $parentFolderId, userId: $userId) {
      userFileId
      fileName
      filePath
      fileType
      uploadedByUserId
      folderId
      thumbnailPath
      sasUri
    }
  }
`;

export async function getFilesByParentFolderId(
  parentFolderId,
  userId,
  apolloClient = client
) {
  try {
    const { data } = await apolloClient.query({
      query: GET_FILES_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });

    console.log('Files fetched successfully:', data.getFilesByParentFolderId);
    return data.getFilesByParentFolderId;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export const GET_FOLDERS_BY_PARENT_FOLDER_ID = gql`
  query getFoldersByParentFolderId($parentFolderId: Int!, $userId: String!) {
    getFoldersByParentFolderId(parentFolderId: $parentFolderId, userId: $userId) {
      folderId
      name
      userId
      parentFolderId
      subFolders {
        folderId
        name
      }
      files {
        userFileId
        fileName
      }
    }
  }
`;

export async function getFoldersByParentFolderId(
  parentFolderId,
  userId,
  apolloClient = client
) {
  try {
    const { data } = await apolloClient.query({
      query: GET_FOLDERS_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });

    console.log('Folders fetched successfully:', data.getFoldersByParentFolderId);
    return data.getFoldersByParentFolderId;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
}

export const GET_ROOT_FILES_BY_USER_ID = gql`
  query getRootFilesByUserId($userId: String!) {
    getRootFilesByUserId(userId: $userId) {
      userFileId
      fileName
      filePath
      uploadedByUserId
      folderId
      fileType
      thumbnailPath
      sasUri
    }
  }
`;

export async function getRootFilesByUserId(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ROOT_FILES_BY_USER_ID,
      variables: { userId },
    });

    console.log('Root files fetched successfully:', data.getRootFilesByUserId);
    return data.getRootFilesByUserId;
  } catch (error) {
    console.error('Error fetching root files:', error);
    throw error;
  }
}

export const GET_ROOT_FOLDERS_BY_USER_ID = gql`
  query getRootFoldersByUserId($userId: String!) {
    getRootFoldersByUserId(userId: $userId) {
      folderId
      name
      userId
      folderId
      subFolders {
        folderId
        name
      }
      files {
        userFileId
        fileName
      }
    }
  }
`;

export async function getRootFoldersByUserId(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ROOT_FOLDERS_BY_USER_ID,
      variables: { userId },
    });

    console.log('Root folders fetched successfully:', data.getRootFoldersByUserId);
    return data.getRootFoldersByUserId;
  } catch (error) {
    console.error('Error fetching root folders:', error);
    throw error;
  }
}




export const DELETE_FILE_FOR_USER = gql`
  mutation DeleteFileForUser($fileId: Int!, $userId: String!, $deleteForEveryone: Boolean!) {
    deleteFileForUser(fileId: $fileId, userId: $userId, deleteForEveryone: $deleteForEveryone)
  }
`;

export async function deleteFileForUser(fileId, userId, deleteForEveryone, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_FILE_FOR_USER,
      variables: { fileId, userId, deleteForEveryone },
    });

    console.log('File deleted successfully for user:', data.deleteFileForUser);
    return data.deleteFileForUser;
  } catch (error) {
    console.error('Error deleting file for user:', error);
    throw error;
  }
}

export const CREATE_FOLDER = gql`
  mutation createFolder($name: String!, $userId: String!, $parentFolderId: Int) {
    createFolder(name: $name, userId: $userId, parentFolderId: $parentFolderId) {
      folderId
      name
    }
  }
`;

export async function createFolder(
  name,
  userId,
  parentFolderId = null,
  apolloClient = client
) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_FOLDER,
      variables: { name, userId, parentFolderId },
    });

    console.log('Folder created successfully:', data.createFolder);
    return data.createFolder;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

export const DELETE_FOLDER = gql`
  mutation deleteFolder($folderId: Int!) {
    deleteFolder(folderId: $folderId)
  }
`;

export async function deleteFolder(folderId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_FOLDER,
      variables: { folderId },
    });

    console.log('Folder deleted successfully:', data.deleteFolder);
    return data.deleteFolder;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
}

export const REMOVE_FILE_ACCESS = gql`
  mutation removeFileAccess($fileId: Int!, $userId: String!) {
    removeFileAccess(fileId: $fileId, userId: $userId)
  }
`;

export async function removeFileAccess(fileId, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_FILE_ACCESS,
      variables: { fileId, userId },
    });

    console.log('File access removed successfully:', data.removeFileAccess);
    return data.removeFileAccess;
  } catch (error) {
    console.error('Error removing file access:', error);
    throw error;
  }
}

export const RENAME_FOLDER = gql`
  mutation renameFolder($folderId: Int!, $newName: String!) {
    renameFolder(folderId: $folderId, newName: $newName)
  }
`;

export async function renameFolder(folderId, newName, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: RENAME_FOLDER,
      variables: { folderId, newName },
    });

    console.log('Folder renamed successfully:', data.renameFolder);
    return data.renameFolder;
  } catch (error) {
    console.error('Error renaming folder:', error);
    throw error;
  }
}

export const UPDATE_FILE = gql`
  mutation updateFile(
    $fileId: Int!
    $fileName: String
    $filePath: String
    $folderId: Int
    $fileType: String
  ) {
    updateFile(
      fileId: $fileId
      fileName: $fileName
      filePath: $filePath
      folderId: $folderId
      fileType: $fileType
    ) {
      id
      fileName
      filePath
      folderId
      fileType
    }
  }
`;

export async function updateFile(
  fileId,
  fileName = null,
  filePath = null,
  folderId = null,
  fileType = null,
  apolloClient = client
) {
  try {
    const variables = {
      fileId,
      ...(fileName !== null && { fileName }),
      ...(filePath !== null && { filePath }),
      ...(folderId !== null && { folderId }),
      ...(fileType !== null && { fileType }),
    };

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_FILE,
      variables,
    });

    console.log('File updated successfully:', data.updateFile);
    return data.updateFile;
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}

export const GET_FILE_BY_USER_ID = gql`
  query getFileByUserId($fileId: Int!, $userId: String!) {
    getFileByUserId(fileId: $fileId, userId: $userId) {
      id
      fileName
      filePath
      fileSize
      fileType
      uploadDate
      uploadedByUserId
      folderId
    }
  }
`;

export async function getFileByUserId(fileId, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_FILE_BY_USER_ID,
      variables: { fileId, userId },
    });

    console.log('File fetched successfully:', data.getFileByUserId);
    return data.getFileByUserId;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}

export const SHARE_FILE_ACCESS = gql`
  mutation ShareFileAccess(
    $userFileId: Int!
    $sharedWithUserId: String!
    $sharedByUserId: String!
  ) {
    shareFileAccess(
      userFileId: $userFileId
      sharedWithUserId: $sharedWithUserId
      sharedByUserId: $sharedByUserId
    ) {
      userFileId
      sharedWithUserId
      userFile {
        userFileId
        fileName
        filePath
        fileType
        thumbnailPath
        sasUri
      }
      sharedWithUser {
        userId
        username
      }
    }
  }
`;

export async function shareFileAccess(
  userFileId,
  sharedWithUserId,
  sharedByUserId,
  apolloClient = client
) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SHARE_FILE_ACCESS,
      variables: { userFileId, sharedWithUserId, sharedByUserId },
    });

    console.log('File access shared successfully:', data.shareFileAccess);
    return data.shareFileAccess;
  } catch (error) {
    console.error('Error sharing file access:', error);
    throw error;
  }
}

export const GET_FILE_ACCESS_BY_USER = gql`
  query GetFileAccessByUser($userId: String!) {
    getFileAccessByUser(userId: $userId) {
      userFileId
      sharedWithUser {
        username
      }
      sharedByUser {
        username
      }
      userFile {
        userFileId
        filePath
        fileType
        fileName
        thumbnailPath
        uploadedByUserId
        sasUri
      }
    }
  }
`;

export async function getFileAccessByUser(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_FILE_ACCESS_BY_USER,
      variables: { userId },
    });

    console.log('File access fetched successfully:', data.getFileAccessByUser);
    return data.getFileAccessByUser;
  } catch (error) {
    console.error('Error fetching file access:', error);
    throw error;
  }
}

export const ADD_QUIZ = gql`
  mutation AddQuiz($title: String!, $userId: String!, $questions: [QuestionInput!]!) {
    addQuiz(title: $title, userId: $userId, questions: $questions) {
      id
      title
      userId
      questions {
        id
        text
        answerOptions {
          id
          text
          isCorrect
        }
      }
    }
  }
`;

export async function addQuiz(title, userId, questions, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_QUIZ,
      variables: { title, userId, questions },
    });

    console.log('Quiz added successfully:', data.addQuiz);
    return data.addQuiz;
  } catch (error) {
    console.error('Error adding quiz:', error);
    throw error;
  }
}

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: Int!, $userId: String!) {
    deleteQuiz(id: $id, userId: $userId)
  }
`;

export async function deleteQuiz(id, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_QUIZ,
      variables: { id, userId },
    });

    console.log('Quiz deleted successfully:', data.deleteQuiz);
    return data.deleteQuiz;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
}

export const GET_QUIZZES = gql`
  query GetAllQuizzesByUserId($userId: String!) {
    getAllQuizzesByUserId(userId: $userId) {
      id
      title
      userId
      questions {
        id
        text
        answerOptions {
          id
          text
          isCorrect
        }
      }
    }
  }
`;

export async function getAllQuizzesByUserId(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_QUIZZES,
      variables: { userId },
    });

    console.log('Quizzes fetched successfully:', data.getAllQuizzesByUserId);
    return data.getAllQuizzesByUserId;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
}

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($id: Int!, $userId: String!, $selectedAnswerIds: [Int!]!) {
    submitQuiz(id: $id, userId: $userId, selectedAnswerIds: $selectedAnswerIds)
  }
`;

export async function submitQuiz(id, userId, selectedAnswerIds, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SUBMIT_QUIZ,
      variables: { id, userId, selectedAnswerIds },
    });

    console.log('Quiz submitted successfully:', data.submitQuiz);
    return data.submitQuiz;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
}

export const UPDATE_QUIZ = gql`
  mutation UpdateQuiz($id: Int!, $title: String!, $userId: String!, $questions: [UpdateQuestionInput!]!) {
    updateQuiz(id: $id, title: $title, userId: $userId, questions: $questions) {
      id
      title
      userId
      questions {
        id
        text
        answerOptions {
          id
          text
          isCorrect
        }
      }
    }
  }
`;

export async function updateQuiz(id, title, userId, questions, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_QUIZ,
      variables: { id, title, userId, questions },
    });

    console.log('Quiz updated successfully:', data.updateQuiz);
    return data.updateQuiz;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
}

export const GET_ALL_CONCEPTS = gql`
  query GetAllConcepts($userId: String!, $conceptListId: Int) {
    getAllConcepts(userId: $userId, conceptListId: $conceptListId) {
      id
      title
      description
      userId
      conceptListId
    }
  }
`;

export async function getAllConcepts(userId, conceptListId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_CONCEPTS,
      variables: { userId, conceptListId },
    });

    console.log('Fetched concepts:', data.getAllConcepts);
    return data.getAllConcepts;
  } catch (error) {
    console.error('Error fetching concepts:', error);
    throw error;
  }
}

export const GET_CONCEPT_BY_ID = gql`
  query GetConceptById($id: Int!, $userId: String!) {
    getConceptById(id: $id, userId: $userId) {
      id
      title
      description
      userId
      conceptListId
    }
  }
`;

export async function getConceptById(id, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_CONCEPT_BY_ID,
      variables: { id, userId },
    });

    console.log('Fetched concept:', data.getConceptById);
    return data.getConceptById;
  } catch (error) {
    console.error('Error fetching concept:', error);
    throw error;
  }
}

export const GET_ALL_CONCEPT_LISTS = gql`
  query GetAllConceptLists($userId: String!) {
    getAllConceptLists(userId: $userId) {
      id
      title
      userId
      concepts {
        id
        title
        description
      }
    }
  }
`;

export async function getAllConceptLists(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_CONCEPT_LISTS,
      variables: { userId },
    });

    console.log('Fetched concept lists:', data.getAllConceptLists);
    return data.getAllConceptLists;
  } catch (error) {
    console.error('Error fetching concept lists:', error);
    throw error;
  }
}

export const GET_CONCEPT_LIST_BY_ID = gql`
  query GetConceptListById($id: Int!, $userId: String!) {
    getConceptListById(id: $id, userId: $userId) {
      id
      title
      userId
      concepts {
        id
        title
        description
      }
    }
  }
`;

export async function getConceptListById(id, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_CONCEPT_LIST_BY_ID,
      variables: { id, userId },
    });

    console.log('Fetched concept list:', data.getConceptListById);
    return data.getConceptListById;
  } catch (error) {
    console.error('Error fetching concept list:', error);
    throw error;
  }
}

export const ADD_CONCEPT = gql`
  mutation AddConcept($conceptInput: ConceptInput!) {
    addConcept(conceptInput: $conceptInput) {
      id
      title
      description
      userId
      conceptListId
    }
  }
`;

export async function addConcept(conceptInput, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_CONCEPT,
      variables: { conceptInput },
    });

    console.log('Concept added successfully:', data.addConcept);
    return data.addConcept;
  } catch (error) {
    console.error('Error adding concept:', error);
    throw error;
  }
}

export const UPDATE_CONCEPT = gql`
  mutation UpdateConcept($conceptInput: UpdateConceptInput!) {
    updateConcept(conceptInput: $conceptInput) {
      id
      title
      description
      userId
      conceptListId
    }
  }
`;

export async function updateConcept(conceptInput, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CONCEPT,
      variables: { conceptInput },
    });

    console.log('Concept updated successfully:', data.updateConcept);
    return data.updateConcept;
  } catch (error) {
    console.error('Error updating concept:', error);
    throw error;
  }
}

export const DELETE_CONCEPT = gql`
  mutation DeleteConcept($id: Int!, $userId: String!) {
    deleteConcept(id: $id, userId: $userId)
  }
`;

export async function deleteConcept(id, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_CONCEPT,
      variables: { id, userId },
    });

    console.log('Concept deleted successfully:', data.deleteConcept);
    return data.deleteConcept; // Assuming it returns a boolean or some confirmation message
  } catch (error) {
    console.error('Error deleting concept:', error);
    throw error;
  }
}

export const ADD_CONCEPT_LIST = gql`
  mutation AddConceptList($conceptListInput: ConceptListInput!) {
    addConceptList(conceptListInput: $conceptListInput) {
      id
      title
      userId
    }
  }
`;

export async function addConceptList(conceptListInput, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_CONCEPT_LIST,
      variables: { conceptListInput },
    });

    console.log('Concept list added successfully:', data.addConceptList);
    return data.addConceptList;
  } catch (error) {
    console.error('Error adding concept list:', error);
    throw error;
  }
}

export const UPDATE_CONCEPT_LIST = gql`
  mutation UpdateConceptList($conceptListInput: UpdateConceptListInput!) {
    updateConceptList(conceptListInput: $conceptListInput) {
      id
      title
      userId
    }
  }
`;

export async function updateConceptList(conceptListInput, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_CONCEPT_LIST,
      variables: { conceptListInput },
    });

    console.log('Concept list updated successfully:', data.updateConceptList);
    return data.updateConceptList;
  } catch (error) {
    console.error('Error updating concept list:', error);
    throw error;
  }
}

export const DELETE_CONCEPT_LIST = gql`
  mutation DeleteConceptList($id: Int!, $userId: String!) {
    deleteConceptList(id: $id, userId: $userId)
  }
`;

export async function deleteConceptList(id, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_CONCEPT_LIST,
      variables: { id, userId },
    });

    console.log('Concept list deleted successfully:', data.deleteConceptList);
    return data.deleteConceptList; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error deleting concept list:', error);
    throw error;
  }
}

// SelfTest Mutations
export const CREATE_SELF_TEST = gql`
  mutation CreateSelfTest($input: CreateSelfTestInput!) {
    createSelfTest(input: $input) {
      id
      title
      userId
    }
  }
`;

export async function createSelfTest(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_SELF_TEST,
      variables: { input },
    });

    console.log('Self-test created successfully:', data.createSelfTest);
    return data.createSelfTest;
  } catch (error) {
    console.error('Error creating self-test:', error);
    throw error;
  }
}

// In your GraphQL mutations file
export const UPDATE_SELF_TEST = gql`
  mutation UpdateSelfTest($id: String!, $title: String!) {
    updateSelfTest(id: $id, title: $title) {
      id
      title
    }
  }
`;

export async function updateSelfTest(id, title, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SELF_TEST,
      variables: { id, title },
    });

    console.log('Self-test updated successfully:', data.updateSelfTest);
    return data.updateSelfTest;
  } catch (error) {
    console.error('Error updating self-test:', error);
    throw error;
  }
}

export const DELETE_SELF_TEST = gql`
  mutation DeleteSelfTest($selfTestId: String!) {
    deleteSelfTest(selfTestId: $selfTestId)
  }
`;

export async function deleteSelfTest(selfTestId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_SELF_TEST,
      variables: { selfTestId },
    });

    console.log('Self-test deleted successfully:', data.deleteSelfTest);
    return data.deleteSelfTest; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error deleting self-test:', error);
    throw error;
  }
}

// SelfTest Queries
export const GET_ALL_SELF_TESTS_BY_USER = gql`
  query GetAllSelfTestsByUserId($userId: String!) {
    getAllSelfTestsByUserId(userId: $userId) {
      id
      title
      userId
      selfTestQuestions {
        id
        text
        correctAnswer
      }
    }
  }
`;

export async function getAllSelfTestsByUserId(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_SELF_TESTS_BY_USER,
      variables: { userId },
    });

    console.log('Fetched self-tests:', data.getAllSelfTestsByUserId);
    return data.getAllSelfTestsByUserId;
  } catch (error) {
    console.error('Error fetching self-tests:', error);
    throw error;
  }
}


export const GET_ALL_SELF_TEST_QUESTIONS_BY_USER = gql`
  query GetAllSelfTestQuestionsByUserId($userId: String!) {
    getAllSelfTestQuestionsByUserId(userId: $userId) {
      id
      selfTestId
      text
      correctAnswer
      userId
    }
  }
`;

export async function getAllSelfTestQuestionsByUser(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_ALL_SELF_TEST_QUESTIONS_BY_USER,
      variables: { userId },
    });

    console.log('Fetched self-test questions:', data.getAllSelfTestQuestionsByUserId);
    return data.getAllSelfTestQuestionsByUserId;
  } catch (error) {
    console.error('Error fetching self-test questions:', error);
    throw error;
  }
}

// SelfTestQuestion Mutations
export const CREATE_SELF_TEST_QUESTION = gql`
  mutation CreateSelfTestQuestion(
    $selfTestId: String!
    $text: String!
    $correctAnswer: String!
    $userId: String!
  ) {
    createSelfTestQuestion(
      selfTestId: $selfTestId
      text: $text
      correctAnswer: $correctAnswer
      userId: $userId
    ) {
      id
      text
      correctAnswer
      selfTestId
    }
  }
`;

export async function createSelfTestQuestion(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_SELF_TEST_QUESTION,
      variables: input,
    });

    console.log('Self-test question created successfully:', data.createSelfTestQuestion);
    return data.createSelfTestQuestion;
  } catch (error) {
    console.error('Error creating self-test question:', error);
    throw error;
  }
}

export const UPDATE_SELF_TEST_QUESTION = gql`
  mutation UpdateSelfTestQuestion(
    $id: String!
    $selfTestId: String!
    $text: String!
    $correctAnswer: String!
    $userId: String!
  ) {
    updateSelfTestQuestion(
      id: $id
      selfTestId: $selfTestId
      text: $text
      correctAnswer: $correctAnswer
      userId: $userId
    ) {
      id
      text
      correctAnswer
      selfTestId
    }
  }
`;

export async function updateSelfTestQuestion(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_SELF_TEST_QUESTION,
      variables: input,
    });

    console.log('Self-test question updated successfully:', data.updateSelfTestQuestion);
    return data.updateSelfTestQuestion;
  } catch (error) {
    console.error('Error updating self-test question:', error);
    throw error;
  }
}

export const DELETE_SELF_TEST_QUESTION = gql`
  mutation DeleteSelfTestQuestion($questionId: String!) {
    deleteSelfTestQuestion(questionId: $questionId)
  }
`;

export async function deleteSelfTestQuestion(questionId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_SELF_TEST_QUESTION,
      variables: { questionId },
    });

    console.log('Self-test question deleted successfully:', data.deleteSelfTestQuestion);
    return data.deleteSelfTestQuestion; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error deleting self-test question:', error);
    throw error;
  }
}

export const ADD_LIST_MUTATION = gql`
  mutation AddList($input: AddTodoTaskListInput!) {
    addList(input: $input) {
      todoTaskListId
      name
      position
      userId
    }
  }
`;

export async function addTodoTaskList(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_LIST_MUTATION,
      variables: { input },
    });

    console.log('Todo task list added successfully:', data.addList);
    return data.addList;
  } catch (error) {
    console.error('Error adding todo task list:', error);
    throw error;
  }
}

export const ADD_TASK_MUTATION = gql`
  mutation AddTask($input: AddTodoTaskInput!) {
    addTask(input: $input) {
      todoTaskId
      title
      description
      isCompleted
      dueDate
      position
      todoTaskListId
      userId
    }
  }
`;

export async function addTodoTask(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_TASK_MUTATION,
      variables: { input },
    });

    console.log('Todo task added successfully:', data.addTask);
    return data.addTask;
  } catch (error) {
    console.error('Error adding todo task:', error);
    throw error;
  }
}

export const DELETE_LIST_MUTATION = gql`
  mutation DeleteList($todoTaskListId: Int!, $userId: String!) {
    deleteList(todoTaskListId: $todoTaskListId, userId: $userId)
  }
`;

export async function deleteTodoTaskList(todoTaskListId, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_LIST_MUTATION,
      variables: { todoTaskListId, userId },
    });

    console.log('Todo task list deleted successfully:', data.deleteList);
    return data.deleteList; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error deleting todo task list:', error);
    throw error;
  }
}

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($todoTaskId: Int!, $userId: String!) {
    deleteTask(todoTaskId: $todoTaskId, userId: $userId)
  }
`;

export async function deleteTodoTask(todoTaskId, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_TASK_MUTATION,
      variables: { todoTaskId, userId },
    });

    console.log('Todo task deleted successfully:', data.deleteTask);
    return data.deleteTask; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error deleting todo task:', error);
    throw error;
  }
}

export const MOVE_TASK_MUTATION = gql`
  mutation MoveTask(
    $todoTaskId: Int!
    $targetListId: Int!
    $newPosition: Int!
    $userId: String!
  ) {
    moveTask(
      todoTaskId: $todoTaskId
      targetListId: $targetListId
      newPosition: $newPosition
      userId: $userId
    )
  }
`;

export async function moveTodoTask(todoTaskId, targetListId, newPosition, userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: MOVE_TASK_MUTATION,
      variables: {
        todoTaskId,
        targetListId,
        newPosition,
        userId,
      },
    });

    console.log('Todo task moved successfully:', data.moveTask);
    return data.moveTask; // Assuming it returns a boolean or confirmation message
  } catch (error) {
    console.error('Error moving todo task:', error);
    throw error;
  }
}

export const UPDATE_LIST_MUTATION = gql`
  mutation UpdateList($input: UpdateTodoTaskListInput!) {
    updateList(input: $input) {
      todoTaskListId
      name
      position
    }
  }
`;

export async function updateTodoTaskList(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_LIST_MUTATION,
      variables: { input },
    });

    console.log('Todo task list updated successfully:', data.updateList);
    return data.updateList;
  } catch (error) {
    console.error('Error updating todo task list:', error);
    throw error;
  }
}

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateTodoTaskInput!) {
    updateTask(input: $input) {
      todoTaskId
      title
      description
      isCompleted
      dueDate
      position
    }
  }
`;

export async function updateTodoTask(input, apolloClient = client) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_TASK_MUTATION,
      variables: { input },
    });

    console.log('Todo task updated successfully:', data.updateTask);
    return data.updateTask;
  } catch (error) {
    console.error('Error updating todo task:', error);
    throw error;
  }
}

export const GET_LISTS_BY_USER_ID = gql`
  query GetListsByUserId($userId: String!) {
    getListsByUserId(userId: $userId) {
      todoTaskListId
      name
      position
      userId
      todoTasks {
        todoTaskId
        title
        description
        isCompleted
        dueDate
        position
        todoTaskListId
      }
    }
  }
`;

export async function getListsByUserId(userId, apolloClient = client) {
  try {
    const { data } = await apolloClient.query({
      query: GET_LISTS_BY_USER_ID,
      variables: { userId },
    });

    console.log('Fetched lists by user ID:', data.getListsByUserId);
    return data.getListsByUserId;
  } catch (error) {
    console.error('Error fetching lists by user ID:', error);
    throw error;
  }
}

