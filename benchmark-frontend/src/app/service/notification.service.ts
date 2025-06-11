import { Injectable } from '@angular/core';
import {Notification} from '../data-types/Notification';
import {ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifyRequest = new ReplaySubject<Notification>();

  notifyRequest$ = this.notifyRequest.asObservable();
  constructor() {}

  notify(notification: Notification) {
    this.notifyRequest.next(notification);
  }
}
