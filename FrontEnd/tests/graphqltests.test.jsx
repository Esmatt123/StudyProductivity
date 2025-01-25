// loginUser.test.js

import {
  loginUser, getAllDocuments, deleteDocument,
  updateDocument, useAccessibleDocuments,
  GET_ACCESSIBLE_DOCUMENTS, createOrFindDocument,
  fetchCanWritePermission, GET_CAN_WRITE_PERMISSION,
  useUserProfile, GET_USER_PROFILE,
  createMeetupEvent, CREATE_MEETUP_EVENT,
  getAllMeetupsAsync, GET_ALL_MEETUPS,
  toggleAttendance, deleteMeetup, DELETE_MEETUP,
  updateMeetupEvent, UPDATE_MEETUP,
  GET_USER_FRIENDS, useUserFriends,
  searchUsers, SEARCH_USERS, addFriend,
  ADD_FRIEND, createGroupChat, CREATE_GROUP_CHAT,
  fetchUserGroupChats, GET_USER_GROUP_CHATS,
  getChatRoomsByUserIds, GET_CHAT_ROOMS_BY_USER_IDS,
  isGroupChat, IS_GROUP_CHAT_QUERY,
  fetchMessages, FETCH_MESSAGES_QUERY,
  deleteGroupChat, DELETE_GROUP_CHAT,
  deleteAllMessages, DELETE_ALL_MESSAGES,
  kickMembersFromGroupChat, KICK_MEMBER_FROM_GROUP_CHAT,
  getFilesByParentFolderId,GET_FILES_BY_PARENT_FOLDER_ID,
  addFriendToGroup, ADD_FRIEND_TO_GROUP,
  getFoldersByParentFolderId, GET_FOLDERS_BY_PARENT_FOLDER_ID,
  addFile, ADD_FILE,
  getRootFoldersByUserId, GET_ROOT_FOLDERS_BY_USER_ID,
  getRootFilesByUserId, GET_ROOT_FILES_BY_USER_ID,
  deleteFileForUser, DELETE_FILE_FOR_USER,
  createFolder, CREATE_FOLDER,
  deleteFolder, DELETE_FOLDER,
  removeFileAccess, REMOVE_FILE_ACCESS,
  renameFolder, RENAME_FOLDER,
  updateFile, UPDATE_FILE,
  getFileByUserId, GET_FILE_BY_USER_ID,
  shareFileAccess, SHARE_FILE_ACCESS,
  getFileAccessByUser, GET_FILE_ACCESS_BY_USER,
  addQuiz, ADD_QUIZ,
  deleteQuiz, DELETE_QUIZ,
  getAllQuizzesByUserId, GET_QUIZZES,
  submitQuiz, SUBMIT_QUIZ,
  updateQuiz, UPDATE_QUIZ,
  getAllConcepts, GET_ALL_CONCEPTS,
  getConceptById, GET_CONCEPT_BY_ID,
  getConceptListById, GET_CONCEPT_LIST_BY_ID,
  getAllConceptLists, GET_ALL_CONCEPT_LISTS,
  addConcept, ADD_CONCEPT,
  addConceptList, ADD_CONCEPT_LIST,
  deleteConcept, DELETE_CONCEPT,
  updateConcept, UPDATE_CONCEPT,
  createSelfTest, CREATE_SELF_TEST,
  deleteConceptList, DELETE_CONCEPT_LIST,
  updateConceptList, UPDATE_CONCEPT_LIST,
  getAllSelfTestsByUserId, GET_ALL_SELF_TESTS_BY_USER,
  deleteSelfTest, DELETE_SELF_TEST,
  updateSelfTest, UPDATE_SELF_TEST,
  updateSelfTestQuestion, UPDATE_SELF_TEST_QUESTION,
  createSelfTestQuestion, CREATE_SELF_TEST_QUESTION,
  getAllSelfTestQuestionsByUser, GET_ALL_SELF_TEST_QUESTIONS_BY_USER,
  addTodoTask, ADD_TASK_MUTATION,
  getListsByUserId, GET_LISTS_BY_USER_ID,
  updateTodoTask, UPDATE_TASK_MUTATION,
  updateTodoTaskList, UPDATE_LIST_MUTATION,
  moveTodoTask, deleteTodoTaskList,
  addTodoTaskList, deleteSelfTestQuestion,
  MOVE_TASK_MUTATION, DELETE_LIST_MUTATION,
  ADD_LIST_MUTATION, DELETE_SELF_TEST_QUESTION,
  updateUserProfile, UPDATE_USER_PROFILE
} from '../src/api/graphql'; // Adjust the import path
import fetch from 'cross-fetch';
import { waitFor, renderHook } from '@testing-library/react';
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { MockLink } from '@apollo/client/testing';
import { ApolloClient, InMemoryCache } from '@apollo/client';




const GRAPHQL_ENDPOINT = "http://backend:5193/graphql";

// Create a mock client with MockLink
function createMockClient(mocks) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new MockLink(mocks),
  });
}

// Mocks localStorage
import 'jest-localstorage-mock';

describe('fetchCanWritePermission', () => {
  it('should fetch canWritePermission successfully', async () => {
    // Arrange
    const documentId = 'doc123';
    const userId = 'user123';

    const mockData = {
      canWritePermission: true,
    };

    // Define the mock response
    const mocks = [
      {
        request: {
          query: GET_CAN_WRITE_PERMISSION,
          variables: { documentId, userId },
        },
        result: { data: mockData },
      },
    ];

    // Create a mock client
    const mockClient = createMockClient(mocks);

    // Act
    const result = await fetchCanWritePermission(documentId, userId, mockClient);

    // Assert
    expect(result).toBe(true);
  });
});







function normalizeQuery(query) {
  return query.replace(/\s+/g, ' ').trim();
}



jest.mock('../src/api/graphql', () => {
  const originalModule = jest.requireActual('../src/api/graphql');

  // Mock the client instance
  const clientMock = {
    query: jest.fn(),
    mutate: jest.fn(),
    // Mock other methods if needed
  };

  return {
    ...originalModule,
    client: clientMock, // Replace the 'client' export with our mock
  };
});

// Re-import the mocked client
const { client } = require('../src/api/graphql'); // Re-import after mocking


jest.mock('cross-fetch', () => jest.fn());

// Suppress console.error outputs during testing (optional)
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
  console.error.mockRestore();
});

describe('loginUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
    delete global.fetch;
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should log in the user and store token and userId in localStorage', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const mockResponse = {
      data: {
        loginUser: {
          token: 'mockToken123',
          userId: 'user123',
        },
      },
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await loginUser(email, password);

    expect(result).toEqual({
      token: 'mockToken123',
      userId: 'user123',
    });

    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken123');
    expect(localStorage.setItem).toHaveBeenCalledWith('userId', 'user123');
  });

  it('should throw an error if login fails', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';

    const mockErrorResponse = {
      errors: [{ message: 'Invalid credentials' }],
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockErrorResponse,
    });

    await expect(loginUser(email, password)).rejects.toThrow('Invalid credentials');

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});

describe('getAllDocuments', () => {
  afterEach(() => {
    fetch.mockClear();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should retrieve all documents successfully', async () => {
    // Arrange
    const mockDocuments = [
      { id: 'doc1', name: 'Document 1' },
      { id: 'doc2', name: 'Document 2' },
    ];

    const mockResponse = {
      data: {
        documents: mockDocuments,
      },
    };

    // Set a mock token in localStorage
    localStorage.setItem('token', 'mockToken123');

    // Mock fetch to return the mockResponse
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await getAllDocuments();

    // Assert
    expect(result).toEqual(mockDocuments);

    // Access fetch call arguments
    const [url, options] = fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe(GRAPHQL_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mockToken123',
    });

    // Normalize and compare the query strings
    expect(normalizeQuery(body.query)).toBe(normalizeQuery(`
      query {
        documents {
          id
          name
        }
      }
    `));
  });




  describe('deleteDocument', () => {
    afterEach(() => {
      fetch.mockClear();
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should delete the document successfully', async () => {
      // Arrange
      const id = 'doc123';
      const userId = 'user123';

      const mockResponse = {
        data: {
          deleteDocument: true,
        },
      };

      // Set a mock token in localStorage
      localStorage.setItem('token', 'mockToken123');

      // Mock fetch to return the mockResponse
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await deleteDocument(id, userId);

      // Assert
      expect(result).toBe(true);

      // Access fetch call arguments
      const [url, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);

      expect(url).toBe(GRAPHQL_ENDPOINT);
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mockToken123',
      });

      // Normalize and compare the query strings
      expect(normalizeQuery(body.query)).toBe(normalizeQuery(`
        mutation DeleteDocument($id: String!, $userId: String!) {
          deleteDocument(id: $id, userId: $userId)
        }
      `));

      expect(body.variables).toEqual({ id, userId });
    });
  });

  describe('updateDocument', () => {
    afterEach(() => {
      fetch.mockClear();
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('should update the document successfully', async () => {
      // Arrange
      const documentId = 'doc123';
      const newName = 'Updated Document Name';

      const mockResponse = {
        data: {
          updateDocument: {
            id: documentId,
            name: newName,
          },
        },
      };

      localStorage.setItem('token', 'mockToken123');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Act
      const result = await updateDocument(documentId, newName);

      // Assert
      expect(result).toEqual({
        id: documentId,
        name: newName,
      });

      const [url, options] = fetch.mock.calls[0];
      const body = JSON.parse(options.body);

      expect(url).toBe(GRAPHQL_ENDPOINT);
      expect(options.method).toBe('POST');
      expect(options.headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mockToken123',
      });

      expect(normalizeQuery(body.query)).toBe(
        normalizeQuery(`
          mutation UpdateDocument($input: DocumentUpdateInput!) {
            updateDocument(input: $input) {
              id
              name
            }
          }
        `)
      );

      expect(body.variables).toEqual({
        input: {
          id: documentId,
          name: newName,
        },
      });
    });

    it('should throw an error if the server returns errors', async () => {
      // Arrange
      const documentId = 'doc123';
      const newName = 'Updated Document Name';

      const mockErrorResponse = {
        errors: [{ message: 'Unauthorized access' }],
      };

      localStorage.setItem('token', 'invalidToken');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockErrorResponse,
      });

      // Act & Assert
      await expect(updateDocument(documentId, newName)).rejects.toThrow('Unauthorized access');
    });

    it('should throw an error if a network error occurs', async () => {
      // Arrange
      const documentId = 'doc123';
      const newName = 'Updated Document Name';

      localStorage.setItem('token', 'mockToken123');

      fetch.mockRejectedValueOnce(new Error('Network Error'));

      // Act & Assert
      await expect(updateDocument(documentId, newName)).rejects.toThrow('Network Error');
    });
  });



});

