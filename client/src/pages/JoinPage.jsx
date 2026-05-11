import { useState } from 'react';

function JoinPage({
  displayName,
  setDisplayName,
  roomCode,
  setRoomCode,
  handleJoin
}) {

  const generateRoomCode = () => {

    const randomCode =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    setRoomCode(randomCode);

  };

  return (
    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-slate-950
    px-4
    ">

      <div className="
      w-full
      max-w-md
      rounded-3xl
      border
      border-slate-800
      bg-slate-900/90
      p-8
      shadow-2xl
      ">

        <div className="mb-8">

          <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-violet-400
          ">
            Real-Time Chat
          </p>

          <h1 className="
          mt-4
          text-4xl
          font-bold
          text-white
          ">
            Join Room
          </h1>

          <p className="
          mt-3
          text-slate-400
          ">
            Create or join a room using a code.
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="
            mb-2
            block
            text-sm
            text-slate-300
            ">
              Display Name
            </label>

            <input
              type="text"
              value={displayName}
              onChange={(e) =>
                setDisplayName(e.target.value)
              }
              placeholder="Enter your name"
              className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-950
              px-4
              py-3
              text-white
              outline-none
              focus:border-violet-500
              "
            />

          </div>

          <div>

            <label className="
            mb-2
            block
            text-sm
            text-slate-300
            ">
              Room Code
            </label>

            <input
              type="text"
              value={roomCode}
              onChange={(e) =>
                setRoomCode(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="ROOM88"
              className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-950
              px-4
              py-3
              uppercase
              text-white
              outline-none
              focus:border-violet-500
              "
            />

          </div>

          <button
            onClick={generateRoomCode}
            className="
            w-full
            rounded-2xl
            border
            border-violet-500
            bg-violet-500/10
            py-3
            font-semibold
            text-violet-300
            transition
            hover:bg-violet-500/20
            "
          >
            Generate Room Code
          </button>

          <button
            onClick={handleJoin}
            disabled={
              !displayName.trim() ||
              !roomCode.trim()
            }
            className="
            w-full
            rounded-2xl
            bg-violet-600
            py-3
            font-semibold
            text-white
            transition
            hover:bg-violet-500
            disabled:opacity-50
            "
          >
            Join Room
          </button>

        </div>

      </div>

    </div>
  );
}

export default JoinPage;