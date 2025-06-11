import { Component, OnInit } from '@angular/core';
import { Notification } from '../../data-types/Notification';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  counter: number = 0;
  constructor(public notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notifyRequest$.subscribe(
      (notification: Notification) => {
        const id = this.counter++;
        this.notifications.push({ ...notification, id });

        setTimeout(() => {
          this.notifications = this.notifications.filter(
            (notification) => notification.id !== id,
          );
        }, 3000);
      },
    );
  }

  dismiss(id: any): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

}