describe('useAccessibleDocuments', () => {
  it('should return loading initially', async () => {
    const userId = 'user123';

    const mocks = [];

    const { result } = renderHook(
      () => useAccessibleDocuments(userId),
      {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      }
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.documents).toEqual([]);

    // Wait for any state updates (there shouldn't be any since we have no mocks)
    await waitFor({ timeout: 100 }).catch(() => { });
  });

  it('should return documents when the query succeeds', async () => {
    const userId = 'user123';

    const documents = [
      {
        id: 'doc1',
        name: 'Document 1',
        shares: [
          {
            userId: 'user123',
            canRead: true,
            canWrite: false,
          },
        ],
      },
      {
        id: 'doc2',
        name: 'Document 2',
        shares: [
          {
            userId: 'user123',
            canRead: true,
            canWrite: true,
          },
        ],
      },
    ];

    const mocks = [
      {
        request: {
          query: GET_ACCESSIBLE_DOCUMENTS,
          variables: { userId },
        },
        result: {
          data: {
            accessibleDocuments: documents,
          },
        },
      },
    ];

    const { result } = renderHook(
      () => useAccessibleDocuments(userId),
      {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks} addTypename={false}>
            {children}
          </MockedProvider>
        ),
      }
    );

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.documents).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    // After the query resolves
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.documents).toEqual(documents);
  });

  it('should return an error when the query fails', async () => {
    const userId = 'user123';

    const mocks = [
      {
        request: {
          query: GET_ACCESSIBLE_DOCUMENTS,
          variables: { userId },
        },
        error: new Error('An error occurred'),
      },
    ];

    const { result } = renderHook(
      () => useAccessibleDocuments(userId),
      {
        wrapper: ({ children }) => (
          <MockedProvider mocks={mocks}>{children}</MockedProvider>
        ),
      }
    );

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.documents).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));

    // After the query fails
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
    expect(result.current.documents).toEqual([]);
  });
});


describe('createOrFindDocument', () => {
  afterEach(() => {
    fetch.mockClear();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should create or find the document successfully', async () => {
    // Arrange
    const documentId = 'doc123';
    const documentName = 'New Document';
    const ownerId = 'user123';

    const mockResponse = {
      data: {
        createOrFindDocument: {
          id: documentId,
          name: documentName,
          ownerId: ownerId,
          data: 'Some document data',
        },
      },
    };

    localStorage.setItem('token', 'mockToken123');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Act
    const result = await createOrFindDocument(documentId, documentName, ownerId);

    // Assert
    expect(result).toEqual({
      id: documentId,
      name: documentName,
      ownerId: ownerId,
      data: 'Some document data',
    });

    const [url, options] = fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe(GRAPHQL_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(options.headers).toEqual({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mockToken123',
    });

    expect(normalizeQuery(body.query)).toBe(
      normalizeQuery(`
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
      `)
    );

    expect(body.variables).toBeUndefined(); // No variables are used in this query
  });

  it('should throw an error if the server returns errors', async () => {
    // Arrange
    const documentId = 'doc123';
    const documentName = 'New Document';
    const ownerId = 'user123';

    const mockErrorResponse = {
      errors: [{ message: 'Document not found' }],
    };

    localStorage.setItem('token', 'mockToken123');

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockErrorResponse,
    });

    // Act & Assert
    await expect(
      createOrFindDocument(documentId, documentName, ownerId)
    ).rejects.toThrow('Document not found');
  });

  it('should throw an error if a network error occurs', async () => {
    // Arrange
    const documentId = 'doc123';
    const documentName = 'New Document';
    const ownerId = 'user123';

    localStorage.setItem('token', 'mockToken123');

    fetch.mockRejectedValueOnce(new Error('Network Error'));

    // Act & Assert
    await expect(
      createOrFindDocument(documentId, documentName, ownerId)
    ).rejects.toThrow('Network Error');
  });


});


describe('useUserProfile', () => {
  const userId = 'user-123';

  // Mock data to return from the query
  const mockUserProfileData = {
    userProfile: {
      bio: 'This is my bio',
      profileImageUrl: 'http://example.com/profile.jpg',
      user: {
        username: 'testuser',
        email: 'testuser@example.com',
        friends: [
          {
            friendUserId: 'friend-1',
            user: {
              username: 'frienduser1',
              profileImageUrl: 'http://example.com/frienduser1.jpg',
            },
            friendUser: {
              username: 'frienduser2',
              profileImageUrl: 'http://example.com/frienduser2.jpg',
            },
          },
        ],
        createdEvents: [
          {
            meetupEventId: 'event-1',
            title: 'Event 1',
            meetupDate: '2023-10-15',
            description: 'Description of Event 1',
          },
        ],
        joinedEvents: [
          {
            meetupEventId: 'event-2',
            title: 'Event 2',
            meetupDate: '2023-11-20',
            description: 'Description of Event 2',
          },
        ],
      },
    },
  };

  // Mock GraphQL responses
  const mocks = [
    {
      request: {
        query: GET_USER_PROFILE,
        variables: { userId },
      },
      result: {
        data: mockUserProfileData,
      },
    },
  ];

  it('should return user profile data', async () => {
    // Render the hook within a MockedProvider
    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.profile).toBeNull();

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After loading, check for data
    expect(result.current.error).toBeUndefined();
    expect(result.current.profile).toEqual(mockUserProfileData.userProfile);
  });

  it('should handle errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_USER_PROFILE,
          variables: { userId },
        },
        error: new Error('An error occurred'),
      },
    ];

    // Render the hook with an error mock
    const { result } = renderHook(() => useUserProfile(userId), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.profile).toBeNull();

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After loading, check for error
    expect(result.current.error).toBeDefined();
    expect(result.current.profile).toBeNull();
  });
});

describe('createMeetupEvent', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });
  });

  it('should create a meetup event successfully', async () => {
    // Arrange
    const mockVariables = {
      title: 'Test Meetup',
      description: 'This is a test meetup event.',
      meetupDate: '2023-11-01',
      locationName: 'Test Location',
      address: '123 Test Street',
      createdByUserId: 'user-123',
      latitude: 37.7749,
      longitude: -122.4194,
    };

    const mockResponse = {
      data: {
        createMeetup: {
          meetupEventId: 'event-123',
          ...mockVariables,
        },
      },
    };

    // Mock the mutate method to return the mock response
    const mutateMock = jest.fn().mockResolvedValue(mockResponse);

    // Replace the mutate method in the mock client
    mockApolloClient.mutate = mutateMock;

    // Act
    const result = await createMeetupEvent(
      mockVariables.title,
      mockVariables.description,
      mockVariables.meetupDate,
      mockVariables.locationName,
      mockVariables.address,
      mockVariables.createdByUserId,
      mockVariables.latitude,
      mockVariables.longitude,
      mockApolloClient // Pass the mock client to the function
    );

    // Assert
    expect(mutateMock).toHaveBeenCalledWith({
      mutation: CREATE_MEETUP_EVENT,
      variables: mockVariables,
    });

    expect(result).toEqual({
      meetupEventId: 'event-123',
      ...mockVariables,
    });
  });

  it('should throw an error if the mutation fails', async () => {
    // Arrange
    const mockVariables = {
      title: 'Test Meetup',
      description: 'This is a test meetup event.',
      meetupDate: '2023-11-01',
      locationName: 'Test Location',
      address: '123 Test Street',
      createdByUserId: 'user-123',
      latitude: 37.7749,
      longitude: -122.4194,
    };

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with an error
    const mutateMock = jest.fn().mockRejectedValue(mockError);

    // Replace the mutate method in the mock client
    mockApolloClient.mutate = mutateMock;

    // Act & Assert
    await expect(
      createMeetupEvent(
        mockVariables.title,
        mockVariables.description,
        mockVariables.meetupDate,
        mockVariables.locationName,
        mockVariables.address,
        mockVariables.createdByUserId,
        mockVariables.latitude,
        mockVariables.longitude,
        mockApolloClient // Pass the mock client to the function
      )
    ).rejects.toThrow('Mutation failed');

    expect(mutateMock).toHaveBeenCalledWith({
      mutation: CREATE_MEETUP_EVENT,
      variables: mockVariables,
    });
  });
});

