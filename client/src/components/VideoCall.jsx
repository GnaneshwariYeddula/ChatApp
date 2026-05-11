import {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeMute
} from 'react-icons/fa';

function VideoCall({

  localStream,

  remoteStream,

  callType,

  endCall

}) {

  /*
  =====================
  REFS
  =====================
  */

  const localVideo =
    useRef(null);

  const remoteVideo =
    useRef(null);

  const remoteAudio =
    useRef(null);

  /*
  =====================
  STATES
  =====================
  */

  const [muted,
    setMuted] =
    useState(false);

  const [cameraOff,
    setCameraOff] =
    useState(false);

  const [speakerOn,
    setSpeakerOn] =
    useState(true);

  const [seconds,
    setSeconds] =
    useState(0);

  /*
  =====================
  TIMER
  =====================
  */

  useEffect(() => {

    const interval =
      setInterval(() => {

        setSeconds(
          (prev) =>
            prev + 1
        );

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  /*
  =====================
  FORMAT TIME
  =====================
  */

  const formatTime =
    () => {

      const mins =
        Math.floor(
          seconds / 60
        );

      const secs =
        seconds % 60;

      return `
      ${
        mins
          .toString()
          .padStart(
            2,
            '0'
          )
      }:${
        secs
          .toString()
          .padStart(
            2,
            '0'
          )
      }
      `;

    };

  /*
  =====================
  LOCAL STREAM
  =====================
  */

  useEffect(() => {

    if (
      localVideo.current &&
      localStream
    ) {

      localVideo.current.srcObject =
        localStream;

    }

  }, [localStream]);

  /*
  =====================
  REMOTE STREAM
  =====================
  */

  useEffect(() => {

    /*
    VIDEO
    */

    if (
      remoteVideo.current &&
      remoteStream
    ) {

      remoteVideo.current.srcObject =
        remoteStream;

    }

    /*
    AUDIO
    */

    if (
      remoteAudio.current &&
      remoteStream
    ) {

      remoteAudio.current.srcObject =
        remoteStream;

      remoteAudio.current
        .play()
        .catch(() => {});

    }

  }, [remoteStream]);

  /*
  =====================
  TOGGLE MIC
  =====================
  */

  const toggleMute =
    () => {

      localStream
        ?.getAudioTracks()
        .forEach((track) => {

          track.enabled =
            !track.enabled;

        });

      setMuted(
        !muted
      );

    };

  /*
  =====================
  TOGGLE CAMERA
  =====================
  */

  const toggleCamera =
    () => {

      localStream
        ?.getVideoTracks()
        .forEach((track) => {

          track.enabled =
            !track.enabled;

        });

      setCameraOff(
        !cameraOff
      );

    };

  /*
  =====================
  SPEAKER
  =====================
  */

  const toggleSpeaker =
    () => {

      if (
        remoteAudio.current
      ) {

        remoteAudio.current.muted =
          speakerOn;

      }

      setSpeakerOn(
        !speakerOn
      );

    };

  return (
    <div className="
    fixed
    inset-0
    z-[999]
    bg-black
    ">

      {/* AUDIO */}

      <audio
        ref={remoteAudio}
        autoPlay
      />

      {/* REMOTE VIDEO */}

      {callType ===
      'video' ? (

        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          className="
          h-full
          w-full
          object-cover
          "
        />

      ) : (

        <div className="
        flex
        h-full
        flex-col
        items-center
        justify-center
        text-white
        ">

          <div className="
          flex
          h-44
          w-44
          items-center
          justify-center
          rounded-full
          bg-slate-700
          text-7xl
          ">
            📞
          </div>

          <p className="
          mt-8
          text-5xl
          font-bold
          ">
            Voice Call
          </p>

          <p className="
          mt-4
          text-2xl
          text-slate-300
          ">
            {formatTime()}
          </p>

        </div>

      )}

      {/* CALL TIMER */}

      {callType ===
      'video' && (

        <div className="
        absolute
        top-8
        left-1/2
        -translate-x-1/2
        rounded-full
        bg-black/50
        px-6
        py-3
        text-xl
        text-white
        backdrop-blur-md
        ">

          {formatTime()}

        </div>

      )}

      {/* LOCAL VIDEO */}

      {callType ===
        'video' && (

        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          className="
          absolute
          bottom-36
          right-6
          h-60
          w-44
          rounded-3xl
          border-4
          border-white
          object-cover
          shadow-2xl
          "
        />

      )}

      {/* CONTROLS */}

      <div className="
      absolute
      bottom-8
      left-1/2
      flex
      -translate-x-1/2
      gap-6
      ">

        {/* MIC */}

        <button
          onClick={toggleMute}
          className={`
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          text-3xl
          text-white
          shadow-2xl

          ${
            muted

            ? 'bg-yellow-500'

            : 'bg-slate-700'
          }
          `}
        >

          {muted
            ? <FaMicrophoneSlash />
            : <FaMicrophone />
          }

        </button>

        {/* SPEAKER */}

        <button
          onClick={
            toggleSpeaker
          }
          className={`
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          text-3xl
          text-white
          shadow-2xl

          ${
            speakerOn

            ? 'bg-slate-700'

            : 'bg-yellow-500'
          }
          `}
        >

          {speakerOn
            ? <FaVolumeUp />
            : <FaVolumeMute />
          }

        </button>

        {/* CAMERA */}

        {callType ===
          'video' && (

          <button
            onClick={
              toggleCamera
            }
            className={`
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            text-3xl
            text-white
            shadow-2xl

            ${
              cameraOff

              ? 'bg-yellow-500'

              : 'bg-slate-700'
            }
            `}
          >

            {cameraOff
              ? <FaVideoSlash />
              : <FaVideo />
            }

          </button>

        )}

        {/* END CALL */}

        <button
          onClick={endCall}
          className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-3xl
          text-white
          shadow-2xl
          "
        >

          <FaPhoneSlash />

        </button>

      </div>

    </div>
  );
}

export default VideoCall;