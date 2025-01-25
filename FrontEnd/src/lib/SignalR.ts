import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { Delta } from 'quill/core';
import { useEffect, useState } from 'react';

let connection: HubConnection | null = null;

export function setupSignalR(documentId: string) {
    if (connection) return;
    const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;

    connection = new HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/document`)
        .build();

    connection.start()
        .then(() => {
            console.log("Connected to SignalR");

            // Request the document
            connection!.invoke("GetDocument", documentId).catch(err => console.error(err));

            // Listen for document load
            connection!.on("LoadDocument", (data) => {
                console.log("Document loaded:", data);
                // Handle loading document
            });

            // Listen for changes sent by other clients
            connection!.on("ReceiveChanges", (delta) => {
                console.log("Received changes:", delta);
                // Handle applying changes
            });
        })
        .catch(err => console.error("Connection failed: ", err));
}

export function sendChanges(documentId: string, delta: Delta) {
    if (connection) {
        // Serialize delta to JSON string if necessary
        const deltaString = JSON.stringify(delta);
        connection.invoke("SendChanges", documentId, deltaString)
            .catch(err => console.error('Error sending changes: ', err));
    }
}


export function SaveDocument(documentId: string, data: string) {
    if (connection) {
        console.log(`Sending document with ID: ${documentId} and data: ${data}`);
        
        connection.invoke("SaveDocument", documentId, data)
            .catch(err => console.error('Error saving document: ', err));
    }
}

export const useSignalR = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [onGroupChatCreated, setOnGroupChatCreated] = useState<(groupId: string, groupName: string) => void>(() => {});
    const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;
  
    useEffect(() => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(`${BACKEND_URL}/hubs/chat`)  // Adjust URL based on your API route
        .withAutomaticReconnect()
        .build();
  
      setConnection(newConnection);
      
      newConnection.start()
        .then(() => console.log("SignalR connected"))
        .catch(err => console.error("SignalR connection error:", err));
  
      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
    }, []);
  
    useEffect(() => {
      if (connection) {
        connection.on("GroupChatCreated", (groupId, groupName) => {
          if (onGroupChatCreated) {
            onGroupChatCreated(groupId, groupName);  // Trigger the callback when a group chat is created
          }
        });
      }
    }, [connection, onGroupChatCreated]);
  
    const createGroupChat = async (groupName: string, userIds: string[]) => {
      if (connection) {
        try {
          await connection.invoke("CreateGroupChat", groupName, userIds);  // Invokes the SignalR method to create a group chat
        } catch (err) {
          console.error("Error creating group chat:", err);
        }
      }
    };
  
    return {
      createGroupChat,
      setOnGroupChatCreated
    };
  };

