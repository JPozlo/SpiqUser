import { ActionSheetController } from '@ionic/angular';
import { ControllersService } from './../../../../emailLinkWebApp/services/controllers.service';
import { Observable } from 'rxjs';
import { FirebaseService, Locker } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.page.html',
  styleUrls: ['./locker.page.scss'],
})
export class LockerPage implements OnInit {
  lockers: Observable<Locker[]>;

  constructor(private firebaseService: FirebaseService, private controllerService: ControllersService, private actionSheetctrl: ActionSheetController) {
    this.lockers = firebaseService.getFreeLockers()
    // firebaseService.getFreeLockers().subscribe(data => {
    //   data.sort(sortByID);
    //   console.log("Sorted lockers: ", data);
    // })
  }

  ngOnInit() {
  }

  addLockers() {
    this.firebaseService.addLocker();
  }

  bookLocker(lockerID) {
    let uniqueBookingID = (
      Math.floor(Math.random() * (999 - 100 + 1) + 100)
    ).toString();
    this.firebaseService.bookLocker(lockerID).then(res => {
      this.firebaseService.addToLockerHistory(lockerID, uniqueBookingID);
      this.controllerService.showAlert("Success", `You have successfully booked locker number: ${lockerID} and your unique ID is ${uniqueBookingID}. Please do not lose your unique ID as you will use it to store & retrieve your items`)
    }, err => {
      console.log("Error below");
      console.dir(err);
    })
  }

  presentActionSheet(lockerID) {
    this.actionSheetctrl.create({
      header: `Do you want to book locker number: ${lockerID}`, buttons: [{
        text: "Yes",
        handler: () => {
          this.bookLocker(lockerID);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    }).then(alertEl => alertEl.present());
  }

}
