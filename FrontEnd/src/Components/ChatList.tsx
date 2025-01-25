import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER_FRIENDS, GET_USER_GROUP_CHATS, GET_CHAT_ROOMS_BY_USER_IDS, DELETE_GROUP_CHAT, DELETE_ALL_MESSAGES, KICK_MEMBER_FROM_GROUP_CHAT, ADD_FRIEND_TO_GROUP, CREATE_GROUP_CHAT } from '../api/graphql';
import styles from '../Styles/_chatList.module.css';
import * as SignalR from '@microsoft/signalr';

interface ChatListProps {
  setActiveChat: (chatId: string | number | null, isGroup: boolean | null) => void;
  setFriendUserId: React.Dispatch<React.SetStateAction<string | null>>;
  friendUserId: string | null;
  setChatId: React.Dispatch<React.SetStateAction<string | number | null>>;
  chatId: number | string | null;
  isGroupChat: boolean | null;
  userId: string | null;
}

const ChatList: FunctionComponent<ChatListProps> = ({ setChatId, chatId, setActiveChat, setFriendUserId, friendUserId, isGroupChat, userId }) => {
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groups, setGroups] = useState<{
    createdAt: string | Date;
    creatorId: string | null;
    groupName: string;
    id: string;
    members: {
      username: string;
      userId: string | null;
    }[];
  }[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); // Track open dropdown
  const [addMemberDropdownOpen, setAddMemberDropdownOpen] = useState<string | null>(null);

  const [deleteGroupChatMutation] = useMutation(DELETE_GROUP_CHAT);
  const [deleteAllMessagesMutation] = useMutation(DELETE_ALL_MESSAGES);
  const [kickMemberMutation] = useMutation(KICK_MEMBER_FROM_GROUP_CHAT);
  const [addFriendToGroupMutation] = useMutation(ADD_FRIEND_TO_GROUP);
  const [createGroupChatMutation] = useMutation(CREATE_GROUP_CHAT);

  const [connection, setConnection] = useState<SignalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown menu


  const { loading, error, data } = useQuery(GET_CHAT_ROOMS_BY_USER_IDS, {
    variables: {
      userId1: userId,
      userId2: friendUserId,
    },
    skip: !userId || !friendUserId,
  });

  
  const signalRConnection = useRef<SignalR.HubConnection | null>(null);

  useEffect(() => {
    if (!userId || connection) return; // Don't create new connection if one exists

    const newConnection = new SignalR.HubConnectionBuilder()
        .withUrl('/hubs/chat')
        .withAutomaticReconnect()
        .build();

    newConnection.on('UserAddedToGroup', (userId: string) => {
        console.log(`User ${userId} added to group`);
    });

    newConnection.start()
        .then(() => {
            console.log('SignalR connected');
            setConnection(newConnection);
            setIsConnected(true);
        })
        .catch((err) => console.error('SignalR connection failed:'));

    return () => {
        newConnection.stop().catch((err) => console.error('Error stopping SignalR connection:', err));
    };
}, [userId]); // Only depend on userId

  useEffect(() => {
    if (data?.chatRoomsByUserIds[0]?.chatRoomId) {
      console.log("chat is switched");
      setActiveChat(data.chatRoomsByUserIds[0].chatRoomId, isGroupChat)
    }
  }, [data?.chatRoomsByUserIds[0]?.chatRoomId]);

  const { loading: loadingFriends, error: friendsError, data: friendsData } = useQuery(GET_USER_FRIENDS, {
    variables: { userId },
    skip: !userId,
  });

  const { loading: loadingGroups, error: groupsError, data: groupsData } = useQuery(GET_USER_GROUP_CHATS, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData.userGroupChats);
      console.log(groupsData)
    }
  }, [groupsData]);

  useEffect(() => {
    console.log('Updated selectedFriends:', selectedFriends);
  }, [selectedFriends]);




  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loadingFriends || loadingGroups) {
    return <p className={styles.loading}>Loading chats...</p>;
  }

  if (friendsError) {
    console.error("Error loading friends:", friendsError);
    return <p className={styles.error}>Error loading friends</p>;
  }

  if (groupsError) {
    console.error("Error loading groups:", groupsError);
    return <p className={styles.error}>Error loading groups</p>;
  }

  const friends = friendsData?.friends || [];

  const handleChatClick = (friend: any) => {
    setFriendUserId(friend.friendUserId);
    if (data?.chatRoomsByUserIds?.length > 0) {
      const newChatId = data.chatRoomsByUserIds[0].chatRoomId;
      setChatId(newChatId);
      setActiveChat(newChatId, false); // Pass false for individual chat
    } else {
      console.warn("Chat ID data not available; skipping update.");
    }
  };

  const handleCreateGroupChat = async () => {
    if (!newGroupName || selectedFriends.length === 0) {
      console.warn('Invalid group creation data', { newGroupName, selectedFriends });
      return;
    }

    try {
      // Reshape selectedFriends to match the required format for the mutation
      const reshapedFriendIds = selectedFriends.map((friendId) => ({ userId: friendId }));

      // Prepare the input object for the mutation
      const input = {
        groupName: newGroupName,
        creatorId: userId,
        initialFriendIds: reshapedFriendIds, // Pass the reshaped friend IDs as part of the input
      };

      // Execute the mutation to create the group
      const { data } = await createGroupChatMutation({
        variables: { input }, // Pass the input object to the mutation
      });

      // Check if the mutation response was successful
      if (data?.createGroupChat) {
        // Update the groups state with the newly created group
        console.log(data)
        setGroups((prevGroups) => [...prevGroups, data.createGroupChat]);

        // Close the modal after the group is created
        setModalOpen(false);

        // Join the group in SignalR after the group is created
        if (connection) {
          await connection.invoke('JoinGroup', data.createGroupChat.id);
          console.log('Joined the new group:', data.createGroupChat.id);
        }
      }
    } catch (err) {
      console.error('Error creating group chat:', err);
    }
  };






  const handleGroupChatClick = (groupId: string) => {
    setChatId(groupId);
    setActiveChat(groupId, true); // Pass true for group chat
  };

  const handleDropdownToggle = (groupId: string) => {
    setDropdownOpen(dropdownOpen === groupId ? null : groupId); // Toggle dropdown visibility
  };


  const handleAddFriendToGroup = async (groupId: string, friendId: string | null, friendUsername: string) => {
    try {
      // Optimistic UI update: add the friend to the group instantly
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? {
              ...group,
              members: [
                ...group.members,
                {
                  username: friendUsername,
                  userId: friendId,
                },
              ],
            }
            : group
        )
      );

      // Perform the GraphQL mutation to add the friend to the group
      const { data } = await addFriendToGroupMutation({
        variables: { groupId, friendId },
      });

      if (data?.addFriendToGroup) {
        console.log(`Friend ${friendId} added to group ${groupId} successfully.`);

        // Ensure signalRConnection.current is valid before invoking
        if (signalRConnection.current) {
          try {
            await signalRConnection.current.invoke('AddUserToGroup', groupId, friendId);
            console.log(`Friend ${friendId} is now connected to SignalR group ${groupId}.`);
          } catch (signalRError) {
            console.error('SignalR invocation failed:', signalRError);
          }
        }
      } else {
        console.error(`Failed to add friend ${friendId} to group ${groupId}.`);
        // Rollback the optimistic UI update
        rollbackGroupState(groupId, friendId);
      }
    } catch (error) {
      console.error('Error adding friend to group:', error);
      // Rollback the optimistic UI update in case of error
      rollbackGroupState(groupId, friendId);
    } finally {
      setDropdownOpen(null); // Close dropdown after action
    }
  };

  // Helper function to rollback optimistic updates
  const rollbackGroupState = (groupId: string, friendId: string | null) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
            ...group,
            members: group.members.filter((member) => member.userId !== friendId),
          }
          : group
      )
    );
  };



  // Function to toggle the "Add Member" dropdown
  const handleAddMemberDropdownToggle = (groupId: string) => {
    setAddMemberDropdownOpen(addMemberDropdownOpen === groupId ? null : groupId);
  };



  const handleDeleteGroupChat = async (groupId: string) => {
    try {
      handleDeleteMessages(groupId, isGroupChat)
      const { data } = await deleteGroupChatMutation({ variables: { groupId } });

      if (data?.deleteGroupChat) {
        console.log(`Group ${groupId} deleted successfully`);
        // Perform additional UI updates, such as removing the group from the list
      } else {
        console.error(`Failed to delete group ${groupId}`);
      }
    } catch (error) {
      console.error('Error deleting group chat:', error);
    }
    setGroups((prev) => prev.filter(group => group.id !== groupId))
    setDropdownOpen(null); // Close dropdown after action
  };

  // Function to handle kicking a member from a group
  const handleKickMember = async (groupId: string, memberId: string, requesterId: string | null) => {
    // Optimistic UI update: remove the member instantly
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, members: group.members.filter((member) => member.userId !== memberId) }
          : group
      )
    );

    try {
      const { data } = await kickMemberMutation({
        variables: { groupId, memberId, requesterId },
      });

      if (data?.kickMembersFromGroupChat) {
        console.log(`Member ${memberId} kicked from group ${groupId} successfully.`);
      } else {
        console.error(`Failed to kick member ${memberId} from group ${groupId}.`);
        rollbackGroupState(groupId, memberId);
      }
    } catch (error) {
      console.error('Error kicking member from group:', error);
      rollbackGroupState(groupId, memberId);
    } finally {
      setDropdownOpen(null); // Close dropdown after action
    }
  };





  // Function to handle deleting all messages in a chat
  const handleDeleteMessages = async (chatId: string | number | null, isGroupChat: boolean | null) => {
    try {
      const { data } = await deleteAllMessagesMutation({
        variables: { chatId, isGroupChat },
      });

      if (data?.deleteAllMessages) {
        console.log(`All messages in chat ${chatId} deleted successfully`);
        // Perform additional UI updates, such as clearing the chat window
      } else {
        console.error(`Failed to delete messages in chat ${chatId}`);
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
    }

    setDropdownOpen(null); // Close dropdown after action
  };


  // This will run whenever selectedFriends is updated

  const handleFriendSelection = (e: any, friendId: string) => {
    const isChecked = e.target.checked;

    // Functional state update
    setSelectedFriends((prevSelected) => {
      if (isChecked) {
        // Add friendId if not already in the array
        if (!prevSelected.includes(friendId)) {
          return [...prevSelected, friendId]; // Always return a new array
        }
      } else {
        // Remove friendId from the array
        return prevSelected.filter((id) => id !== friendId); // Return a new array with friendId removed
      }
      return prevSelected; // Return unchanged state if no action is needed
    });
  };




  return (
    <div className={styles.chatList}>
      <h3 className={styles.header}>Chats</h3>

      {/* Individual Chats */}
      <div className={styles.friendsSection}>
        <h4 className={styles.subHeader}>Individual Chats</h4>
        {friends.map((friend: any) => (
          <div
            key={friend.friendUserId}
            className={`${styles.chatItem}`}
            onClick={() => handleChatClick(friend)}
          >
            <img src={friend.friendUser.profileImageUrl || '/profile-placeholder.png'} alt="Friend Profile" className={styles.profileImage} />
            <div className={styles.chatInfo}>
              <p className={styles.friendName}>{friend.friendUser.username}</p>
            </div>
          </div>
        ))}
        
      </div>

      <div className={styles.groupsSection}>
        <h4 className={styles.subHeader}>Group Chats</h4>
        {groups.map((group: any) => (
          <div
            key={group.id}
            className={`${styles.chatItem}`}
            onClick={() => handleGroupChatClick(group.id)}
          >
            <div className={styles.groupChatInfo}>
              <p className={styles.groupName}>{group.groupName}</p>
            </div>
            {/* Three dots menu for group chat */}
            <div className={styles.menuContainer}>
              <button
                className={styles.menuButton}
                onClick={() => handleDropdownToggle(group.id)}
              >
                &#x22EE; {/* Vertical ellipsis */}
              </button>

              {dropdownOpen === group.id && (
                <div className={styles.dropdownMenu} ref={dropdownRef}>
                  <button onClick={() => handleAddMemberDropdownToggle(group.id)}>Add Member</button>
                  {addMemberDropdownOpen === group.id && (
                    <div className={styles.addMemberDropdown}>
                      {friends.map((friend: any) => (
                        <button
                          key={friend.friendUserId}
                          onClick={() => handleAddFriendToGroup(group.id, friend.friendUserId, friend.friendUser?.username || 'Unknown')}
                          className={styles.friendButton}
                        >
                          {friend.friendUser?.username || 'Unknown'}
                        </button>
                      ))}
                    </div>
                  )}

                  {group.creatorId === userId && (
                    <button onClick={() => handleDeleteGroupChat(group.id)}>Delete Group</button>
                  )}

                  {group.members?.filter((member: any) => member.userId !== group.creatorId)
                    .map((member: any) => (
                      <button
                        key={member.userId}
                        onClick={() => handleKickMember(group.id, member.userId, userId)}
                        className={styles.memberButton}
                      >
                        Kick {member?.username || member?.user?.username || 'Unknown'}
                      </button>
                    ))}

                  <button onClick={() => handleDeleteMessages(chatId, isGroupChat)}>Clear chat</button>
                </div>
              )}


            </div>
          </div>
        ))}
      </div>

      {/* Create Group Button */}
      <button onClick={() => setModalOpen(true)} className={styles.createGroupButton}>Create Group Chat</button>

    
      {/* Modal for Creating Group Chat */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h4 className={styles.subHeader}>Create Group Chat</h4>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className={styles.groupInput}
            />

            <div className={styles.checkboxContainer}>
              <h5 className={styles.selectFriendsHeader}>Select Friends</h5>
              {friends.map((friend: any) => (
                <div key={friend.friendUserId} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`friend-${friend.friendUserId}`}
                    value={friend.friendUserId}
                    checked={selectedFriends.includes(friend.friendUserId)}
                    onChange={(e) => handleFriendSelection(e, friend.friendUserId)}
                  />
                  <label htmlFor={`friend-${friend.friendUserId}`}>{friend.friendUser.username}</label>
                </div>
              ))}
            </div>

            <button onClick={handleCreateGroupChat} className={styles.createButton}>Create</button>
            <button onClick={() => setModalOpen(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}


    </div>
  );
};

export default ChatList;
