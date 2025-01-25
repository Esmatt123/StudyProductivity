import { useContext } from "react";
import { UserIdContext, UserIdContextType } from "./userIdProvider";

export const useUserId = (): UserIdContextType => {
    const context = useContext(UserIdContext);
    if (!context) {
      throw new Error('useUserId must be used within a UserIdProvider');
    }
    return context;
  };