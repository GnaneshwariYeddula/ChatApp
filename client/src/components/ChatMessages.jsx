import {
  useEffect,
  useRef
} from 'react';

import MessageBubble
from './MessageBubble';

function ChatMessages({

  messages,

  displayName,

  handleDelete

}) {

  const bottomRef =
    useRef(null);

  useEffect(() => {

    bottomRef.current
      ?.scrollIntoView({
        behavior: 'smooth'
      });

  }, [messages]);

  return (
    <div className="
    flex-1
    overflow-y-auto
    px-6
    py-6
    space-y-5
    ">

      {messages.map((message) => (

        <MessageBubble
          key={message._id}
          message={message}
          isMine={
            message.author ===
            displayName
          }
          handleDelete={
            handleDelete
          }
        />

      ))}

      <div ref={bottomRef} />

    </div>
  );
}

export default ChatMessages;