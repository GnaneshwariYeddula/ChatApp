import {
  FaPhoneSlash,
  FaPhone,
  FaVideo
} from 'react-icons/fa';

function CallingScreen({

  callerName,

  callType,

  cancelCall

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
            callerName
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
          {callerName}
        </h1>

        {/* STATUS */}

        <div className="
        mt-5
        flex
        items-center
        gap-3
        text-slate-300
        ">

          {callType ===
          'video' ? (

            <FaVideo />

          ) : (

            <FaPhone />

          )}

          <p className="
          animate-pulse
          text-xl
          ">
            Calling...
          </p>

        </div>

        {/* END BUTTON */}

        <div className="
        mt-16
        ">

          <button
            onClick={cancelCall}
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

        </div>

      </div>

    </div>
  );
}

export default CallingScreen;