describe('getAllMeetupsAsync', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });
  });

  it('should fetch all meetups successfully', async () => {
    // Arrange
    const userId = 'user-123';

    const mockResponseData = {
      allMeetups: [
        {
          meetupEventId: 'event-1',
          title: 'Meetup 1',
          description: 'Description for Meetup 1',
          meetupDate: '2023-11-15',
          locationName: 'Location 1',
          address: '123 Main St',
          latitude: 37.7749,
          longitude: -122.4194,
          createdByUserId: 'user-123',
          attendees: [
            {
              userId: 'user-123',
              eventId: 'event-1',
              username: 'testuser',
            },
          ],
        },
        // Add more meetups if needed
      ],
    };

    // Mock the query method to return the mock response data
    const queryMock = jest.fn().mockResolvedValue({ data: mockResponseData });

    // Replace the query method in the mock client
    mockApolloClient.query = queryMock;

    // Act
    const result = await getAllMeetupsAsync(userId, mockApolloClient);

    // Assert
    expect(queryMock).toHaveBeenCalledWith({
      query: GET_ALL_MEETUPS,
      variables: { userId },
    });

    expect(result).toEqual(mockResponseData.allMeetups);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-123';

    const mockError = new Error('Query failed');

    // Mock the query method to reject with an error
    const queryMock = jest.fn().mockRejectedValue(mockError);

    // Replace the query method in the mock client
    mockApolloClient.query = queryMock;

    // Act & Assert
    await expect(getAllMeetupsAsync(userId, mockApolloClient)).rejects.toThrow(
      'Query failed'
    );

    expect(queryMock).toHaveBeenCalledWith({
      query: GET_ALL_MEETUPS,
      variables: { userId },
    });
  });
});

describe('toggleAttendance', () => {
  beforeEach(() => {
    // Clear fetch mock
    fetch.mockClear();

    // Reset localStorage
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    localStorage.clear.mockClear();

    // Reset the store and set 'token' to 'test-token'
    localStorage.setItem('token', 'test-token');
  });

  it('should toggle attendance successfully', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const userId = 'user-456';

    const expectedQuery = `
      mutation {
        toggleAttendance(meetupEventId: "${meetupEventId}", userId: "${userId}")
      }
    `;

    const mockResponseData = {
      data: {
        toggleAttendance: 'Attendance toggled successfully',
      },
    };

    // Mock fetch to resolve with the mock response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponseData),
    });

    // Act
    const result = await toggleAttendance(meetupEventId, userId);

    // Assert
    expect(localStorage.getItem).toHaveBeenCalledWith('token');

    // Fetch call arguments
    expect(fetch).toHaveBeenCalledWith(GRAPHQL_ENDPOINT, expect.any(Object));

    const [actualUrl, actualOptions] = fetch.mock.calls[0];
    expect(actualUrl).toBe(GRAPHQL_ENDPOINT);
    expect(actualOptions.method).toBe('POST');
    expect(actualOptions.headers).toEqual({
      'Content-Type': 'application/json',
      'Authorization': `Bearer test-token`,
    });

    // Parse and normalize the actual body
    const actualBody = JSON.parse(actualOptions.body);
    const actualQueryNormalized = normalizeQuery(actualBody.query);
    const expectedQueryNormalized = normalizeQuery(expectedQuery);

    // Compare the normalized queries
    expect(actualQueryNormalized).toBe(expectedQueryNormalized);

    // Check the result
    expect(result).toBe('Attendance toggled successfully');


  });

  it('should throw an error if the response contains errors', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const userId = 'user-456';

    const mockErrorResponse = {
      errors: [
        { message: 'Invalid user ID' },
        { message: 'Event not found' },
      ],
    };

    // Mock fetch to resolve with the mock error response
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
    });

    // Act & Assert
    await expect(toggleAttendance(meetupEventId, userId)).rejects.toThrow(
      'Invalid user ID, Event not found'
    );

    // Check that fetch was called with correct arguments
    expect(fetch).toHaveBeenCalledWith(GRAPHQL_ENDPOINT, expect.any(Object));
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const userId = 'user-456';

    const mockFetchError = new Error('Network error');

    // Mock fetch to reject with an error
    fetch.mockRejectedValueOnce(mockFetchError);

    // Act & Assert
    await expect(toggleAttendance(meetupEventId, userId)).rejects.toThrow(
      'Network error'
    );

    // Check that fetch was called with correct arguments
    expect(fetch).toHaveBeenCalledWith(GRAPHQL_ENDPOINT, expect.any(Object));
  });
});

describe('deleteMeetup', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should delete a meetup successfully', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const userId = 'user-456';
    const mockResponse = {
      data: {
        deleteMeetup: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValue(mockResponse);

    // Act
    const result = await deleteMeetup(meetupEventId, userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_MEETUP,
      variables: {
        meetupEventId,
        userId,
      },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const userId = 'user-456';
    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with an error
    mockApolloClient.mutate.mockRejectedValue(mockError);

    // Act & Assert
    await expect(deleteMeetup(meetupEventId, userId, mockApolloClient)).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_MEETUP,
      variables: {
        meetupEventId,
        userId,
      },
    });
  });
});

describe('updateMeetupEvent', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should update the meetup event successfully', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const title = 'Updated Meetup Title';
    const description = 'Updated description';
    const meetupDate = '2023-12-01T10:00:00Z'; // Assuming ISO string format for DateTime
    const latitude = 37.7749;
    const longitude = -122.4194;
    const locationName = 'Updated Location';
    const address = '456 Updated Street';
    const createdByUserId = 'user-456';

    const variables = {
      meetupEventId,
      title,
      description,
      meetupDate,
      latitude,
      longitude,
      locationName,
      address,
      createdByUserId,
    };

    const mockResponse = {
      data: {
        updateMeetup: true, // Assuming the mutation returns a boolean or appropriate value
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValue(mockResponse);

    // Act
    const result = await updateMeetupEvent(
      meetupEventId,
      title,
      description,
      meetupDate,
      latitude,
      longitude,
      locationName,
      address,
      createdByUserId,
      mockApolloClient // Pass the mock client
    );

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_MEETUP,
      variables,
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const meetupEventId = 'event-123';
    const title = 'Updated Meetup Title';
    const description = 'Updated description';
    const meetupDate = '2023-12-01T10:00:00Z';
    const latitude = 37.7749;
    const longitude = -122.4194;
    const locationName = 'Updated Location';
    const address = '456 Updated Street';
    const createdByUserId = 'user-456';

    const variables = {
      meetupEventId,
      title,
      description,
      meetupDate,
      latitude,
      longitude,
      locationName,
      address,
      createdByUserId,
    };

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with an error
    mockApolloClient.mutate.mockRejectedValue(mockError);

    // Act & Assert
    await expect(
      updateMeetupEvent(
        meetupEventId,
        title,
        description,
        meetupDate,
        latitude,
        longitude,
        locationName,
        address,
        createdByUserId,
        mockApolloClient // Pass the mock client
      )
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_MEETUP,
      variables,
    });
  });
});

describe('useUserFriends', () => {
  const userId = 'user-123';

  // Mock data to return from the query
  const mockFriendsData = {
    friends: [
      {
        friendUserId: 'friend-1',
        user: {
          username: 'user123',
          profileImageUrl: 'http://example.com/user123.jpg',
        },
        friendUser: {
          username: 'frienduser1',
          profileImageUrl: 'http://example.com/frienduser1.jpg',
        },
      },
      {
        friendUserId: 'friend-2',
        user: {
          username: 'user123',
          profileImageUrl: 'http://example.com/user123.jpg',
        },
        friendUser: {
          username: 'frienduser2',
          profileImageUrl: 'http://example.com/frienduser2.jpg',
        },
      },
    ],
  };

  // Mock GraphQL responses
  const mocks = [
    {
      request: {
        query: GET_USER_FRIENDS,
        variables: { userId },
      },
      result: {
        data: mockFriendsData,
      },
    },
  ];

  it('should return user friends data', async () => {
    // Render the hook within a MockedProvider
    const { result } = renderHook(() => useUserFriends(userId), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.friends).toEqual([]);

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After loading, check for data
    expect(result.current.error).toBeUndefined();
    expect(result.current.friends).toEqual(mockFriendsData.friends);
  });

  it('should handle errors', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_USER_FRIENDS,
          variables: { userId },
        },
        error: new Error('An error occurred'),
      },
    ];

    // Render the hook with an error mock
    const { result } = renderHook(() => useUserFriends(userId), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMocks} addTypename={false}>
          {children}
        </MockedProvider>
      ),
    });

    // Initially, loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.friends).toEqual([]);

    // Wait for the loading to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After loading, check for error
    expect(result.current.error).toBeDefined();
    expect(result.current.friends).toEqual([]);
  });
});

