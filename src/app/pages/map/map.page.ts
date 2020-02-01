import { BookingService } from "./../../services/booking.service";
import { AlertController, ActionSheetController } from "@ionic/angular";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import {
  Geolocation,
  GeolocationOptions,
  Geoposition
} from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AdminService } from "src/app/services/admin.service";

declare var google;

@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"]
})
export class MapPage implements OnInit, OnDestroy {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  map: any;
  marker: any;
  address: string;

  locationsCollection: AngularFirestoreCollection<any>;
  locations: Observable<any>;

  // Misc
  isTracking = false;
  user: firebase.User;
  markers = [];

  places: Array<any>;
  filteredPlacesID: Array<any>;
  quietareas: Array<any> = [
    "ChIJtS505UoULxgR0QkaBPgw5u4",
    "ChIJszXorvATLxgRcEdpiGxpC0c",
    "ChIJRwyS5cQFLxgRwZ9Hpl27bHc",
    "ChIJhU-1PsMFLxgRH8MIe-BFkss",
    "ChIJLR5-zBEaLxgRgwSwoR30RII"
  ]; //place_id

  placeIdentifier: string;
  placeName: string;

  private URL = "assets/data.json";

  private lat;
  private long;

  private currentPosition = new google.maps.LatLng(this.lat, this.long);

