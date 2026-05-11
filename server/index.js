const express =
  require('express');

const http =
  require('http');

const cors =
  require('cors');

const multer =
  require('multer');

const path =
  require('path');

const fs =
  require('fs');

const {
  Server
} = require('socket.io');

const {
  v4: uuidv4
} = require('uuid');

const app =
  express();

const server =
  http.createServer(app);

app.use(cors());

app.use(express.json());

/*
=====================
UPLOADS FOLDER
=====================
*/

const uploadsDir =
  path.join(
    __dirname,
    'uploads'
  );

if (
  !fs.existsSync(
    uploadsDir
  )
) {

  fs.mkdirSync(
    uploadsDir
  );

}

/*
=====================
STATIC FILES
=====================
*/

app.use(
  '/uploads',

  express.static(
    uploadsDir
  )
);

/*
=====================
MULTER
=====================
*/

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          uploadsDir
        );

      },

    filename:
      (req, file, cb) => {

        cb(

          null,

          Date.now() +
          '-' +
          file.originalname

        );

      }

  });

const upload =
  multer({

    storage

  });

/*
=====================
UPLOAD ROUTE
=====================
*/

app.post(
  '/upload',

  upload.single(
    'file'
  ),

  (req, res) => {

    res.json({

      file:
        `https://chatapp-backend-kxir.onrender.com/uploads/${req.file.filename}`

    });

  }
);

/*
=====================
SOCKET
=====================
*/

const io =
  new Server(server, {

    cors: {

      origin:
        'http://localhost:5173',

      methods:
        ['GET', 'POST']

    }

  });

let users = [];

let roomMessages = {};

const getRoomUsers =
  (room) => {

    return users.filter(
      (user) =>
        user.room === room
    );

  };

io.on(
  'connection',
  (socket) => {

    /*
    =====================
    JOIN ROOM
    =====================
    */

    socket.on(
      'joinRoom',
      ({ name, room }) => {

        users =
          users.filter(
            (user) =>
              user.id !== socket.id
          );

        users.push({

          id:
            socket.id,

          name,

          room

        });

        socket.join(room);

        if (
          !roomMessages[room]
        ) {

          roomMessages[room] = [];

        }

        io.to(room).emit(
          'onlineUsers',

          getRoomUsers(room)
        );

        socket.emit(
          'previousMessages',

          roomMessages[room]
        );

      }
    );

    /*
    =====================
    SEND MESSAGE
    =====================
    */

    socket.on(
      'sendMessage',
      (message) => {

        if (
          !roomMessages[
            message.room
          ]
        ) {

          roomMessages[
            message.room
          ] = [];

        }

        const newMessage = {

          ...message,

          id:
            uuidv4(),

          seen:
            false

        };

        roomMessages[
          message.room
        ].push(newMessage);

        io.to(
          message.room
        ).emit(
          'message',
          newMessage
        );

      }
    );

    /*
    =====================
    EDIT MESSAGE
    =====================
    */

    socket.on(
      'editMessage',
      ({
        room,
        messageId,
        newText
      }) => {

        roomMessages[room] =
          roomMessages[room].map(
            (msg) => {

              if (
                msg.id ===
                messageId
              ) {

                return {

                  ...msg,

                  text:
                    newText,

                  edited:
                    true

                };

              }

              return msg;

            }
          );

        io.to(room).emit(
          'messagesUpdated',

          roomMessages[room]
        );

      }
    );

    /*
    =====================
    DELETE MESSAGE
    =====================
    */

    socket.on(
      'deleteMessage',
      ({
        room,
        messageId
      }) => {

        roomMessages[room] =
          roomMessages[room].filter(
            (msg) =>
              msg.id !==
              messageId
          );

        io.to(room).emit(
          'messagesUpdated',

          roomMessages[room]
        );

      }
    );

    /*
    =====================
    MESSAGE SEEN
    =====================
    */

    socket.on(
      'messageSeen',
      ({
        room,
        messageId
      }) => {

        roomMessages[room] =
          roomMessages[room].map(
            (msg) => {

              if (
                msg.id ===
                messageId
              ) {

                return {

                  ...msg,

                  seen:
                    true

                };

              }

              return msg;

            }
          );

        io.to(room).emit(
          'messagesUpdated',

          roomMessages[room]
        );

      }
    );

    /*
    =====================
    TYPING
    =====================
    */

    socket.on(
      'typing',
      ({ room, name }) => {

        socket.to(room).emit(
          'typing',
          name
        );

      }
    );

    /*
    =====================
    CALL USER
    =====================
    */

    socket.on(
      'call-user',
      (data) => {

        io.to(
          data.userToCall
        ).emit(
          'incoming-call',
          {

            signal:
              data.signalData,

            from:
              data.from,

            name:
              data.name,

            callType:
              data.callType

          }
        );

      }
    );

    /*
    =====================
    ANSWER CALL
    =====================
    */

    socket.on(
      'answer-call',
      (data) => {

        io.to(
          data.to
        ).emit(
          'call-accepted',

          data.signal
        );

      }
    );

    /*
    =====================
    END CALL
    =====================
    */

    socket.on(
      'end-call',
      (data) => {

        io.to(
          data.to
        ).emit(
          'call-ended'
        );

      }
    );

    /*
    =====================
    CLEAR CHAT
    =====================
    */

    socket.on(
      'clearChat',
      (room) => {

        roomMessages[room] = [];

        io.to(room).emit(
          'messagesUpdated',
          []
        );

      }
    );

    /*
    =====================
    LEAVE ROOM
    =====================
    */

    socket.on(
      'leaveRoom',
      () => {

        const user =
          users.find(
            (u) =>
              u.id ===
              socket.id
          );

        if (user) {

          users =
            users.filter(
              (u) =>
                u.id !== socket.id
            );

          io.to(
            user.room
          ).emit(
            'onlineUsers',

            getRoomUsers(
              user.room
            )
          );

        }

      }
    );

    /*
    =====================
    DISCONNECT
    =====================
    */

    socket.on(
      'disconnect',
      () => {

        const user =
          users.find(
            (u) =>
              u.id ===
              socket.id
          );

        if (user) {

          users =
            users.filter(
              (u) =>
                u.id !== socket.id
            );

          io.to(
            user.room
          ).emit(
            'onlineUsers',

            getRoomUsers(
              user.room
            )
          );

        }

      }
    );

  }
);

server.listen(
  5000,
  () => {

    console.log(
      'SERVER RUNNING ON 5000'
    );

  }
);