import { BookingService } from "./../../services/booking.service";
import {
  ModalController,
  NavParams,
  ActionSheetController,
  AlertController
} from "@ionic/angular";
import { Component, OnInit, Input } from "@angular/core";
import { AnalysisCrashService } from "src/app/services/analysis-crash.service";

@Component({
  selector: "app-placeslistmodal",
  templateUrl: "./placeslistmodal.page.html",
  styleUrls: ["./placeslistmodal.page.scss"]
})
export class PlaceslistmodalPage implements OnInit {
  quietareas: Array<any> = [
    "ChIJtS505UoULxgR0QkaBPgw5u4",
    "ChIJszXorvATLxgRcEdpiGxpC0c",
    "ChIJRwyS5cQFLxgRwZ9Hpl27bHc",
    "ChIJhU-1PsMFLxgRH8MIe-BFkss",
    "ChIJLR5-zBEaLxgRgwSwoR30RII",
    "ChIJYWiy8bYWLxgRlMmbprKj0ms",
    "ChIJg-zl1IUULxgRKXSci3hn8UQ",
    "ChIJI5xZhDoRLxgRJEVADPWnciw",
    "ChIJC4gm9aEQLxgRrKHdf2wTiGg", // Adlife
    "ChIJCz3xipsQLxgRHZdNqnea670" // Prestige
  ]; //place_id

  customAreas: Array<any> = [
    "ChIJC4gm9aEQLxgRrKHdf2wTiGg" // Adlife
  ];

  // @Input() places;
  placesList: [];
  filteredPlace: any;
  filteredPlaceName: string;
  filteredPlacesList = [];
  thePlacesList = [];
  place: any;
  myplaceList = [];

  bookingStatus: boolean;

  freeSeatStatus: boolean;

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private analysisService: AnalysisCrashService,
    private alertCtrl: AlertController
  ) {
    this.analysisService.setPageName("Place Booking Modal");
    this.place = this.navParams.get("places");
    console.log(this.placesList);
    this.bookingService.checkFreeSeatsOnePlace().subscribe(res => {
      console.log(`Status of seats: ${res}`);
      this.freeSeatStatus = res;
    });

    this.bookingService.checkBookingStatus().subscribe(res => {
      this.bookingStatus = res;
    })
  }

  ngOnInit() { }

  filterPlaces() {
    for (let i = 0; i < this.placesList.length; i++) {
      if (this.customAreas.includes(this.placesList[i]["place_id"])) {
        this.filteredPlaceName = this.placesList[i]["name"] + "SPIQ";
        this.filteredPlace = this.placesList[i];
        console.log("The filtered places are", this.filteredPlace);
        this.filteredPlacesList.push(this.filteredPlace);
      }
    }
    return this.filteredPlacesList;
  }

  book(placeID, placeName) {
    if (this.freeSeatStatus) {
      this.presentActionSheet(placeID, placeName);
    } else {
      this.showAlert(
        `Sorry, ${placeName} is fully booked`,
        "You can try one of our other places"
      );
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  showAlert(header: string, message: string) {
    this.alertCtrl
      .create({ header, message, buttons: ["OK"] })
      .then(alertEl => {
        alertEl.present();
      });
  }

  async presentActionSheet(placeId, placeName) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Book A Place",
      buttons: [
        {
          text: "Book",
          icon: "checkmark-circle",
          handler: () => {
            if (!this.bookingStatus) {
              this.bookingService
                .createBooking(placeId, placeName)
                .then(success => {
                  console.log("Sent to firebase after click");
                  this.modalCtrl.dismiss();
                });
            } else {
              this.showAlert("Sorry", `You cannot book ${placeName} as you already have an active booking.`)
            }
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          icon: "close"
        }
      ]
    });
    await actionSheet.present();
  }
}
