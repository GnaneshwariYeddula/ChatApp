import { io } from 'socket.io-client';

/*
=====================
SINGLE SOCKET INSTANCE
=====================
*/

export const socket =
  io(
    'https://chatapp-backend-kxir.onrender.com',

    {

      transports:
        ['websocket'],

      autoConnect:
        true

    }
  );