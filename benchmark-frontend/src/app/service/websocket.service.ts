import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Experiment } from '../data-types/Experiment';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client; // the STOMP client instance that manages the WebSocket connection
  private experimentUpdateSubject = new Subject<Experiment>(); // emits Experiment updates received from the backend
  private isConnected = false;

  experimentUpdates$ = this.experimentUpdateSubject.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000, // Attempts reconnection after 5 seconds if disconnected
    });

    this.stompClient.onConnect = () => {
      if (this.isConnected) return;
      this.isConnected = true;

      this.stompClient.subscribe('/topic/experiment-update', (message: IMessage) => {
        const experiment: Experiment = JSON.parse(message.body);
        this.experimentUpdateSubject.next(experiment);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    this.stompClient.activate();
  }
}
