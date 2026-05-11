import { useState }
from 'react';

import EmojiPicker
from 'emoji-picker-react';

import {
  FaSmile,
  FaPaperPlane,
  FaPhone,
  FaVideo,
  FaPaperclip
} from 'react-icons/fa';

function MessageInput({

  currentMessage,

  setCurrentMessage,

  handleSend,

  handleTyping,

  handleVoiceCall,

  handleVideoCall,

  handleFileUpload

}) {

  const [showEmoji,
    setShowEmoji] =
    useState(false);

  return (
    <div className="
    border-t
    border-slate-800
    bg-slate-950/80
    p-5
    relative
    ">

      {showEmoji && (

        <div className="
        absolute
        bottom-24
        left-4
        z-50
        ">

          <EmojiPicker
            onEmojiClick={(emoji) => {

              setCurrentMessage(
                (prev) =>
                  prev + emoji.emoji
              );

            }}
          />

        </div>

      )}

      <div className="
      flex
      items-center
      gap-3
      rounded-3xl
      border
      border-slate-800
      bg-slate-900
      px-4
      py-3
      ">

        <button
          onClick={() =>
            setShowEmoji(
              !showEmoji
            )
          }
          className="
          text-yellow-400
          text-xl
          "
        >
          <FaSmile />
        </button>

        <label className="
        cursor-pointer
        text-slate-300
        text-lg
        ">

          <FaPaperclip />

          <input
            type="file"
            hidden
            onChange={(e) =>
              handleFileUpload(
                e.target.files[0]
              )
            }
          />

        </label>

        <input
          type="text"

          value={currentMessage}

          onChange={(e) => {

            setCurrentMessage(
              e.target.value
            );

            handleTyping();

          }}

          placeholder="Type message..."

          className="
          flex-1
          bg-transparent
          text-white
          outline-none
          "
        />

        <button
          onClick={handleVoiceCall}
          className="
          text-emerald-400
          text-lg
          "
        >
          <FaPhone />
        </button>

        <button
          onClick={handleVideoCall}
          className="
          text-blue-400
          text-lg
          "
        >
          <FaVideo />
        </button>

        <button
          onClick={handleSend}
          className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-violet-600
          text-white
          "
        >
          <FaPaperPlane />
        </button>

      </div>

    </div>
  );
}

export default MessageInput;