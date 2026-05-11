import { useState } from 'react';

import JoinPage from './pages/JoinPage';
import ChatPage from './pages/ChatPage';

function App() {

  const [joined, setJoined] =
    useState(false);

  const [displayName, setDisplayName] =
    useState('');

  const [roomCode, setRoomCode] =
    useState('');

  const handleJoin = () => {

    if (
      !displayName.trim() ||
      !roomCode.trim()
    ) return;

    setJoined(true);

  };

  const handleSignOut = () => {

    setJoined(false);

    setDisplayName('');

    setRoomCode('');

  };

  if (!joined) {

    return (
      <JoinPage
        displayName={displayName}
        setDisplayName={setDisplayName}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        handleJoin={handleJoin}
      />
    );

  }

  return (
    <ChatPage
      displayName={displayName}
      roomCode={roomCode}
      handleSignOut={handleSignOut}
    />
  );
}

export default App;