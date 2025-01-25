import { FunctionComponent } from 'react';
import styles from '../Styles/_message.module.css'; // Adjust the path according to your file structure

interface MessageProps {
  message: {
    id: string;
    sender: string
    userId: string | null; // The ID of the user who sent the message
    content: string;
    sentAt: string;
  };
  currentUserId: string | null; // The ID of the current user
}

const Message: FunctionComponent<MessageProps> = ({ message, currentUserId }) => {
  const isCurrentUser = message.userId === currentUserId;

  return (
    <div className={styles.messageContainer}>
      <p className={`${styles.senderName} ${isCurrentUser ? styles.outgoingName : styles.incomingName}`}>
        {isCurrentUser ? 'You' : message.sender } {/* You can replace 'Other User' with the actual sender's name */}
      </p>
      <div className={`${styles.messageBubble} ${isCurrentUser ? styles.outgoing : styles.incoming}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