describe('searchUsers', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the query method
    mockApolloClient.query = jest.fn();
  });

  it('should search users successfully', async () => {
    // Arrange
    const searchTerm = 'john';

    const mockResponse = {
      data: {
        searchUsers: [
          {
            userId: 'user-1',
            username: 'john_doe',
          },
          {
            userId: 'user-2',
            username: 'john_smith',
          },
        ],
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValue(mockResponse);

    // Act
    const result = await searchUsers(searchTerm, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: SEARCH_USERS,
      variables: { searchTerm },
    });

    expect(result).toEqual(mockResponse.data.searchUsers);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const searchTerm = 'john';
    const mockError = new Error('Query failed');

    // Mock the query method to reject with mockError
    mockApolloClient.query.mockRejectedValue(mockError);

    // Act & Assert
    await expect(searchUsers(searchTerm, mockApolloClient)).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: SEARCH_USERS,
      variables: { searchTerm },
    });
  });
});

describe('addFriend', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should add a friend successfully', async () => {
    // Arrange
    const userId = 'user-123';
    const friendUserId = 'friend-456';

    const mockResponse = {
      data: {
        addFriend: {
          friendId: 'friendship-789',
          userId: userId,
          friendUserId: friendUserId,
          friendUser: {
            username: 'friend_user',
            email: 'friend@example.com',
            profileImageUrl: 'http://example.com/profile.jpg',
          },
        },
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await addFriend(userId, friendUserId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_FRIEND,
      variables: { userId, friendUserId },
    });

    expect(result).toEqual(mockResponse.data.addFriend);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const userId = 'user-123';
    const friendUserId = 'friend-456';

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(addFriend(userId, friendUserId, mockApolloClient)).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_FRIEND,
      variables: { userId, friendUserId },
    });
  });
});

describe('createGroupChat', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should create a group chat successfully', async () => {
    // Arrange
    const groupName = 'Test Group';
    const creatorId = 'user-123';
    const initialFriends = ['friend-1', 'friend-2'];

    const variables = {
      input: {
        groupName,
        creatorId,
        initialFriendIds: initialFriends.map((id) => ({ userId: id })),
      },
    };

    const mockResponse = {
      data: {
        createGroupChat: {
          id: 'group-456',
          groupName,
          creatorId,
          createdAt: '2023-11-01T10:00:00Z',
          members: [
            {
              userId: creatorId,
              username: 'creator_user',
            },
            {
              userId: 'friend-1',
              username: 'friend_user1',
            },
            {
              userId: 'friend-2',
              username: 'friend_user2',
            },
          ],
        },
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await createGroupChat(
      groupName,
      creatorId,
      initialFriends,
      mockApolloClient // Pass the mock client
    );

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_GROUP_CHAT,
      variables,
    });

    expect(result).toEqual(mockResponse.data.createGroupChat);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const groupName = 'Test Group';
    const creatorId = 'user-123';
    const initialFriends = ['friend-1', 'friend-2'];

    const variables = {
      input: {
        groupName,
        creatorId,
        initialFriendIds: initialFriends.map((id) => ({ userId: id })),
      },
    };

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      createGroupChat(groupName, creatorId, initialFriends, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_GROUP_CHAT,
      variables,
    });
  });
});

describe('fetchUserGroupChats', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the query method
    mockApolloClient.query = jest.fn();
  });

  it('should fetch user group chats successfully', async () => {
    // Arrange
    const userId = 'user-123';

    const mockResponse = {
      data: {
        userGroupChats: [
          {
            id: 'group-1',
            groupName: 'Group Chat 1',
            creatorId: 'user-123',
            createdAt: '2023-11-01T10:00:00Z',
            members: [
              {
                userId: 'user-123',
                user: {
                  username: 'user123',
                },
              },
              {
                userId: 'user-456',
                user: {
                  username: 'user456',
                },
              },
            ],
            messages: [
              {
                messageId: 'msg-1',
                content: 'Hello!',
                userId: 'user-123',
                sentAt: '2023-11-01T10:05:00Z',
              },
            ],
          },
          // Add more group chats if needed
        ],
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await fetchUserGroupChats(userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_USER_GROUP_CHATS,
      variables: { userId },
    });

    expect(result).toEqual(mockResponse.data.userGroupChats);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-123';

    const mockError = new Error('Query failed');

    // Mock the query method to reject with mockError
    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(fetchUserGroupChats(userId, mockApolloClient)).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_USER_GROUP_CHATS,
      variables: { userId },
    });
  });
});

describe('getChatRoomsByUserIds', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the query method
    mockApolloClient.query = jest.fn();
  });

  it('should fetch chat rooms between two users successfully', async () => {
    // Arrange
    const userId1 = 'user-123';
    const userId2 = 'user-456';

    const mockResponse = {
      data: {
        chatRoomsByUserIds: [
          {
            chatRoomId: 'chatroom-1',
            isGroupChat: false,
          },
          // Add more chat rooms if needed
        ],
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getChatRoomsByUserIds(userId1, userId2, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_CHAT_ROOMS_BY_USER_IDS,
      variables: { userId1, userId2 },
    });

    expect(result).toEqual(mockResponse.data.chatRoomsByUserIds);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId1 = 'user-123';
    const userId2 = 'user-456';

    const mockError = new Error('Query failed');

    // Mock the query method to reject with mockError
    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      getChatRoomsByUserIds(userId1, userId2, mockApolloClient)
    ).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_CHAT_ROOMS_BY_USER_IDS,
      variables: { userId1, userId2 },
    });
  });
});

describe('isGroupChat', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should determine if a chat is a group chat successfully', async () => {
    // Arrange
    const chatId = 'chatroom-1';

    const mockResponse = {
      data: {
        isGroupChat: true,
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await isGroupChat(chatId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: IS_GROUP_CHAT_QUERY,
      variables: { chatId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const chatId = 'chatroom-1';

    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(isGroupChat(chatId, mockApolloClient)).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: IS_GROUP_CHAT_QUERY,
      variables: { chatId },
    });
  });
});

describe('fetchMessages', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch messages successfully', async () => {
    // Arrange
    const chatId = 'chatroom-1';
    const offset = 0;
    const limit = 10;

    const mockResponse = {
      data: {
        messages: [
          {
            messageId: 'msg-1',
            content: 'Hello!',
            sentAt: '2023-11-01T10:05:00Z',
            chatRoomId: 'chatroom-1',
            groupChatId: null,
            user: {
              userId: 'user-123',
              username: 'user123',
            },
            isQueued: false,
            isDelivered: true,
          },
          // Add more messages if needed
        ],
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await fetchMessages(chatId, offset, limit, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: FETCH_MESSAGES_QUERY,
      variables: { chatId, offset, limit },
    });

    expect(result).toEqual(mockResponse.data.messages);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const chatId = 'chatroom-1';
    const offset = 0;
    const limit = 10;

    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(fetchMessages(chatId, offset, limit, mockApolloClient)).rejects.toThrow(
      'Query failed'
    );

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: FETCH_MESSAGES_QUERY,
      variables: { chatId, offset, limit },
    });
  });
});

describe('deleteGroupChat', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should delete a group chat successfully', async () => {
    // Arrange
    const groupId = 'group-123';
    const mockResponse = {
      data: {
        deleteGroupChat: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await deleteGroupChat(groupId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_GROUP_CHAT,
      variables: { groupId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const groupId = 'group-123';
    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(deleteGroupChat(groupId, mockApolloClient)).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_GROUP_CHAT,
      variables: { groupId },
    });
  });
});

describe('deleteAllMessages', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should delete all messages successfully', async () => {
    // Arrange
    const chatId = 'chatroom-123';
    const isGroupChat = false;
    const mockResponse = {
      data: {
        deleteAllMessages: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await deleteAllMessages(chatId, isGroupChat, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_ALL_MESSAGES,
      variables: { chatId, isGroupChat },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const chatId = 'chatroom-123';
    const isGroupChat = false;
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      deleteAllMessages(chatId, isGroupChat, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_ALL_MESSAGES,
      variables: { chatId, isGroupChat },
    });
  });
});

describe('kickMembersFromGroupChat', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should kick a member from group chat successfully', async () => {
    // Arrange
    const groupId = 'group-123';
    const memberId = 'member-456';
    const requesterId = 'user-789';
    const mockResponse = {
      data: {
        kickMembersFromGroupChat: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await kickMembersFromGroupChat(
      groupId,
      memberId,
      requesterId,
      mockApolloClient
    );

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: KICK_MEMBER_FROM_GROUP_CHAT,
      variables: { groupId, memberId, requesterId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const groupId = 'group-123';
    const memberId = 'member-456';
    const requesterId = 'user-789';
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      kickMembersFromGroupChat(groupId, memberId, requesterId, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: KICK_MEMBER_FROM_GROUP_CHAT,
      variables: { groupId, memberId, requesterId },
    });
  });
});

describe('addFriendToGroup', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should add a friend to a group successfully', async () => {
    // Arrange
    const groupId = 'group-123';
    const friendId = 'friend-456';
    const mockResponse = {
      data: {
        addFriendToGroup: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await addFriendToGroup(groupId, friendId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_FRIEND_TO_GROUP,
      variables: { groupId, friendId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const groupId = 'group-123';
    const friendId = 'friend-456';
    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(addFriendToGroup(groupId, friendId, mockApolloClient)).rejects.toThrow(
      'Mutation failed'
    );

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_FRIEND_TO_GROUP,
      variables: { groupId, friendId },
    });
  });
});

