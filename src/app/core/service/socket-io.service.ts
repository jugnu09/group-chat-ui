import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  socket: any;
  constructor() { }

  setUpSocketConnection() {
    this.socket = io('https://node-server-pk6p.onrender.com');
  }
}
