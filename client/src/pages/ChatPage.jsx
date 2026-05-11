import {
  useEffect,
  useRef,
  useState
} from 'react';

import axios from 'axios';

import Peer from 'simple-peer';

import EmojiPicker from 'emoji-picker-react';

import {
  FaPhone,
  FaVideo,
  FaTrash,
  FaSignOutAlt,
  FaEdit,
  FaTimes,
  FaPaperclip,
  FaCheck,
  FaCheckDouble
} from 'react-icons/fa';

import {
  socket
} from '../context/SocketContext';

import VideoCall from '../components/VideoCall';

import IncomingCall from '../components/IncomingCall';

import CallingScreen from '../components/CallingScreen';

function ChatPage({

  displayName,

  roomCode,

  handleSignOut

}) {

  const [messages,
    setMessages] =
    useState([]);

  const [currentMessage,
    setCurrentMessage] =
    useState('');

  const [onlineUsers,
    setOnlineUsers] =
    useState([]);

  const [typingUser,
    setTypingUser] =
    useState('');

  const [showEmojiPicker,
    setShowEmojiPicker] =
    useState(false);

  const [incomingCall,
    setIncomingCall] =
    useState(null);

  const [callAccepted,
    setCallAccepted] =
    useState(false);

  const [callEnded,
    setCallEnded] =
    useState(false);

  const [isCalling,
    setIsCalling] =
    useState(false);

  const [stream,
    setStream] =
    useState(null);

  const [remoteStream,
    setRemoteStream] =
    useState(null);

  const [callerName,
    setCallerName] =
    useState('');

  const [callType,
    setCallType] =
    useState('video');

  const [targetUserId,
    setTargetUserId] =
    useState(null);

  const connectionRef =
    useRef();

  const messagesEndRef =
    useRef(null);

  useEffect(() => {

    socket.emit(
      'joinRoom',
      {

        name:
          displayName,

        room:
          roomCode

      }
    );

    socket.on(
      'previousMessages',
      (oldMessages) => {

        setMessages(
          oldMessages
        );

      }
    );

    socket.on(
      'message',
      (message) => {

        setMessages((prev) => [
          ...prev,
          message
        ]);

      }
    );

    socket.on(
      'messagesUpdated',
      (updatedMessages) => {

        setMessages(
          updatedMessages
        );

      }
    );

    socket.on(
      'onlineUsers',
      (users) => {

        setOnlineUsers(
          users
        );

      }
    );

    socket.on(
      'typing',
      (name) => {

        setTypingUser(name);

        setTimeout(() => {

          setTypingUser('');

        }, 1500);

      }
    );

    socket.on(
      'incoming-call',
      (data) => {

        setIncomingCall(data);

        setCallEnded(false);

      }
    );

    socket.on(
      'call-accepted',
      (signal) => {

        setCallAccepted(true);

        setIsCalling(false);

        connectionRef
          .current
          ?.signal(signal);

      }
    );

    socket.on(
      'call-ended',
      () => {

        leaveCall(false);

      }
    );

    return () => {

      socket.off();

    };

  }, []);

  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior:
          'smooth'

      });

    messages.forEach((msg) => {

      if (
        msg.author !==
          displayName &&
        !msg.seen
      ) {

        socket.emit(
          'messageSeen',
          {

            room:
              roomCode,

            messageId:
              msg.id

          }
        );

      }

    });

  }, [messages]);

  /*
  =====================
  SEND MESSAGE
  =====================
  */

  const handleSend =
    () => {

      if (
        !currentMessage.trim()
      ) return;

      socket.emit(
        'sendMessage',
        {

          room:
            roomCode,

          author:
            displayName,

          text:
            currentMessage,

          time:
            new Date()
              .toLocaleTimeString()

        }
      );

      setCurrentMessage('');

    };

  /*
  =====================
  FILE SHARE
  =====================
  */

  const handleFileUpload =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        'file',
        file
      );

      try {

        const res =
          await axios.post(

            'http://localhost:5000/upload',

            formData
          );

        socket.emit(
          'sendMessage',
          {

            room:
              roomCode,

            author:
              displayName,

            text:
              '',

            file:
              res.data.file,

            fileName:
              file.name,

            isImage:
              file.type.startsWith(
                'image'
              ),

            time:
              new Date()
                .toLocaleTimeString()

          }
        );

      } catch (err) {

        console.log(err);

      }

    };

  /*
  =====================
  EDIT MESSAGE
  =====================
  */

  const editMessage =
    (msg) => {

      const newText =
        prompt(
          'Edit Message',
          msg.text
        );

      if (!newText) return;

      socket.emit(
        'editMessage',
        {

          room:
            roomCode,

          messageId:
            msg.id,

          newText

        }
      );

    };

  /*
  =====================
  DELETE MESSAGE
  =====================
  */

  const deleteMessage =
    (msg) => {

      socket.emit(
        'deleteMessage',
        {

          room:
            roomCode,

          messageId:
            msg.id

        }
      );

    };

  /*
  =====================
  TYPING
  =====================
  */

  const handleTyping =
    () => {

      socket.emit(
        'typing',
        {

          room:
            roomCode,

          name:
            displayName

        }
      );

    };

  /*
  =====================
  CLEAR CHAT
  =====================
  */

  const clearChat =
    () => {

      setMessages([]);

      socket.emit(
        'clearChat',
        roomCode
      );

    };

  /*
  =====================
  LEAVE ROOM
  =====================
  */

  const leaveRoom =
    () => {

      socket.emit(
        'leaveRoom'
      );

      handleSignOut();

    };

  /*
  =====================
  START CALL
  =====================
  */

  const startCall =
    async (type) => {

      const filteredUsers =
        onlineUsers.filter(
          (user) =>
            user.id !== socket.id
        );

      if (
        filteredUsers.length === 0
      ) {

        alert(
          'No user online'
        );

        return;

      }

      const otherUser =
        filteredUsers[0];

      setCallerName(
        otherUser.name
      );

      setTargetUserId(
        otherUser.id
      );

      setCallType(type);

      setIsCalling(true);

      setCallEnded(false);

      const currentStream =
        await navigator
          .mediaDevices
          .getUserMedia({

            video:
              type === 'video',

            audio:
              true

          });

      setStream(currentStream);

      const peer =
        new Peer({

          initiator:
            true,

          trickle:
            false,

          stream:
            currentStream

        });

      peer.on(
        'signal',
        (data) => {

          socket.emit(
            'call-user',
            {

              userToCall:
                otherUser.id,

              signalData:
                data,

              from:
                socket.id,

              name:
                displayName,

              callType:
                type

            }
          );

        }
      );

      peer.on(
        'stream',
        (remote) => {

          setRemoteStream(remote);

        }
      );

      connectionRef.current =
        peer;

    };

  /*
  =====================
  ANSWER CALL
  =====================
  */

  const answerCall =
    async () => {

      setCallAccepted(true);

      setCallEnded(false);

      setCallType(
        incomingCall.callType
      );

      setTargetUserId(
        incomingCall.from
      );

      const currentStream =
        await navigator
          .mediaDevices
          .getUserMedia({

            video:
              incomingCall.callType ===
              'video',

            audio:
              true

          });

      setStream(currentStream);

      const peer =
        new Peer({

          initiator:
            false,

          trickle:
            false,

          stream:
            currentStream

        });

      peer.on(
        'signal',
        (data) => {

          socket.emit(
            'answer-call',
            {

              signal:
                data,

              to:
                incomingCall.from

            }
          );

        }
      );

      peer.on(
        'stream',
        (remote) => {

          setRemoteStream(remote);

        }
      );

      peer.signal(
        incomingCall.signal
      );

      connectionRef.current =
        peer;

      setIncomingCall(null);

    };

  /*
  =====================
  DECLINE CALL
  =====================
  */

  const declineCall =
    () => {

      setIncomingCall(null);

    };

  /*
  =====================
  END CALL
  =====================
  */

  const leaveCall =
    (notify = true) => {

      if (
        notify &&
        targetUserId
      ) {

        socket.emit(
          'end-call',
          {

            to:
              targetUserId

          }
        );

      }

      setCallEnded(true);

      setCallAccepted(false);

      setIncomingCall(null);

      setIsCalling(false);

      setRemoteStream(null);

      stream
        ?.getTracks()
        .forEach((track) => {

          track.stop();

        });

      connectionRef.current
        ?.destroy();

    };

  return (
    <>
      {incomingCall &&
        !callAccepted && (

        <IncomingCall
          incomingCall={
            incomingCall
          }
          answerCall={
            answerCall
          }
          declineCall={
            declineCall
          }
        />

      )}

      {isCalling &&
        !callAccepted && (

        <CallingScreen
          callerName={
            callerName
          }
          callType={
            callType
          }
          cancelCall={
            leaveCall
          }
        />

      )}

      {callAccepted &&
        !callEnded && (

        <VideoCall
          localStream={
            stream
          }
          remoteStream={
            remoteStream
          }
          callType={
            callType
          }
          endCall={
            leaveCall
          }
        />

      )}

      <div className="
      flex
      h-screen
      bg-slate-950
      text-white
      ">

        {/* SIDEBAR */}

        <div className="
        flex
        w-[320px]
        flex-col
        border-r
        border-slate-800
        bg-slate-900
        ">

          <div className="p-5">

            <h1 className="
            text-2xl
            font-bold
            ">
              ChatApp
            </h1>

            <p className="
            mt-2
            text-sm
            text-slate-400
            ">
              Online:
              {' '}
              {onlineUsers.length}
            </p>

          </div>

          <div className="
          flex-1
          overflow-y-auto
          px-3
          ">

            {onlineUsers.map(
              (user, index) => (

                <div
                  key={index}
                  className="
                  mb-2
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-slate-800
                  p-3
                  "
                >

                  <div className="
                  h-3
                  w-3
                  rounded-full
                  bg-green-500
                  " />

                  <p>
                    {user.name}
                  </p>

                </div>

              )
            )}

          </div>

          <div className="p-4">

            <button
              onClick={leaveRoom}
              className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-red-500
              py-3
              "
            >

              <FaSignOutAlt />

              Leave Room

            </button>

          </div>

        </div>

        {/* CHAT AREA */}

        <div className="
        flex
        flex-1
        flex-col
        ">

          {/* HEADER */}

          <div className="
          flex
          items-center
          justify-between
          border-b
          border-slate-800
          bg-slate-900
          px-6
          py-4
          ">

            <div>

              <h2 className="
              text-xl
              font-bold
              ">
                {displayName}
              </h2>

              <p className="
              text-sm
              text-slate-400
              ">
                {typingUser}
              </p>

            </div>

            <div className="
            flex
            gap-3
            ">

              <button
                onClick={() =>
                  startCall('voice')
                }
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-green-500
                "
              >
                <FaPhone />
              </button>

              <button
                onClick={() =>
                  startCall('video')
                }
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-indigo-500
                "
              >
                <FaVideo />
              </button>

              <button
                onClick={clearChat}
                className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-500
                "
              >
                <FaTrash />
              </button>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="
          flex-1
          overflow-y-auto
          p-6
          ">

            <div className="
            flex
            flex-col
            gap-4
            ">

              {messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={`
                    flex
                    ${
                      msg.author ===
                      displayName
                        ? 'justify-end'
                        : 'justify-start'
                    }
                    `}
                  >

                    <div className="
                    relative
                    max-w-[75%]
                    ">

                      <div className={`
                      rounded-2xl
                      px-4
                      py-3
                      shadow-lg
                      break-words

                      ${
                        msg.author ===
                        displayName
                          ? 'bg-indigo-500'
                          : 'bg-slate-800'
                      }
                      `}>

                        <div className="
                        mb-2
                        flex
                        items-center
                        justify-between
                        gap-3
                        ">

                          <p className="
                          text-xs
                          opacity-70
                          ">
                            {msg.author}
                          </p>

                          {msg.author ===
                            displayName && (

                            <div className="
                            flex
                            items-center
                            gap-2
                            ">

                              <button
                                onClick={() =>
                                  editMessage(msg)
                                }
                                className="
                                flex
                                items-center
                                gap-1
                                rounded-lg
                                bg-yellow-500
                                px-2
                                py-1
                                text-xs
                                "
                              >

                                <FaEdit />

                              </button>

                              <button
                                onClick={() =>
                                  deleteMessage(msg)
                                }
                                className="
                                flex
                                items-center
                                gap-1
                                rounded-lg
                                bg-red-500
                                px-2
                                py-1
                                text-xs
                                "
                              >

                                <FaTimes />

                              </button>

                            </div>

                          )}

                        </div>

                        {/* TEXT */}

                        {msg.text && (

                          <p
                            className="
                            whitespace-pre-wrap
                            break-words
                            text-[15px]
                            leading-6
                            "
                            style={{
                              fontFamily:
                                '"Segoe UI Emoji", "Noto Color Emoji", sans-serif'
                            }}
                          >
                            {msg.text}
                          </p>

                        )}

                        {/* IMAGE */}

                        {msg.isImage && (

                          <img
                            src={msg.file}
                            alt=""
                            className="
                            mt-3
                            max-h-80
                            rounded-2xl
                            "
                          />

                        )}

                        {/* FILE */}

                        {!msg.isImage &&
                          msg.file && (

                          <a
                            href={msg.file}
                            target="_blank"
                            rel="noreferrer"
                            className="
                            mt-3
                            block
                            text-blue-300
                            underline
                            "
                          >
                            📎
                            {' '}
                            {msg.fileName}
                          </a>

                        )}

                        {/* BOTTOM */}

                        <div className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        text-xs
                        opacity-70
                        ">

                          <span>
                            {msg.time}
                          </span>

                          {msg.author ===
                            displayName && (

                            <div className="
                            flex
                            items-center
                            gap-1
                            ">

                              {msg.seen ? (

                                <FaCheckDouble />

                              ) : (

                                <FaCheck />

                              )}

                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          </div>

          {/* INPUT */}

          <div className="
          border-t
          border-slate-800
          bg-slate-900
          p-5
          ">

            <div className="
            flex
            items-center
            gap-4
            ">

              {/* EMOJI */}

              <button
                onClick={() =>
                  setShowEmojiPicker(
                    !showEmojiPicker
                  )
                }
                className="
                text-3xl
                "
              >
                😊
              </button>

              {/* FILE */}

              <label className="
              cursor-pointer
              text-2xl
              ">

                <FaPaperclip />

                <input
                  type="file"
                  hidden
                  onChange={
                    handleFileUpload
                  }
                />

              </label>

              {showEmojiPicker && (

                <div className="
                absolute
                bottom-24
                left-[360px]
                z-50
                ">

                  <EmojiPicker
                    onEmojiClick={
                      (emojiData) => {

                        setCurrentMessage(
                          (prev) =>
                            prev +
                            emojiData.emoji
                        );

                      }
                    }
                  />

                </div>

              )}

              <input
                value={
                  currentMessage
                }
                onChange={(e) =>
                  setCurrentMessage(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleTyping
                }
                onKeyPress={(e) => {

                  if (
                    e.key ===
                    'Enter'
                  ) {

                    handleSend();

                  }

                }}
                placeholder="
                Type message...
                "
                className="
                flex-1
                rounded-2xl
                bg-slate-800
                px-5
                py-4
                outline-none
                "
              />

              <button
                onClick={
                  handleSend
                }
                className="
                rounded-2xl
                bg-indigo-500
                px-8
                py-4
                "
              >
                Send
              </button>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default ChatPage;