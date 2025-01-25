import React, { useState, useEffect } from 'react';
import ChatList from '../src/Components/ChatList';
import ChatWindow from '../src/Components/ChatWindow';
import SearchBar from '../src/Components/SearchBar';
import styles from '../src/Styles/_chatPage.module.css';
import { useUserId } from '../src/providers/useUserId';

const ChatPage: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | number | null>(null);
  const [friendUserId, setFriendUserId] = useState<string | null>(null);
  const [isGroupChat, setIsGroupChat] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { userId } = useUserId()


  const handleSetActiveChat = (chatId: string | number | null, isGroup: boolean | null) => {
    setActiveChatId(chatId);
    setIsGroupChat(isGroup);
  };

  return (
    <div className={styles.chatPage}>
      <div className={`${styles.sidebar}`}>
        <SearchBar userId={userId} />
        <ChatList setChatId={setActiveChatId} chatId={activeChatId} setActiveChat={handleSetActiveChat} friendUserId={friendUserId} setFriendUserId={setFriendUserId} isGroupChat={isGroupChat} userId={userId}/>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : activeChatId ? (
        <div className={styles.chatWindow}>
          <ChatWindow chatId={activeChatId} isGroupChat={isGroupChat} friendUserId={friendUserId} userId={userId} />
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