describe('getFilesByParentFolderId', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch files by parent folder ID successfully', async () => {
    // Arrange
    const parentFolderId = 1;
    const userId = 'user-123';
    const mockResponse = {
      data: {
        getFilesByParentFolderId: [
          {
            userFileId: 100,
            fileName: 'document.pdf',
            filePath: '/files/document.pdf',
            fileType: 'pdf',
            uploadedByUserId: userId,
            folderId: parentFolderId,
            thumbnailPath: '/thumbnails/document.png',
          },
          // Add more files if needed
        ],
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getFilesByParentFolderId(
      parentFolderId,
      userId,
      mockApolloClient
    );

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILES_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });

    expect(result).toEqual(mockResponse.data.getFilesByParentFolderId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const parentFolderId = 1;
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      getFilesByParentFolderId(parentFolderId, userId, mockApolloClient)
    ).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILES_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });
  });
});

describe('getFoldersByParentFolderId', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch folders by parent folder ID successfully', async () => {
    // Arrange
    const parentFolderId = 1;
    const userId = 'user-123';
    const mockResponse = {
      data: {
        getFoldersByParentFolderId: [
          {
            folderId: 10,
            name: 'Documents',
            userId: userId,
            parentFolderId: parentFolderId,
            subFolders: [
              {
                folderId: 11,
                name: 'Reports',
              },
            ],
            files: [
              {
                userFileId: 100,
                fileName: 'doc1.pdf',
              },
            ],
          },
          // Add more folders if needed
        ],
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getFoldersByParentFolderId(
      parentFolderId,
      userId,
      mockApolloClient
    );

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FOLDERS_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });

    expect(result).toEqual(mockResponse.data.getFoldersByParentFolderId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const parentFolderId = 1;
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      getFoldersByParentFolderId(parentFolderId, userId, mockApolloClient)
    ).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FOLDERS_BY_PARENT_FOLDER_ID,
      variables: { parentFolderId, userId },
    });
  });
});

describe('getRootFilesByUserId', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the query method
    mockApolloClient.query = jest.fn();
  });

  it('should fetch root files by user ID successfully', async () => {
    // Arrange
    const userId = 'user-123';
    const mockResponse = {
      data: {
        getRootFilesByUserId: [
          {
            userFileId: 100,
            fileName: 'document.pdf',
            filePath: '/files/document.pdf',
            uploadedByUserId: userId,
            folderId: null,
            fileType: 'pdf',
            thumbnailPath: '/thumbnails/document.png',
          },
          // Add more files if needed
        ],
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getRootFilesByUserId(userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_ROOT_FILES_BY_USER_ID,
      variables: { userId },
    });

    expect(result).toEqual(mockResponse.data.getRootFilesByUserId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    // Mock the query method to reject with mockError
    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getRootFilesByUserId(userId, mockApolloClient)).rejects.toThrow(
      'Query failed'
    );

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_ROOT_FILES_BY_USER_ID,
      variables: { userId },
    });
  });
});

describe('getRootFoldersByUserId', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch root folders by user ID successfully', async () => {
    // Arrange
    const userId = 'user-123';
    const mockResponse = {
      data: {
        getRootFoldersByUserId: [
          {
            folderId: 10,
            name: 'Documents',
            userId: userId,
            folderId: 10,
            subFolders: [
              {
                folderId: 11,
                name: 'Reports',
              },
            ],
            files: [
              {
                userFileId: 100,
                fileName: 'doc1.pdf',
              },
            ],
          },
          // Add more folders if needed
        ],
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getRootFoldersByUserId(userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_ROOT_FOLDERS_BY_USER_ID,
      variables: { userId },
    });

    expect(result).toEqual(mockResponse.data.getRootFoldersByUserId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      getRootFoldersByUserId(userId, mockApolloClient)
    ).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_ROOT_FOLDERS_BY_USER_ID,
      variables: { userId },
    });
  });
});


describe('deleteFileForUser', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should delete a file for user successfully', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const deleteForEveryone = true;
    const mockResponse = {
      data: {
        deleteFileForUser: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await deleteFileForUser(fileId, userId, deleteForEveryone, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_FILE_FOR_USER,
      variables: { fileId, userId, deleteForEveryone },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const deleteForEveryone = true;
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      deleteFileForUser(fileId, userId, deleteForEveryone, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_FILE_FOR_USER,
      variables: { fileId, userId, deleteForEveryone },
    });
  });
});

describe('createFolder', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should create a folder successfully', async () => {
    // Arrange
    const name = 'New Folder';
    const userId = 'user-123';
    const parentFolderId = null;

    const mockResponse = {
      data: {
        createFolder: {
          folderId: 10,
          name: 'New Folder',
        },
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await createFolder(name, userId, parentFolderId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_FOLDER,
      variables: { name, userId, parentFolderId },
    });

    expect(result).toEqual(mockResponse.data.createFolder);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const name = 'New Folder';
    const userId = 'user-123';
    const parentFolderId = null;
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      createFolder(name, userId, parentFolderId, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_FOLDER,
      variables: { name, userId, parentFolderId },
    });
  });
});

describe('deleteFolder', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should delete a folder successfully', async () => {
    // Arrange
    const folderId = 10;
    const mockResponse = {
      data: {
        deleteFolder: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await deleteFolder(folderId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_FOLDER,
      variables: { folderId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const folderId = 10;
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(deleteFolder(folderId, mockApolloClient)).rejects.toThrow(
      'Mutation failed'
    );

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_FOLDER,
      variables: { folderId },
    });
  });
});

describe('removeFileAccess', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should remove file access successfully', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const mockResponse = {
      data: {
        removeFileAccess: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await removeFileAccess(fileId, userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: REMOVE_FILE_ACCESS,
      variables: { fileId, userId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(removeFileAccess(fileId, userId, mockApolloClient)).rejects.toThrow(
      'Mutation failed'
    );

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: REMOVE_FILE_ACCESS,
      variables: { fileId, userId },
    });
  });
});

describe('renameFolder', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should rename a folder successfully', async () => {
    // Arrange
    const folderId = 10;
    const newName = 'Renamed Folder';

    const mockResponse = {
      data: {
        renameFolder: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await renameFolder(folderId, newName, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: RENAME_FOLDER,
      variables: { folderId, newName },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const folderId = 10;
    const newName = 'Renamed Folder';
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(renameFolder(folderId, newName, mockApolloClient)).rejects.toThrow(
      'Mutation failed'
    );

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: RENAME_FOLDER,
      variables: { folderId, newName },
    });
  });
});

describe('updateFile', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should update a file successfully', async () => {
    // Arrange
    const fileId = 100;
    const fileName = 'new_document.pdf';
    const filePath = '/files/new_document.pdf';
    const folderId = 10;
    const fileType = 'pdf';

    const variables = {
      fileId,
      fileName,
      filePath,
      folderId,
      fileType,
    };

    const mockResponse = {
      data: {
        updateFile: {
          id: fileId,
          fileName,
          filePath,
          folderId,
          fileType,
        },
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await updateFile(
      fileId,
      fileName,
      filePath,
      folderId,
      fileType,
      mockApolloClient
    );

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_FILE,
      variables,
    });

    expect(result).toEqual(mockResponse.data.updateFile);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const fileId = 100;
    const fileName = 'new_document.pdf';
    const filePath = '/files/new_document.pdf';
    const folderId = 10;
    const fileType = 'pdf';

    const variables = {
      fileId,
      fileName,
      filePath,
      folderId,
      fileType,
    };

    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      updateFile(fileId, fileName, filePath, folderId, fileType, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_FILE,
      variables,
    });
  });
});

describe('getFileByUserId', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the query method
    mockApolloClient.query = jest.fn();
  });

  it('should fetch a file by user ID successfully', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const mockResponse = {
      data: {
        getFileByUserId: {
          id: fileId,
          fileName: 'document.pdf',
          filePath: '/files/document.pdf',
          fileSize: 102400,
          fileType: 'pdf',
          uploadDate: '2023-11-01T10:00:00Z',
          uploadedByUserId: 'user-123',
          folderId: null,
        },
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getFileByUserId(fileId, userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILE_BY_USER_ID,
      variables: { fileId, userId },
    });

    expect(result).toEqual(mockResponse.data.getFileByUserId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const fileId = 100;
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    // Mock the query method to reject with mockError
    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getFileByUserId(fileId, userId, mockApolloClient)).rejects.toThrow(
      'Query failed'
    );

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILE_BY_USER_ID,
      variables: { fileId, userId },
    });
  });
});

describe('shareFileAccess', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should share file access successfully', async () => {
    // Arrange
    const userFileId = 100;
    const sharedWithUserId = 'user-456';
    const sharedByUserId = 'user-123';

    const mockResponse = {
      data: {
        shareFileAccess: {
          userFileId: userFileId,
          sharedWithUserId: sharedWithUserId,
          userFile: {
            userFileId: userFileId,
            fileName: 'document.pdf',
            filePath: '/files/document.pdf',
            fileType: 'pdf',
            thumbnailPath: '/thumbnails/document.png',
          },
          sharedWithUser: {
            userId: sharedWithUserId,
            username: 'user456',
          },
        },
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await shareFileAccess(
      userFileId,
      sharedWithUserId,
      sharedByUserId,
      mockApolloClient
    );

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: SHARE_FILE_ACCESS,
      variables: { userFileId, sharedWithUserId, sharedByUserId },
    });

    expect(result).toEqual(mockResponse.data.shareFileAccess);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const userFileId = 100;
    const sharedWithUserId = 'user-456';
    const sharedByUserId = 'user-123';
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(
      shareFileAccess(userFileId, sharedWithUserId, sharedByUserId, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: SHARE_FILE_ACCESS,
      variables: { userFileId, sharedWithUserId, sharedByUserId },
    });
  });
});

