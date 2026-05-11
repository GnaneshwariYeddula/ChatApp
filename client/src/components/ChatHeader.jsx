import {
  FaMoon,
  FaSun,
  FaTrash
} from 'react-icons/fa';

function ChatHeader({

  selectedChannel,

  displayName,

  handleSignOut,

  onlineUsers,

  darkMode,

  setDarkMode,

  handleClearChat

}) {

  return (
    <header className="
    flex
    items-center
    justify-between
    border-b
    border-slate-800
    px-6
    py-5
    ">

      <div>

        <p className="
        text-sm
        text-slate-500
        ">
          Room
        </p>

        <h2 className="
        mt-1
        text-2xl
        font-semibold
        ">
          {selectedChannel}
        </h2>

      </div>

      <div className="
      flex
      items-center
      gap-3
      ">

        <div className="
        rounded-full
        bg-emerald-500/20
        px-4
        py-2
        text-sm
        text-emerald-400
        ">
          {onlineUsers.length}
          {' '}
          online
        </div>

        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
          className="
          rounded-xl
          bg-slate-800
          p-3
          text-white
          "
        >

          {darkMode
            ? <FaSun />
            : <FaMoon />}

        </button>

        <button
          onClick={handleClearChat}
          className="
          rounded-xl
          bg-red-500
          p-3
          text-white
          "
        >
          <FaTrash />
        </button>

        <button
          onClick={handleSignOut}
          className="
          rounded-2xl
          bg-slate-800
          px-4
          py-2
          text-white
          "
        >
          Sign out
        </button>

      </div>

    </header>
  );
}

export default ChatHeader;