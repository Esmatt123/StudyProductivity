import React, { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import styles from '../Styles/_chatwindow.module.css';
import { v4 as uuidv4 } from 'uuid';
import { FETCH_MESSAGES_QUERY } from '../api/graphql';
import Message from './Message';

interface ChatWindowProps {
  chatId: string | number | null;
  isGroupChat: boolean | null;
  friendUserId: string | null;
  userId: string | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, isGroupChat, friendUserId, userId }) => {
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string; userId: string | null; chatId: string | number | null; }[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<{ id: string; text: string; sender: string; userId: string | null; chatId: string | number | null;}[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const limit = 10;
  const [error, setError] = useState<string>('');
  const [previousChatId, setPreviousChatId] = useState<string | number | null>(null);
  const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  const isMounted = useRef(true);

  // Add this function to handle safe connection operations
  const safeConnectionOperation = async (operation: () => Promise<void>) => {
    try {
      if (connection?.state === signalR.HubConnectionState.Connected) {
        await operation();
      }
    } catch (err) {
      console.error('Connection operation failed:', err);
    }
  };

  const fetchInitialMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: FETCH_MESSAGES_QUERY,
          variables: { chatId: chatId?.toString(), offset: 0, limit },
        }),
      });
  
      if (response.ok) {
        const { data } = await response.json();
        const processedMessages = data.messages.map((msg: any) => ({
          id: msg.messageId,
          text: msg.content,
          sender: msg.user.username,
          userId: msg.user.userId,
          chatId: msg.chatRoomId || msg.groupChatId,
          sentAt: new Date().toLocaleString(),
        })).reverse();
        
        setDisplayedMessages(processedMessages);
        setMessages(processedMessages);
        
        setTimeout(() => {
          messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
        }, 0);
      } else {
        console.error(`Error fetching messages: ${response.statusText}`);
        setError('Failed to load messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  

  const setupEventHandlers = (newConnection: signalR.HubConnection) => {
    newConnection.on('LoadGroupMessages', (groupId: string, messages: any[]) => {
      if (groupId === chatId) {
        const processedMessages = messages.map(msg => ({
          id: msg.messageId.toString(),
          text: msg.content,
          sender: msg.username,
          userId: msg.userId,
          chatId: groupId,
          sentAt: new Date(msg.sentAt).toLocaleString()
        }));

        setDisplayedMessages(processedMessages);
        setTimeout(() => {
          messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
        }, 0);
      }
    });

    newConnection.on('ReceivePrivateMessage', handlePrivateMessage);
    newConnection.on('ReceiveGroupMessage', handleGroupMessage);
    newConnection.on('Error', (errorMessage: string) => {
      console.error('SignalR Error:', errorMessage);
      setError(errorMessage);
    });

    // Add connection state handlers
    newConnection.onreconnecting(() => {
      console.log('Connection reconnecting...');
      setConnectionState('Reconnecting');
    });

    newConnection.onreconnected(() => {
      console.log('Connection reestablished');
      setConnectionState('Connected');
    });

    newConnection.onclose(() => {
      console.log('Connection closed');
      setConnectionState('Disconnected');
    });
  };

   // Move setupSignalRConnection outside of useEffect
   const setupSignalRConnection = async () => {
    try {
      // If there's an existing connection, try to stop it
      if (connection) {
        try {
          await connection.stop();
          setConnection(null);
        } catch (err) {
          console.error('Error stopping existing connection:', err);
        }
      }
  
      const token = localStorage.getItem("token");
      
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/chat`, { 
          accessTokenFactory: () => token || '',
          skipNegotiation: false,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === 0) return 1000;
            if (retryContext.previousRetryCount < 3) return 3000;
            return 5000;
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
  
      setupEventHandlers(newConnection);
  
      // Start the connection and wait for it to be established
      await newConnection.start();
      console.log('SignalR Connected');
  
      // Wait a short moment to ensure connection is stable
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Check if connection is actually connected before proceeding
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        if (isGroupChat && chatId) {
          try {
            const groupIdString = chatId.toString().trim();
            console.log('Joining group:', groupIdString);
            await newConnection.invoke('JoinGroup', groupIdString);
            console.log('Successfully joined group:', groupIdString);
          } catch (groupError) {
            console.error('Error joining group:', groupError);
            // Don't throw here, we still want to set the connection
          }
        }
  
        if (isMounted.current) {
          setConnection(newConnection);
          setError(''); // Clear any existing connection errors
        }
      } else {
        throw new Error('Connection not established after start');
      }
    } catch (err) {
      console.error('Connection failed:', err);
      if (isMounted.current) {
        setError('Failed to establish connection');
      }
      throw err;
    }
  };
 


  



// Update previousChatId when chatId changes
useEffect(() => {
    setPreviousChatId(chatId);
}, [chatId]);

const handleNewMessage = (
  senderUserId: string | null,
  senderUsername: string,
  receivedMessage: string,
  incomingChatId: string | number | null,
) => {
  const newMessage = {
    id: uuidv4(),
    text: receivedMessage,
    sender: senderUsername,
    userId: senderUserId,
    chatId: incomingChatId,
  };

  setMessages((prev) => [...prev, newMessage]);
  setDisplayedMessages((prev) => [...prev, newMessage]);

  setTimeout(() => {
    messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
  }, 0);
};

const handlePrivateMessage = (
  senderUserId: string | null,
  senderUsername: string,
  receivedMessage: string,
  incomingChatRoomId: string | number | null
) => {
  if (incomingChatRoomId === chatId) {
    handleNewMessage(senderUserId, senderUsername, receivedMessage, incomingChatRoomId);
  }
};

const handleGroupMessage = (
  senderUserId: string | null,
  senderUsername: string,
  receivedMessage: string,
  incomingGroupChatId: string | number | null
) => {
  if (incomingGroupChatId === chatId) {
    handleNewMessage(senderUserId, senderUsername, receivedMessage, incomingGroupChatId);
  }
};

  // Add cleanup when switching chats
  useEffect(() => {
    if (previousChatId !== chatId && connection) {
        const switchChat = async () => {
            try {
                // Leave previous group if it was a group chat
                if (previousChatId && isGroupChat) {
                    await safeConnectionOperation(() => 
                        connection.invoke('LeaveGroup', previousChatId.toString())
                    );
                }
                
                // Join new group if switching to a group chat
                if (chatId && isGroupChat) {
                    await safeConnectionOperation(() => 
                        connection.invoke('JoinGroup', chatId.toString())
                    );
                }
                
                // Fetch messages for the new chat
                await fetchInitialMessages();
            } catch (err) {
                console.error('Error switching chats:', err);
            }
        };

        switchChat();
    }
}, [chatId, isGroupChat]); // Include bot

  useEffect(() => {
    const initializeChat = async () => {
      await setupSignalRConnection();
      if (chatId) {
        await fetchInitialMessages();
      }
    };
  
    initializeChat();
  
    return () => {
      if (connection) {
        if (isGroupChat && chatId) {
          connection.invoke('LeaveGroup', chatId.toString())
            .catch(err => console.error('Error leaving group:', err));
        }
        connection.stop()
          .catch(err => console.error('Error stopping connection:', err));
      }
    };
  }, []); 

  useEffect(() => {
    isMounted.current = true;

    const cleanup = async () => {
      if (connection) {
        try {
          if (isGroupChat && chatId) {
            await safeConnectionOperation(() => 
              connection.invoke('LeaveGroup', chatId.toString())
            );
          }
          await connection.stop();
          if (isMounted.current) {
            setConnection(null);
          }
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

// Add forced disconnect handler
useEffect(() => {
    if (connection) {
        connection.on("ForceDisconnect", async () => {
            try {
                await connection.stop();
                setConnection(null);
                console.log("Disconnected by server");
                
                // Attempt to reconnect
                setupSignalRConnection();
            } catch (err) {
                console.error("Error during forced disconnect:", err);
                setError("Connection was forcibly closed");
            }
        });

        return () => {
            connection.off("ForceDisconnect");
        };
    }
}, [connection]);

  

const handleSendMessage = async () => {
  if (!newMessageText.trim()) return;

  // Check connection state and try to reconnect if needed
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    try {
      console.log('Connection not ready, attempting to reconnect...');
      await setupSignalRConnection();
      
      // If still not connected after setup attempt, show error
      if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
        setError('Unable to send message: Connection not established');
        return;
      }
    } catch (err) {
      console.error('Failed to establish connection:', err);
      setError('Unable to send message: Connection failed');
      return;
    }
  }

  const newMessage = {
    id: uuidv4(),
    text: newMessageText,
    sender: "You",
    userId: userId,
    chatId: chatId,
    sentAt: new Date().toLocaleString()
  };

  try {
    if (isGroupChat) {
      console.log("Sending to Group chat:", newMessageText);
      await safeConnectionOperation(async () => {
        await connection.invoke('SendMessageToGroup', chatId, newMessageText);
      });
    } else {
      console.log("Sending to private chat:", newMessageText);
      await safeConnectionOperation(async () => {
        await connection.invoke('SendPrivateMessage', friendUserId, newMessageText, chatId);
        // For private messages, we can add it locally
        setDisplayedMessages(prev => [...prev, newMessage]);
      });
    }
    setNewMessageText('');
  } catch (err) {
    console.error('Failed to send message:', err);
    setError('Failed to send message. Please try again.');
    
    // Optionally try to reconnect on failure
    if (getErrorMessage(err).includes('not in the \'Connected\' State')) {
      try {
        await setupSignalRConnection();
      } catch (reconnectErr) {
        console.error('Failed to reconnect:', reconnectErr);
      }
    }
  }
};

useEffect(() => {
  let checkInterval: NodeJS.Timeout;

  if (connection) {
    checkInterval = setInterval(async () => {
      if (connection.state !== signalR.HubConnectionState.Connected) {
        console.log('Connection lost, attempting to reconnect...');
        try {
          await setupSignalRConnection();
        } catch (err) {
          console.error('Failed to reconnect:', err);
        }
      }
    }, 5000);

    // Add connection state change handler
    connection.onclose(async () => {
      console.log('Connection closed, attempting to reconnect...');
      try {
        await setupSignalRConnection();
      } catch (err) {
        console.error('Failed to reconnect after close:', err);
      }
    });
  }

  return () => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
  };
}, [connection]);

const [connectionState, setConnectionState] = useState<string>('Disconnected');

useEffect(() => {
  if (connection) {
    const updateConnectionState = () => {
      setConnectionState(connection.state);
    };

    connection.onreconnecting(() => setConnectionState('Reconnecting'));
    connection.onreconnected(() => setConnectionState('Connected'));
    connection.onclose(() => setConnectionState('Disconnected'));
    
    // Initial state
    updateConnectionState();
  }
}, [connection]);
  
  
  

  const loadMoreMessages = async () => {
    if (loading || !hasMoreMessages) return;

    setLoading(true);
    console.log("loadmoremessages is invoked")
    // Capture scroll height before loading more messages
    const currentScrollHeight = messageListRef.current?.scrollHeight || 0;

    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: FETCH_MESSAGES_QUERY,
        variables: { chatId: chatId?.toString(), offset: displayedMessages.length, limit },
      }),
    });

    if (response.ok) {
      const { data } = await response.json();
      const additionalMessages = data.messages.map((msg: any) => ({
        id: msg.messageId,
        text: msg.content,
        sender: msg.user.username,
        userId: msg.user.userId,
        chatRoomId: msg.chatRoomId,
        groupChatId: msg.groupChatId,
      }));

      if (additionalMessages.length < limit) setHasMoreMessages(false);
      
      // Reverse additional messages before appending to keep the order with latest at the bottom
      setMessages(prev => [...additionalMessages.reverse(), ...prev]);
      setDisplayedMessages(prev => [...additionalMessages.reverse(), ...prev]);
      
      // Adjust scroll after loading older messages
      setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight - currentScrollHeight;
        }
      }, 0);
    }
    setLoading(false);
  };
  return (
    <div className={styles.chatWindow}>
      <div
        ref={messageListRef}
        className={styles.messageList}
        onScroll={(e) => {
          if (e.currentTarget.scrollTop === 0 && hasMoreMessages) loadMoreMessages();
        }}
      >
        {displayedMessages.map(msg => (
          <Message
          key={msg.id}
          message={{
            id: msg.id,
            sender: msg.userId === userId ? "You" : msg.sender,
            userId: msg.userId,
            content: msg.text,
            sentAt: new Date().toLocaleString(),
          }}
          currentUserId={userId}
        />
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessageText}
          onChange={e => setNewMessageText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className={styles.messageInput}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