describe('getFileAccessByUser', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch file access by user successfully', async () => {
    // Arrange
    const userId = 'user-456';
    const mockResponse = {
      data: {
        getFileAccessByUser: [
          {
            userFileId: 100,
            sharedWithUser: {
              username: 'user456',
            },
            sharedByUser: {
              username: 'user123', // Sharer's username
            },
            userFile: {
              userFileId: 100,
              filePath: '/files/document.pdf',
              fileType: 'pdf',
              fileName: 'document.pdf',
              thumbnailPath: '/thumbnails/document.png',
              uploadedByUserId: 'user-123',
            },
          },
          // Add more file access records if needed
        ],
      },
    };

    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getFileAccessByUser(userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILE_ACCESS_BY_USER,
      variables: { userId },
    });

    expect(result).toEqual(mockResponse.data.getFileAccessByUser);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-456';
    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getFileAccessByUser(userId, mockApolloClient)).rejects.toThrow(
      'Query failed'
    );

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_FILE_ACCESS_BY_USER,
      variables: { userId },
    });
  });
});

describe('addQuiz', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should add a quiz successfully', async () => {
    // Arrange
    const title = 'Sample Quiz';
    const userId = 'user-123';
    const questions = [
      {
        text: 'What is the capital of France?',
        answerOptions: [
          { text: 'Paris', isCorrect: true },
          { text: 'London', isCorrect: false },
          { text: 'Rome', isCorrect: false },
        ],
      },
      // Add more questions if needed
    ];

    const variables = { title, userId, questions };

    const mockResponse = {
      data: {
        addQuiz: {
          id: 1,
          title,
          userId,
          questions: [
            {
              id: 1,
              text: 'What is the capital of France?',
              answerOptions: [
                { id: 1, text: 'Paris', isCorrect: true },
                { id: 2, text: 'London', isCorrect: false },
                { id: 3, text: 'Rome', isCorrect: false },
              ],
            },
          ],
        },
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await addQuiz(title, userId, questions, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_QUIZ,
      variables,
    });

    expect(result).toEqual(mockResponse.data.addQuiz);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const title = 'Sample Quiz';
    const userId = 'user-123';
    const questions = [
      // Questions
    ];

    const variables = { title, userId, questions };

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(addQuiz(title, userId, questions, mockApolloClient)).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_QUIZ,
      variables,
    });
  });
});

describe('deleteQuiz', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.mutate = jest.fn();
  });

  it('should delete a quiz successfully', async () => {
    // Arrange
    const id = 1;
    const userId = 'user-123';

    const mockResponse = {
      data: {
        deleteQuiz: true, // Assuming the mutation returns a boolean
      },
    };

    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await deleteQuiz(id, userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_QUIZ,
      variables: { id, userId },
    });

    expect(result).toBe(true);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const id = 1;
    const userId = 'user-123';
    const mockError = new Error('Mutation failed');

    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(deleteQuiz(id, userId, mockApolloClient)).rejects.toThrow('Mutation failed');

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_QUIZ,
      variables: { id, userId },
    });
  });
});

describe('getAllQuizzesByUserId', () => {
  let mockApolloClient;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    mockApolloClient.query = jest.fn();
  });

  it('should fetch all quizzes for a user successfully', async () => {
    // Arrange
    const userId = 'user-123';

    const mockResponse = {
      data: {
        getAllQuizzesByUserId: [
          {
            id: 1,
            title: 'Sample Quiz',
            userId,
            questions: [
              {
                id: 1,
                text: 'What is the capital of France?',
                answerOptions: [
                  { id: 1, text: 'Paris', isCorrect: true },
                  { id: 2, text: 'London', isCorrect: false },
                  { id: 3, text: 'Rome', isCorrect: false },
                ],
              },
            ],
          },
          // Add more quizzes if needed
        ],
      },
    };

    // Mock the query method to resolve with mockResponse
    mockApolloClient.query.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await getAllQuizzesByUserId(userId, mockApolloClient);

    // Assert
    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_QUIZZES,
      variables: { userId },
    });

    expect(result).toEqual(mockResponse.data.getAllQuizzesByUserId);
  });

  it('should handle errors when the query fails', async () => {
    // Arrange
    const userId = 'user-123';
    const mockError = new Error('Query failed');

    mockApolloClient.query.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getAllQuizzesByUserId(userId, mockApolloClient)).rejects.toThrow('Query failed');

    expect(mockApolloClient.query).toHaveBeenCalledWith({
      query: GET_QUIZZES,
      variables: { userId },
    });
  });
});

describe('submitQuiz', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock instance of Apollo Client
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    // Mock the mutate method
    mockApolloClient.mutate = jest.fn();
  });

  it('should submit a quiz successfully', async () => {
    // Arrange
    const id = 1;
    const userId = 'user-123';
    const selectedAnswerIds = [101, 102, 103];

    const variables = { id, userId, selectedAnswerIds };

    const mockResponse = {
      data: {
        submitQuiz: 80, // Assuming the mutation returns a score of 80
      },
    };

    // Mock the mutate method to resolve with mockResponse
    mockApolloClient.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await submitQuiz(id, userId, selectedAnswerIds, mockApolloClient);

    // Assert
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: SUBMIT_QUIZ,
      variables,
    });

    expect(result).toBe(80);
  });

  it('should handle errors when the mutation fails', async () => {
    // Arrange
    const id = 1;
    const userId = 'user-123';
    const selectedAnswerIds = [101, 102, 103];

    const variables = { id, userId, selectedAnswerIds };

    const mockError = new Error('Mutation failed');

    // Mock the mutate method to reject with mockError
    mockApolloClient.mutate.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(submitQuiz(id, userId, selectedAnswerIds, mockApolloClient)).rejects.toThrow(
      'Mutation failed'
    );

    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: SUBMIT_QUIZ,
      variables,
    });
  });
});



describe('updateQuiz', () => {
  const id = 1;
  const title = 'Updated Quiz Title';
  const userId = 'user123';
  const questions = [
    {
      id: 1,
      text: 'Updated Question 1',
      answerOptions: [
        { id: 1, text: 'Option A', isCorrect: false },
        { id: 2, text: 'Option B', isCorrect: true },
      ],
    },
    // Add more questions if needed
  ];

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the quiz and return the updated data', async () => {
    const mockResult = {
      data: {
        updateQuiz: {
          id,
          title,
          userId,
          questions,
        },
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateQuiz(id, title, userId, questions, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_QUIZ,
      variables: { id, title, userId, questions },
    });

    expect(result).toEqual(mockResult.data.updateQuiz);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateQuiz(id, title, userId, questions, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_QUIZ,
      variables: { id, title, userId, questions },
    });
  });
});

describe('getAllConcepts', () => {
  const userId = 'user123';
  const conceptListId = 1;

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch all concepts and return the data', async () => {
    const mockConcepts = [
      {
        id: 1,
        title: 'Concept 1',
        description: 'Description 1',
        userId,
        conceptListId,
      },
      {
        id: 2,
        title: 'Concept 2',
        description: 'Description 2',
        userId,
        conceptListId,
      },
    ];

    const mockResult = {
      data: {
        getAllConcepts: mockConcepts,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getAllConcepts(userId, conceptListId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_CONCEPTS,
      variables: { userId, conceptListId },
    });

    expect(result).toEqual(mockConcepts);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getAllConcepts(userId, conceptListId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_CONCEPTS,
      variables: { userId, conceptListId },
    });
  });
});

describe('getConceptById', () => {
  const id = 1;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch the concept by ID and return the data', async () => {
    const mockConcept = {
      id,
      title: 'Concept Title',
      description: 'Concept Description',
      userId,
      conceptListId: 1,
    };

    const mockResult = {
      data: {
        getConceptById: mockConcept,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getConceptById(id, userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CONCEPT_BY_ID,
      variables: { id, userId },
    });

    expect(result).toEqual(mockConcept);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getConceptById(id, userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CONCEPT_BY_ID,
      variables: { id, userId },
    });
  });
});

describe('getAllConceptLists', () => {
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch all concept lists and return the data', async () => {
    const mockConceptLists = [
      {
        id: 1,
        title: 'Concept List 1',
        userId,
        concepts: [
          {
            id: 1,
            title: 'Concept 1',
            description: 'Description 1',
          },
        ],
      },
      {
        id: 2,
        title: 'Concept List 2',
        userId,
        concepts: [
          {
            id: 2,
            title: 'Concept 2',
            description: 'Description 2',
          },
        ],
      },
    ];

    const mockResult = {
      data: {
        getAllConceptLists: mockConceptLists,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getAllConceptLists(userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_CONCEPT_LISTS,
      variables: { userId },
    });

    expect(result).toEqual(mockConceptLists);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getAllConceptLists(userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_CONCEPT_LISTS,
      variables: { userId },
    });
  });
});

