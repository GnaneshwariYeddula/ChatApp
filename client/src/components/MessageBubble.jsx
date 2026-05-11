import {
  motion
} from 'framer-motion';

import {
  FaTrash
} from 'react-icons/fa';

function MessageBubble({

  message,

  isMine,

  handleDelete

}) {

  return (
    <motion.div

      initial={{
        opacity: 0,
        y: 10
      }}

      animate={{
        opacity: 1,
        y: 0
      }}

      className={`
      flex
      ${isMine
        ? 'justify-end'
        : 'justify-start'}
      `}
    >

      <div className={`
      group
      max-w-[70%]
      rounded-3xl
      px-5
      py-4
      shadow-lg

      ${
        isMine

        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'

        : 'bg-slate-800 border border-slate-700 text-slate-100'
      }
      `}>

        <div className="
        mb-2
        flex
        items-center
        justify-between
        gap-4
        ">

          <p className="
          text-sm
          font-semibold
          ">
            {message.author}
          </p>

          <div className="
          flex
          items-center
          gap-3
          ">

            <span className="
            text-xs
            text-slate-300
            ">
              {new Date(
                message.createdAt
              ).toLocaleTimeString([], {

                hour: '2-digit',
                minute: '2-digit'

              })}
            </span>

            {isMine && (

              <button
                onClick={() =>
                  handleDelete(
                    message._id
                  )
                }
                className="
                opacity-0
                transition
                group-hover:opacity-100
                "
              >
                <FaTrash />
              </button>

            )}

          </div>

        </div>

        {message.text && (

          <p className="
          break-words
          leading-7
          ">
            {message.text}
          </p>

        )}

        {message.file && (

          <div className="mt-3">

            {message.fileType?.startsWith(
              'image'
            ) ? (

              <img
                src={message.file}
                alt="upload"
                className="
                max-h-[320px]
                rounded-2xl
                object-cover
                "
              />

            ) : (

              <a
                href={message.file}
                target="_blank"
                className="
                text-blue-300
                underline
                "
              >
                Open File
              </a>

            )}

          </div>

        )}

      </div>

    </motion.div>
  );
}

export default MessageBubble;