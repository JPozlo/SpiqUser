import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


export interface Session {
  id: string;
  session_place_id: string;
  session_user_id: string;
  session_user_email: string;
}

export interface PlaceResponse {
  id: string;
  placeName: string;
  seatsAvailable: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private seatsAvailable: number = 60;

  private sessionCollection: AngularFirestoreCollection<Session>;
  private sessions: Observable<Session[]>;

  private placeCollection: AngularFirestoreCollection<PlaceResponse>;
  private places: Observable<PlaceResponse[]>;

  event: string = 'book';
  booking: string;



  snapshotChangesSubscription;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private navctrl: NavController,
    private authService: AuthService
  ) {
    let currentusernow = this.afAuth.auth.currentUser;
    this.sessionCollection = this.afStore
      .collection('sessions');
    this.sessions = this.sessionCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data;
          const id = a.payload.doc.data().id;
          const session_place_id = a.payload.doc.data().session_place_id;
          const session_user_id = a.payload.doc.data().session_user_id;
          const session_user_email = a.payload.doc.data().session_user_email;
          return {
            id,
            session_place_id,
            session_user_id,
            session_user_email,
            ...data
          };
        });
      })
    );
  }

  getSeatsAvailable() {
    return this.seatsAvailable;
  }

  sendInfo(placeID: string) {
    // let currentUser = this.afAuth.auth.currentUser.email;
    let currentUser = this.authService.getUser();
    let userId = currentUser.uid;
    let userEmail = currentUser.email;

    return new Promise<any>((resolve, reject) => {

      return data => {
        this.afStore
          .collection<any>('sessions')
          .add({
            id: (Math.floor(Math.random() * 100) + 1).toString(),
            session_place_id: placeID,
            session_user_id: data.id,
            session_user_email: data.email
          })
          .then(
            res => {
              this.seatsAvailable = this.seatsAvailable - 1;
              this.alertCtrl
                .create({
                  header: 'Successfully sent session information',
                  buttons: ['OK'],
                  message: `Remaining seats are: ${this.getSeatsAvailable()}`
                })
                .then(alertEl => {
                  alertEl.present();
                });
              resolve(res);
            },
            err => reject(err)
          );

      }
    });
  }

  getAllInfo(): Observable<Session[]> {
    return this.sessions;
  }

  getInfo() {
    let currentuser = this.afAuth.auth.currentUser;
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(
        currentUser => {
          if (currentUser) {
            this.snapshotChangesSubscription = this.afStore
              .collection<any>('users')
              .doc(currentUser.uid)
              .collection('session')
              .snapshotChanges();
            resolve(this.snapshotChangesSubscription);
            console.log(this.snapshotChangesSubscription);
          }
        },
        err => reject(err)
      );
    });
  }

  getTheInfo() {
    let currentuser = this.afAuth.auth.currentUser;
    return new Promise<any>((resolve, reject) => {
      this.afStore
        .collection<any>('users')
        .doc(currentuser.uid)
        .collection('session')
        .snapshotChanges()
        .subscribe(info => {
          let values = info.values;
          console.log('Info Values is', values);
        });
    });
  }
}