describe('getConceptListById', () => {
  const id = 1;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch the concept list by ID and return the data', async () => {
    const mockConceptList = {
      id,
      title: 'Concept List Title',
      userId,
      concepts: [
        {
          id: 1,
          title: 'Concept 1',
          description: 'Description 1',
        },
        {
          id: 2,
          title: 'Concept 2',
          description: 'Description 2',
        },
      ],
    };

    const mockResult = {
      data: {
        getConceptListById: mockConceptList,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getConceptListById(id, userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CONCEPT_LIST_BY_ID,
      variables: { id, userId },
    });

    expect(result).toEqual(mockConceptList);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getConceptListById(id, userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_CONCEPT_LIST_BY_ID,
      variables: { id, userId },
    });
  });
});

describe('addConcept', () => {
  const conceptInput = {
    title: 'New Concept',
    description: 'This is a new concept.',
    userId: 'user123',
    conceptListId: 1,
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should add a new concept and return the created concept', async () => {
    const mockConcept = {
      id: 3,
      ...conceptInput,
    };

    const mockResult = {
      data: {
        addConcept: mockConcept,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await addConcept(conceptInput, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_CONCEPT,
      variables: { conceptInput },
    });

    expect(result).toEqual(mockConcept);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(addConcept(conceptInput, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_CONCEPT,
      variables: { conceptInput },
    });
  });
});

describe('updateConcept', () => {
  const conceptInput = {
    id: 1,
    title: 'Updated Concept Title',
    description: 'Updated description of the concept.',
    userId: 'user123',
    conceptListId: 1,
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the concept and return the updated data', async () => {
    const mockResult = {
      data: {
        updateConcept: conceptInput,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateConcept(conceptInput, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_CONCEPT,
      variables: { conceptInput },
    });

    expect(result).toEqual(conceptInput);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateConcept(conceptInput, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_CONCEPT,
      variables: { conceptInput },
    });
  });
});

describe('deleteConcept', () => {
  const id = 1;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should delete the concept and return confirmation', async () => {
    const mockResult = {
      data: {
        deleteConcept: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await deleteConcept(id, userId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_CONCEPT,
      variables: { id, userId },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the deletion fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(deleteConcept(id, userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_CONCEPT,
      variables: { id, userId },
    });
  });
});

describe('addConceptList', () => {
  const conceptListInput = {
    title: 'New Concept List',
    userId: 'user123',
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should add a new concept list and return the created list', async () => {
    const mockConceptList = {
      id: 1,
      ...conceptListInput,
    };

    const mockResult = {
      data: {
        addConceptList: mockConceptList,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await addConceptList(conceptListInput, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_CONCEPT_LIST,
      variables: { conceptListInput },
    });

    expect(result).toEqual(mockConceptList);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(addConceptList(conceptListInput, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_CONCEPT_LIST,
      variables: { conceptListInput },
    });
  });
});

describe('updateConceptList', () => {
  const conceptListInput = {
    id: 1,
    title: 'Updated Concept List Title',
    userId: 'user123',
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the concept list and return the updated data', async () => {
    const mockResult = {
      data: {
        updateConceptList: conceptListInput,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateConceptList(conceptListInput, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_CONCEPT_LIST,
      variables: { conceptListInput },
    });

    expect(result).toEqual(conceptListInput);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateConceptList(conceptListInput, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_CONCEPT_LIST,
      variables: { conceptListInput },
    });
  });
});

describe('deleteConceptList', () => {
  const id = 1;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should delete the concept list and return confirmation', async () => {
    const mockResult = {
      data: {
        deleteConceptList: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await deleteConceptList(id, userId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_CONCEPT_LIST,
      variables: { id, userId },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the deletion fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(deleteConceptList(id, userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_CONCEPT_LIST,
      variables: { id, userId },
    });
  });
});

describe('createSelfTest', () => {
  const input = {
    title: 'New Self-Test',
    userId: 'user123',
    // Add any other required fields here
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should create a new self-test and return the created test', async () => {
    const mockSelfTest = {
      id: 1,
      ...input,
    };

    const mockResult = {
      data: {
        createSelfTest: mockSelfTest,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await createSelfTest(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_SELF_TEST,
      variables: { input },
    });

    expect(result).toEqual(mockSelfTest);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(createSelfTest(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_SELF_TEST,
      variables: { input },
    });
  });
});

describe('updateSelfTest', () => {
  const id = 'test123';
  const title = 'Updated Self-Test Title';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the self-test and return the updated data', async () => {
    const mockResult = {
      data: {
        updateSelfTest: {
          id,
          title,
        },
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateSelfTest(id, title, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST,
      variables: { id, title },
    });

    expect(result).toEqual(mockResult.data.updateSelfTest);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateSelfTest(id, title, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST,
      variables: { id, title },
    });
  });
});

describe('deleteSelfTest', () => {
  const selfTestId = 'test123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should delete the self-test and return confirmation', async () => {
    const mockResult = {
      data: {
        deleteSelfTest: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await deleteSelfTest(selfTestId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_SELF_TEST,
      variables: { selfTestId },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the deletion fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(deleteSelfTest(selfTestId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_SELF_TEST,
      variables: { selfTestId },
    });
  });
});

describe('getAllSelfTestsByUserId', () => {
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch all self-tests by user ID and return the data', async () => {
    const mockSelfTests = [
      {
        id: 'test1',
        title: 'Self-Test 1',
        userId,
        selfTestQuestions: [
          {
            id: 'q1',
            text: 'Question 1',
            correctAnswer: 'Answer 1',
          },
          // Add more questions if needed
        ],
      },
      {
        id: 'test2',
        title: 'Self-Test 2',
        userId,
        selfTestQuestions: [
          {
            id: 'q2',
            text: 'Question 2',
            correctAnswer: 'Answer 2',
          },
          // Add more questions if needed
        ],
      },
    ];

    const mockResult = {
      data: {
        getAllSelfTestsByUserId: mockSelfTests,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getAllSelfTestsByUserId(userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_SELF_TESTS_BY_USER,
      variables: { userId },
    });

    expect(result).toEqual(mockSelfTests);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getAllSelfTestsByUserId(userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_SELF_TESTS_BY_USER,
      variables: { userId },
    });
  });
});

describe('createSelfTestQuestion', () => {
  const input = {
    selfTestId: 'selfTest123',
    text: 'What is the capital of Germany?',
    correctAnswer: 'Berlin',
    userId: 'user123',
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should create a self-test question and return the created question', async () => {
    const mockQuestion = {
      id: 'question123',
      selfTestId: input.selfTestId,
      text: input.text,
      correctAnswer: input.correctAnswer,
    };

    const mockResult = {
      data: {
        createSelfTestQuestion: mockQuestion,
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await createSelfTestQuestion(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_SELF_TEST_QUESTION,
      variables: input,
    });

    expect(result).toEqual(mockQuestion);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(createSelfTestQuestion(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: CREATE_SELF_TEST_QUESTION,
      variables: input,
    });
  });
});

describe('updateSelfTestQuestion', () => {
  const input = {
    id: 'question123',
    selfTestId: 'selfTest123',
    text: 'What is the capital of Spain?',
    correctAnswer: 'Madrid',
    userId: 'user123',
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the self-test question and return the updated data', async () => {
    const mockResult = {
      data: {
        updateSelfTestQuestion: {
          id: input.id,
          selfTestId: input.selfTestId,
          text: input.text,
          correctAnswer: input.correctAnswer,
        },
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateSelfTestQuestion(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST_QUESTION,
      variables: input,
    });

    expect(result).toEqual(mockResult.data.updateSelfTestQuestion);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateSelfTestQuestion(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST_QUESTION,
      variables: input,
    });
  });
});

describe('updateSelfTestQuestion', () => {
  const input = {
    id: 'question123',
    selfTestId: 'selfTest123',
    text: 'What is the capital of Spain?',
    correctAnswer: 'Madrid',
    userId: 'user123',
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the self-test question and return the updated data', async () => {
    const mockResult = {
      data: {
        updateSelfTestQuestion: {
          id: input.id,
          selfTestId: input.selfTestId,
          text: input.text,
          correctAnswer: input.correctAnswer,
        },
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateSelfTestQuestion(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST_QUESTION,
      variables: input,
    });

    expect(result).toEqual(mockResult.data.updateSelfTestQuestion);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateSelfTestQuestion(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_SELF_TEST_QUESTION,
      variables: input,
    });
  });
});

