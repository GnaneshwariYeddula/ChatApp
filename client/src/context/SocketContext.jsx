import { io } from 'socket.io-client';

/*
=====================
SINGLE SOCKET INSTANCE
=====================
*/

export const socket =
  io(
    'http://localhost:5000',

    {

      transports:
        ['websocket'],

      autoConnect:
        true

    }
  );