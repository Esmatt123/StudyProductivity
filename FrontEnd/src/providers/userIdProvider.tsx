import React, { createContext, useState, useEffect, FunctionComponent, PropsWithChildren } from 'react';

export type UserIdContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
};

export const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export const UserIdProvider: FunctionComponent<PropsWithChildren<{}>> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Load initial userId from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      document.cookie = `userId=${userId}; path=/;`;
    } else {
      document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, [userId]);

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};