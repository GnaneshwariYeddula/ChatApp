function Sidebar({

  displayName,

  selectedChannel,

  onlineUsers

}) {

  return (
    <aside className="
    hidden
    md:flex
    w-[320px]
    border-r
    border-slate-800
    bg-slate-950/80
    p-6
    flex-col
    ">

      <div className="mb-10">

        <h1 className="
        text-3xl
        font-bold
        text-white
        ">
          ChatApp
        </h1>

        <p className="
        mt-2
        text-sm
        text-slate-400
        ">
          Real-time messaging
        </p>

      </div>

      <div className="
      rounded-3xl
      border
      border-slate-800
      bg-slate-900
      p-5
      ">

        <p className="
        text-xs
        uppercase
        tracking-[0.3em]
        text-slate-500
        ">
          Current Room
        </p>

        <div className="
        mt-5
        rounded-2xl
        bg-violet-500/10
        p-4
        ">

          <p className="
          text-lg
          font-semibold
          text-violet-300
          ">
            #{selectedChannel}
          </p>

        </div>

      </div>

      <div className="mt-8 flex-1">

        <div className="
        mb-4
        flex
        items-center
        justify-between
        ">

          <p className="
          text-sm
          text-slate-400
          ">
            Online Users
          </p>

          <span className="
          rounded-full
          bg-emerald-500/20
          px-3
          py-1
          text-xs
          text-emerald-400
          ">
            {onlineUsers.length}
          </span>

        </div>

        <div className="space-y-3">

          {onlineUsers.map((user) => (

            <div
              key={user.id}
              className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-slate-900
              p-3
              "
            >

              <div className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-violet-600
              font-bold
              text-white
              ">
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>

                <p className="
                font-medium
                text-white
                ">
                  {user.name}
                </p>

                <p className="
                text-xs
                text-emerald-400
                ">
                  Online
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="
      rounded-3xl
      bg-slate-900
      p-4
      ">

        <div className="
        flex
        items-center
        gap-3
        ">

          <div className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-violet-600
          text-white
          font-bold
          ">
            {displayName
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div>

            <p className="
            font-medium
            text-white
            ">
              {displayName}
            </p>

            <p className="
            text-xs
            text-slate-400
            ">
              Active now
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;