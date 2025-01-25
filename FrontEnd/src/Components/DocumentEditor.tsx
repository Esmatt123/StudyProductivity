import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/router';
import { Delta } from 'quill/core';
import { fetchCanWritePermission } from '../api/graphql';



// Constants
const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

interface DocumentEditorProps{
  userId: string | null;
}

const DocumentEditor: FunctionComponent<DocumentEditorProps> = () => {
  const router = useRouter();
  const { id: documentId } = router.query;
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [userCursors, setUserCursors] = useState<Map<string, number>>(new Map());
  const [canWrite, setCanWrite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND_URL: string | undefined = process.env.NEXT_PUBLIC_VITE_BACKEND_URL;

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    setCurrentUserId(userId);
  }, [])
  
  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${BACKEND_URL}/hubs/document`, {
        skipNegotiation: false, // Important for Azure SignalR
        transport: HttpTransportType.WebSockets
    }).withAutomaticReconnect()
      .build();

      

    newConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR');

        // Request the document and permissions
        newConnection
          .invoke('GetDocument', documentId, currentUserId)
          .catch((err) => console.error('Error requesting document: ', err));

        // Listen for document load and permissions
        newConnection.on('LoadDocument', (data) => {
          console.log('Document loaded:', data);
          if (quill) {
            const { content } = JSON.parse(data); // Assuming 'permissions' includes 'canWrite'
            quill.setContents(content); // Load the document data into Quill

            quill.disable()
          }
        });

        // Listen for changes sent by other clients
        newConnection.on('ReceiveChanges', (delta) => {
          if (quill) {
            quill.updateContents(delta);
          }
        });

        // Listen for cursor position updates
        newConnection.on('ReceiveCursorPosition', (currentUserId, index) => {
          setUserCursors((prev) => new Map(prev).set(currentUserId, index));
        });

        setConnection(newConnection);
      })
      .catch(() => {
        console.log('connection disconnected')
      });

    return () => {
      newConnection.stop();
    };
  }, [currentUserId, documentId, quill, router]);

  useEffect(() => {
    if (connection == null || quill == null || !documentId) return;

    const changeHandler = (delta: Delta, oldDelta: Delta, source: string) => {
      if (source !== 'user') return;

      connection
        .invoke('SendChanges', documentId, delta)
        .catch((err) => console.error('Error sending changes: ', err));
    };

    quill.on('text-change', changeHandler);

    return () => {
      quill.off('text-change', changeHandler);
    };
  }, [connection, quill, documentId]);

  useEffect(() => {
    if (!documentId || !currentUserId) return;

    const fetchPermissions = async () => {
      try {
        const permission = await fetchCanWritePermission(documentId, currentUserId);
        setCanWrite(permission);
        if (quill) {
          if (permission) {
            quill.enable();
          } else {
            quill.disable();
          }
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [documentId, currentUserId, quill]);

  // Load document and enable Quill
  useEffect(() => {
    if (connection == null || quill == null || !documentId || !currentUserId) return;

    connection!.on("LoadDocument", (documentData) => {
      console.log('Received document data:', documentData);
      try {
        if (!documentData) {
          quill.setContents([{ insert: '\n' }]);
          return;
        }

        const parsedData = JSON.parse(documentData);
        
        // Check if we have content
        if (parsedData.content) {
          const content = typeof parsedData.content === 'string' 
            ? JSON.parse(parsedData.content)
            : parsedData.content;
          
          quill.setContents(content);
        } else {
          quill.setContents([{ insert: '\n' }]);
        }

        // Update Quill state based on permissions
        if (canWrite) {
          quill.enable();
        } else {
          quill.disable();
        }
      } catch (e) {
        console.error('Error parsing document data:', e);
        quill.setContents([{ insert: '\n' }]);
      }
    });

    return () => {
      connection.off("LoadDocument");
    };
  }, [connection, quill, documentId, canWrite, currentUserId]);

  // Auto-save document at intervals
  useEffect(() => {
    if (connection == null || quill == null || !documentId) return;

    const interval = setInterval(() => {
      const contents = quill.getContents();
      connection.invoke("SaveDocument", documentId, JSON.stringify(contents))
        .catch(err => console.error('Error saving document: ', err));
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [connection, quill, documentId]);

  

  

  // Initialize Quill editor
  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
    q.setText('');
  }, []);

 

  const renderCursors = useCallback(() => {
    if (quill) {
      userCursors.forEach((index, currentUserId) => {
        const bounds = quill.getBounds(index);
        if (bounds) {
          let cursorElement = document.querySelector(`.cursor-${currentUserId}`) as HTMLDivElement;
          const editor = document.querySelector('.ql-editor') as HTMLDivElement;
          const qlContainer = document.querySelector('.ql-container') as HTMLDivElement;
          const docEdContainer = document.querySelector('.docEdContainer');
  
          // Initialize cursor element if it doesn't exist
          if (!cursorElement) {
            cursorElement = document.createElement('div');
            cursorElement.className = `cursor-${currentUserId}`;
            cursorElement.style.position = 'absolute';
            cursorElement.style.width = '2px';
            cursorElement.style.zIndex = '500';
            cursorElement.style.backgroundColor = getColorForUser(currentUserId);
            cursorElement.style.transition = 'left 0.01s, top 0.01s';
  
            docEdContainer?.appendChild(cursorElement);
          }
  
          const editorBounds = editor?.getBoundingClientRect();
          const qlContainerBounds = qlContainer?.getBoundingClientRect();
          if (qlContainerBounds) {
            // Calculate left and top based on the bounds and editor position
            const left = (bounds.left - 1) + qlContainerBounds.left;
            const top = (bounds.top) + qlContainerBounds.top;
  
            // Constrain cursor position within the editor's bounds
            const constrainedLeft = Math.max(editorBounds.left, Math.min(left, editorBounds.right - 96));
            const constrainedTop = Math.max(editorBounds.top, Math.min(top, editorBounds.bottom - bounds.height));
  
            // Apply constrained positions to the cursor element
            cursorElement.style.left = `${constrainedLeft}px`;
            cursorElement.style.top = `${constrainedTop}px`;
            cursorElement.style.height = `${bounds.height}px`;
            cursorElement.style.width = '2px';
          }
        } else {
          console.error('Bounds is null for user:', currentUserId);
        }
      });
    }
  }, [quill, userCursors]);
  

// Use ResizeObserver to handle window and editor resizing
useEffect(() => {
  
  renderCursors()
  if (connection == null || quill == null || !documentId || currentUserId == null) return;

  const handleCursorChange = () => {
    if (quill) {
      const range = quill.getSelection();

      if (range) {
        console.log(`User: ${currentUserId}, Cursor Position: ${range.index}`);

        if (connection?.state === 'Connected') {
          connection.invoke("UpdateCursorPosition", documentId, currentUserId, range.index)
            .catch(err => console.error('Error updating cursor position: ', err));
        } else {
          console.error('Connection is not in Connected state:', connection.state);
        }
      }
    }
  };

  const mainContent = document.querySelector('.mainContent') as HTMLElement;

    const handleEvent = () => {
      renderCursors();
    };

    if (connection) connection.on('ReceiveChanges', handleEvent);

    if (mainContent) {
      mainContent.addEventListener('scroll', handleEvent);
      window.addEventListener('resize', handleEvent);
    }

  


  quill.on("editor-change", handleCursorChange);

  

  return () => {
    quill.off("editor-change", handleCursorChange);
    if (connection) connection.off('ReceiveChanges', handleEvent);

      if (mainContent) {
        mainContent.removeEventListener('scroll', handleEvent);
        window.removeEventListener('resize', handleEvent);
      }
  };
}, [connection, documentId, quill, renderCursors, router, currentUserId]);


  


  // Function to assign a color to each user
  const getColorForUser = (userId: string) => {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow'];
    const index = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="docEdContainer">
      <div className="container" ref={wrapperRef}></div>
    </div>
  );
};

export default DocumentEditor;