describe('deleteSelfTestQuestion', () => {
  const questionId = 'question123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should delete the self-test question and return confirmation', async () => {
    const mockResult = {
      data: {
        deleteSelfTestQuestion: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await deleteSelfTestQuestion(questionId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_SELF_TEST_QUESTION,
      variables: { questionId },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the deletion fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(deleteSelfTestQuestion(questionId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_SELF_TEST_QUESTION,
      variables: { questionId },
    });
  });
});

describe('addTodoTaskList', () => {
  const input = {
    name: 'New Task List',
    position: 1,
    userId: 'user123',
    // Include any other required fields in the input
  };

  let apolloClient;

  beforeEach(() => {
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should add a new todo task list and return the created list', async () => {
    const mockResult = {
      data: {
        addList: {
          todoTaskListId: 'list123',
          name: input.name,
          position: input.position,
          userId: input.userId,
        },
      },
    };

    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await addTodoTaskList(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_LIST_MUTATION,
      variables: { input },
    });

    expect(result).toEqual(mockResult.data.addList);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(addTodoTaskList(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_LIST_MUTATION,
      variables: { input },
    });
  });
});

describe('addTodoTask', () => {
  const input = {
    title: 'New Task',
    description: 'Description of the new task',
    isCompleted: false,
    dueDate: '2023-12-31',
    position: 1,
    todoTaskListId: 'list123',
    userId: 'user123',
    // Include any other required fields in the input
  };

  let apolloClient;

  beforeEach(() => {
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should add a new todo task and return the created task', async () => {
    const mockResult = {
      data: {
        addTask: {
          todoTaskId: 'task123',
          ...input,
        },
      },
    };

    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await addTodoTask(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_TASK_MUTATION,
      variables: { input },
    });

    expect(result).toEqual(mockResult.data.addTask);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(addTodoTask(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: ADD_TASK_MUTATION,
      variables: { input },
    });
  });
});
describe('getAllSelfTestQuestionsByUser', () => {
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a query function
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch all self-test questions for the user and return the data', async () => {
    const mockQuestions = [
      {
        id: 'question1',
        selfTestId: 'selfTest1',
        text: 'What is the capital of France?',
        correctAnswer: 'Paris',
        userId,
      },
      {
        id: 'question2',
        selfTestId: 'selfTest2',
        text: 'What is 2 + 2?',
        correctAnswer: '4',
        userId,
      },
    ];

    const mockResult = {
      data: {
        getAllSelfTestQuestionsByUserId: mockQuestions,
      },
    };

    // Mock the query function to resolve with mockResult
    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getAllSelfTestQuestionsByUser(userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_SELF_TEST_QUESTIONS_BY_USER,
      variables: { userId },
    });

    expect(result).toEqual(mockQuestions);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the query function to reject with mockError
    apolloClient.query.mockRejectedValue(mockError);

    await expect(getAllSelfTestQuestionsByUser(userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_ALL_SELF_TEST_QUESTIONS_BY_USER,
      variables: { userId },
    });
  });
});

describe('deleteTodoTaskList', () => {
  const todoTaskListId = 1;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should delete the todo task list and return confirmation', async () => {
    const mockResult = {
      data: {
        deleteList: true, // Assuming the mutation returns a boolean
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await deleteTodoTaskList(todoTaskListId, userId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_LIST_MUTATION,
      variables: { todoTaskListId, userId },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the deletion fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(deleteTodoTaskList(todoTaskListId, userId, apolloClient)).rejects.toThrow(
      'Network Error'
    );

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: DELETE_LIST_MUTATION,
      variables: { todoTaskListId, userId },
    });
  });
});

describe('moveTodoTask', () => {
  const todoTaskId = 1;
  const targetListId = 2;
  const newPosition = 3;
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should move the todo task and return confirmation', async () => {
    const mockResult = {
      data: {
        moveTask: true, // Assuming the mutation returns a boolean
      },
    };

    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await moveTodoTask(todoTaskId, targetListId, newPosition, userId, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: MOVE_TASK_MUTATION,
      variables: {
        todoTaskId,
        targetListId,
        newPosition,
        userId,
      },
    });

    expect(result).toEqual(true);
  });

  it('should throw an error when the mutation fails', async () => {
    const mockError = new Error('Network Error');

    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(
      moveTodoTask(todoTaskId, targetListId, newPosition, userId, apolloClient)
    ).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: MOVE_TASK_MUTATION,
      variables: {
        todoTaskId,
        targetListId,
        newPosition,
        userId,
      },
    });
  });
});

describe('updateTodoTaskList', () => {
  const input = {
    todoTaskListId: 1,
    name: 'Updated Task List Name',
    position: 2,
    // Include any other required fields
  };

  let apolloClient;

  beforeEach(() => {
    // Mock the apolloClient with a mutate function
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the todo task list and return the updated data', async () => {
    const mockResult = {
      data: {
        updateList: {
          todoTaskListId: input.todoTaskListId,
          name: input.name,
          position: input.position,
        },
      },
    };

    // Mock the mutate function to resolve with mockResult
    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateTodoTaskList(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_LIST_MUTATION,
      variables: { input },
    });

    expect(result).toEqual(mockResult.data.updateList);
  });

  it('should throw an error when the update fails', async () => {
    const mockError = new Error('Network Error');

    // Mock the mutate function to reject with mockError
    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateTodoTaskList(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_LIST_MUTATION,
      variables: { input },
    });
  });
});

describe('updateTodoTask', () => {
  const input = {
    todoTaskId: 1,
    title: 'Updated Task Title',
    description: 'Updated description',
    isCompleted: true,
    dueDate: '2023-12-31',
    position: 2,
    // Include any other required fields
  };

  let apolloClient;

  beforeEach(() => {
    apolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update the todo task and return the updated data', async () => {
    const mockResult = {
      data: {
        updateTask: {
          todoTaskId: input.todoTaskId,
          title: input.title,
          description: input.description,
          isCompleted: input.isCompleted,
          dueDate: input.dueDate,
          position: input.position,
        },
      },
    };

    apolloClient.mutate.mockResolvedValue(mockResult);

    const result = await updateTodoTask(input, apolloClient);

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_TASK_MUTATION,
      variables: { input },
    });

    expect(result).toEqual(mockResult.data.updateTask);
  });

  it('should throw an error when the update fails', async () => {
    const mockError = new Error('Network Error');

    apolloClient.mutate.mockRejectedValue(mockError);

    await expect(updateTodoTask(input, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_TASK_MUTATION,
      variables: { input },
    });
  });
});

describe('getListsByUserId', () => {
  const userId = 'user123';

  let apolloClient;

  beforeEach(() => {
    apolloClient = {
      query: jest.fn(),
    };
  });

  it('should fetch todo task lists by user ID and return the data', async () => {
    const mockLists = [
      {
        todoTaskListId: 1,
        name: 'Task List 1',
        position: 1,
        userId,
        todoTasks: [
          {
            todoTaskId: 1,
            title: 'Task 1',
            description: 'Description 1',
            isCompleted: false,
            dueDate: '2023-12-31',
            position: 1,
            todoTaskListId: 1,
          },
        ],
      },
      {
        todoTaskListId: 2,
        name: 'Task List 2',
        position: 2,
        userId,
        todoTasks: [
          {
            todoTaskId: 2,
            title: 'Task 2',
            description: 'Description 2',
            isCompleted: true,
            dueDate: '2023-11-30',
            position: 1,
            todoTaskListId: 2,
          },
        ],
      },
    ];

    const mockResult = {
      data: {
        getListsByUserId: mockLists,
      },
    };

    apolloClient.query.mockResolvedValue(mockResult);

    const result = await getListsByUserId(userId, apolloClient);

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_LISTS_BY_USER_ID,
      variables: { userId },
    });

    expect(result).toEqual(mockLists);
  });

  it('should throw an error when the query fails', async () => {
    const mockError = new Error('Network Error');

    apolloClient.query.mockRejectedValue(mockError);

    await expect(getListsByUserId(userId, apolloClient)).rejects.toThrow('Network Error');

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_LISTS_BY_USER_ID,
      variables: { userId },
    });
  });
});
describe('updateUserProfile', () => {
  let mockApolloClient;

  beforeEach(() => {
    // Create a mock Apollo Client with a mocked mutate method
    mockApolloClient = {
      mutate: jest.fn(),
    };
  });

  it('should update user profile and return updated data', async () => {
    // Define test inputs
    const userId = 'user-123';
    const bio = 'This is my new bio';
    const profilePicUrl = 'http://example.com/profile.jpg';

    // Define the expected response data
    const mockedResponse = {
      data: {
        updateUserProfile: {
          userId,
          bio,
          profileImageUrl: profilePicUrl,
        },
      },
    };

    // Mock the mutate method to return the mocked response
    mockApolloClient.mutate.mockResolvedValue(mockedResponse);

    // Call the function with the mocked client
    const result = await updateUserProfile(userId, bio, profilePicUrl, mockApolloClient);

    // Assertions
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_USER_PROFILE,
      variables: { userId, bio, profilePicUrl },
    });

    expect(result).toEqual({
      userId,
      bio,
      profileImageUrl: profilePicUrl,
    });
  });

  it('should throw an error if the mutation fails', async () => {
    // Define test inputs
    const userId = 'user-123';
    const bio = 'This is my new bio';
    const profilePicUrl = 'http://example.com/profile.jpg';

    // Mock an error
    const mockError = new Error('Mutation failed');

    // Mock the mutate method to throw an error
    mockApolloClient.mutate.mockRejectedValue(mockError);

    // Call the function and expect it to throw an error
    await expect(
      updateUserProfile(userId, bio, profilePicUrl, mockApolloClient)
    ).rejects.toThrow('Mutation failed');

    // Assertions
    expect(mockApolloClient.mutate).toHaveBeenCalledWith({
      mutation: UPDATE_USER_PROFILE,
      variables: { userId, bio, profilePicUrl },
    });
  });
});

