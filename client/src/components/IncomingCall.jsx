import {
  FaPhone,
  FaPhoneSlash,
  FaVideo
} from 'react-icons/fa';

function IncomingCall({

  incomingCall,

  answerCall,

  declineCall

}) {

  return (
    <div className="
    fixed
    inset-0
    z-[999]
    flex
    items-center
    justify-center
    bg-black
    ">

      <div className="
      flex
      flex-col
      items-center
      text-white
      ">

        {/* PROFILE */}

        <div className="
        flex
        h-40
        w-40
        items-center
        justify-center
        rounded-full
        bg-slate-700
        text-6xl
        font-bold
        ">

          {
            incomingCall.name
            ?.charAt(0)
            ?.toUpperCase()
          }

        </div>

        {/* NAME */}

        <h1 className="
        mt-8
        text-5xl
        font-bold
        ">
          {incomingCall.name}
        </h1>

        {/* TYPE */}

        <div className="
        mt-5
        flex
        items-center
        gap-3
        text-slate-300
        ">

          {incomingCall.callType ===
          'video' ? (

            <FaVideo />

          ) : (

            <FaPhone />

          )}

          <p className="
          text-xl
          ">
            Incoming
            {' '}
            {incomingCall.callType}
            {' '}
            call
          </p>

        </div>

        {/* BUTTONS */}

        <div className="
        mt-16
        flex
        gap-16
        ">

          {/* DECLINE */}

          <button
            onClick={declineCall}
            className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-red-500
            text-4xl
            text-white
            shadow-2xl
            "
          >
            <FaPhoneSlash />
          </button>

          {/* ACCEPT */}

          <button
            onClick={answerCall}
            className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-green-500
            text-4xl
            text-white
            shadow-2xl
            "
          >
            <FaPhone />
          </button>

        </div>

      </div>

    </div>
  );
}

export default IncomingCall;