  //others
  options: GeolocationOptions;
  currentPos: Geoposition;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private adminService: AdminService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    //this.trackUserPosition();
  }

  ngOnDestroy() {}
  ionViewWillEnter() {
    this.getUserPosition();
    console.log("yes");
  }

  onBook() {
    this.bookingPlace();
  }

  bookingPlace() {
    this.getLibraries(this.currentPosition).then(
      (results: Array<any>) => {
        this.places = results;
        console.log("Places array: ", this.places);
        this.filteredPlacesID = results.map(function(value, index) {
          return value.place_id;
        });
        console.log("The filtered places ID are: ", this.filteredPlacesID);
        for (let i = 0; i < results.length; i++) {
          if (this.quietareas.includes(results[i]["place_id"])) {
            this.placeIdentifier = results[i]["id"];
            this.placeName = results[i]["name"];
            this.createMarker(results[i]);
            console.log("Created marker successfully!", results[i]);
          }
        }
      },
      status => console.log(status)
    );
  }

  addMap(lat, long) {
    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.addMarker(latLng);
    this.currentPosition = new google.maps.LatLng(lat, long);
  }

  addMarker(latlng) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latlng
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      infoWindow.open(this.map, marker);
    });
  }

  getUserPosition() {
    this.options = {
      enableHighAccuracy: false
    };
    this.geolocation.getCurrentPosition(this.options).then(
      (pos: Geoposition) => {
        this.currentPos = pos;

        console.log(pos);
        this.addMap(pos.coords.latitude, pos.coords.longitude);
      },
      (err: PositionError) => {
        console.log("error : " + err.message);
      }
    );
  }

  getLibraries(latLng) {
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: latLng,
      radius: "8047",
      types: ["shopping_mall", "restaurant"],
      key: "AIzaSyBkv2XkDpOFVZ1NMaI2pW3p-syAK3D0ZHc"
    };
    return new Promise((resolve, reject) => {
      service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  createMarker(place) {
    const image = "../../../assets/icon/icon.ico";

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      icon: image
    });

    let content = "The InfoContent";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, "click", () => {
      this.presentActionSheet();
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Book A Place",
      buttons: [
        {
          text: "Book",
          icon: "checkmark-circle",
          handler: () => {
            this.bookingService.createBooking(
              this.placeIdentifier,
              this.placeName
            );
            console.log("Sent to firebase after click");
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

  // // Loads map and tracks user location
  // trackUserPosition() {
  //   this.geolocation.watchPosition()
  //     .subscribe(resp => {
  //       const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //       const mapOptions = {
  //         zoom: 15,
  //         center: latLng,
  //         mapTypeId: google.maps.MapTypeId.ROADMAP
  //       };
  //       this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  //       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //       this.marker = new google.maps.Marker({ map: this.map, position: latLng });
  //       this.marker.setPosition({ lat: resp.coords.latitude, lng: resp.coords.longitude });
  //       this.map.addListener('tilesloaded', () => {
  //         console.log('accuracy', this.map);
  //         this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
  //       });
  //       this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude });
  //       this.getMarkers();
  //     }, err => console.log(`Error of tracking location is ${err}`));
  // }

  // // Loads map and gets current user position
  // loadMap() {
  //   this.geolocation.getCurrentPosition()
  //     .then((resp) => {
  //       const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //       const mapOptions = {
  //         center: latLng,
  //         zoom: 15,
  //         mapTypeId: google.maps.MapTypeId.ROADMAP
  //       };
  //       this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  //       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //       this.marker = new google.maps.Marker({ map: this.map, position: latLng });
  //       this.marker.setPosition({ lat: resp.coords.latitude, lng: resp.coords.longitude });
  //       this.map.addListener('tilesloaded', () => {
  //         console.log('accuracy', this.map);
  //         this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
  //       });
  //       this.map.panTo({ lat: resp.coords.latitude, lng: resp.coords.longitude });
  //     }).catch((err) => {
  //       console.log('Error getting current location', err);
  //     });
  // }

  // // Function to calculate distance
  // calculateDistanceAPI(userloc, placeloc) {
  //   let loc1 = userloc;
  //   let loc2 = placeloc;

  //   let distanceInMetre = google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2);

  //   console.log('Distance in meters: ', distanceInMetre);

  //   return distanceInMetre;
  // }

  // // Function to calculate distance using haversine formula
  // calculateDistance(userlatitude, userlongitude, placelatitude, placelongitude) {
  //   let R = 6371;
  //   let lat1 = userlatitude;
  //   let lat2 = placelatitude;
  //   let difflat = (placelatitude - userlatitude);
  //   let difflng = (placelongitude - userlongitude);
  //   let a = Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(difflng / 2) * Math.sin(difflng / 2);
  //   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   let d = R * c;

  //   return d;
  // }

  // onPair() {
  //   this.user = this.afAuth.auth.currentUser;
  //   this.getFilteredMarkers();

  //   console.log(`The Places List is ${this.places[1]['ID']}`);

  // }

  // // Button clicked when searching for a place
  // onBook() {
  //   this.geolocation.getCurrentPosition()
  //     .then(resp => {
  //       this.getFilteredMarkers();
  //       let usercoord = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

  //       const latposition = resp.coords.latitude;
  //       const lngposition = resp.coords.longitude;
  //       for (let i = 0; i < this.places.length; i++) {
  //       let latplace = this.places[2];
  //       let latcoord = this.places[2]['Latitude'];
  //       let lngcoord = this.places[2]['Longitude'];

  //       let placecoord = new google.maps.LatLng(latcoord, lngcoord);
  //       let diff = this.calculateDistanceAPI(usercoord, placecoord);
  //       console.log('The difference is', diff);

  //       // let distance = this.calculateDistanceAPI(usercoord, placecoord);

  //       // let distancediff = this.calculateDistance(latposition, lngposition, latcoord, lngcoord);

  //       // console.log('The distance is: ', distance);
  //       console.log(`The latplace is: ${latplace}`);
  //       }
  //       console.log('The places array is:', this.places);

  //     });
  // }

  // // Get location from JSON file for use in calculating distance
  // getFilteredMarkers() {
  //   this.http.get(this.URL)
  //     .pipe(map(res => res['data']))
  //     .subscribe(data => {
  //       console.log('Get markers filtered: ', data);
  //       for (const place of data) {
  //         const position = new google.maps.LatLng(place.Latitude, place.Longitude);
  //         console.log(`Position of place is: ${position}`);
  //         this.places.push(place);
  //       }
  //       return this.places;
  //     });
  // }

  // // Get markers from local JSON file
  // getMarkers() {
  //   this.http.get(this.URL)
  //     .pipe(map(res => res['data']))
  //     .subscribe(data => {
  //       console.log('Get markers:', data);
  //       this.addMarkersToMap(data);
  //     });
  // }

  // // Add markers of dummy places to map
  // addMarkersToMap(markers: any) {
  //   for (const marker of markers) {
  //     const image = '../../../assets/icon/favicon.png';
  //     const position = new google.maps.LatLng(marker.Latitude, marker.Longitude);
  //     const locations = new google.maps.Marker({
  //       icon: image,
  //       position,
  //       draggable: false,
  //       animation: google.maps.Animation.DROP,
  //       map: this.map,
  //       label: marker.Name
  //     });
  //     this.addClickToMarker(locations);

  //   }
  // }

  // // Add click listener to the markers
  // addClickToMarker(marker) {
  //   marker.addListener('click', () => {
  //     this.alertController.create({ header: 'Title', message: 'The message of all these', buttons: ['Book'] }).then(alertEl => {
  //       alertEl.present();
  //     });
  //   });
  // }

  // // Function to obtain address from current coordinates
  // getAddressFromCoords(latitude: number, longitude: number) {
  //   console.log('Get Address from ' + latitude + ' ' + longitude);
  //   const options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };
  //   this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       this.address = '';
  //       const responseAddress = [];
  //       for (const [key, value] of Object.entries(result[0])) {
  //         if (value.length > 0) {
  //           responseAddress.push(value);
  //         }
  //       }
  //       responseAddress.reverse();
  //       for (const value of responseAddress) {
  //         this.address += value + ',';
  //       }
  //       this.address = this.address.slice(0, -2);
  //     }).catch((err: any) => {
  //       this.address = 'Address not available';
  //     });
  // }
}
