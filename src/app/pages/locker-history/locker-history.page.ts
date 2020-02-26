import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LockersBookingHistory, FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-locker-history',
  templateUrl: './locker-history.page.html',
  styleUrls: ['./locker-history.page.scss'],
})
export class LockerHistoryPage implements OnInit {
  lockers: Observable<LockersBookingHistory[]>;

  constructor(private firebaseService: FirebaseService) {
    this.lockers = this.firebaseService.getLockerHistory();
  }

  ngOnInit() {
  }

}
