import { Router } from "@angular/router";
import { UserService, User } from "src/app/services/user.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "./../../../services/auth.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Component, OnInit } from "@angular/core";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { FirebaseService } from "src/app/services/firebase.service";
import {
  ToastController,
  ActionSheetController,
  AlertController
} from "@ionic/angular";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { url } from "inspector";

import * as admin from "firebase-admin";
import * as firebase from "firebase/app";
import {
  AngularFireStorage,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { Observable } from "rxjs";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { finalize, tap, map } from "rxjs/operators";
import { AnalysisCrashService } from 'src/app/services/analysis-crash.service';

export interface MyData {
  name: string;
  filepath: string;
  size: number;
  userID: string;
}

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  // Upload Task
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  // Uploaded Image List
  images: Observable<MyData[]>;

  //File details
  fileName: string;
  fileSize: number;

  // Custom Path
  filePath: string;

  //Status check
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;
  private userCollection: AngularFirestoreCollection<User>;

  phoneNo;
  otherPhoneNo;

  private userEmail;
  private userName;

  fileUrl: string;
  usersList;

  otherUserPhone;
  imagePath;

  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };

  user: any = {};

  constructor(
    private imgPicker: ImagePicker,
    private crop: Crop,
    private fileTransfer: FileTransfer,
    private firebaseService: FirebaseService,
    private router: Router,
    private toastCtrl: ToastController,
    private webView: WebView,
    private file: File,
    private camera: Camera,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private analysisService: AnalysisCrashService
  ) {
    this.analysisService.setPageName('Profile');
    this.isUploading = false;
    this.isUploaded = false;
    // Set collection where our documents/ images info will save
    this.imageCollection = afStore.collection<MyData>("images");
    this.images = this.imageCollection.valueChanges();
    this.otherUserPhone = userService.getCurrentUser().phoneNo;
    this.imagePath = userService.getCurrentUser().image;
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
          isAnonymous: user.isAnonymous,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          refreshToken: user.refreshToken
        };
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  updatePass() {
    this.router.navigateByUrl("/forgot-password");
  }

  updateImage() {
    const myuser = this.authService.getUser();
    myuser.updateProfile({
      photoURL: this.filePath
    });
  }

  updateName() { }

  updateEmail() { }

  updatePhone() {
    // this.user.phoneNumber = this.phoneNo;
    this.otherPhoneNo = this.phoneNo;
    this.updateUserPhoneInfoToDb(this.otherPhoneNo);
  }
  uploadFile(event: FileList) {
    // The File object
    const file = event.item(0);

    // Validation for Images Only
    if (file.type.split("/")[0] !== "image") {
      console.error("Unsupported file type :( ");
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    // The storage path
    const path = `images/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: "Profile Image Upload MapsDemo" };

    // File reference
    const fileRef = this.afStorage.ref(path);

    // The main task
    this.task = this.afStorage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        // Get uploaded file storage path
        console.log("To check where function ends");
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(
          resp => {
            console.log("The File Path is: ", resp);
            // console.log('The User Id is: ', userID);
            this.addImagetoDB({
              name: file.name,
              filepath: resp,
              size: this.fileSize,
              userID: this.user.uid
            });
            this.updateUserImageInfoToDb(resp);
            this.isUploading = false;
            this.isUploaded = true;
            this.filePath = resp;
            const theuser = this.authService.getUser();
            theuser.updateProfile({ photoURL: resp });
          },
          err => {
            console.error("Error of getting image filepath", err);
          }
        );
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    );
  }

  showAlert(header, message) {
    this.alertCtrl
      .create({ header, message, buttons: ["OK"] })
      .then(alertEl => alertEl.present());
  }
  updateUserImageInfoToDb(image) {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("users")
      .where("id", "==", userID)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const docRef = db.collection("users").doc(doc.id);
          docRef
            .set({ image }, { merge: true })
            .then(res =>
              this.showAlert("Success", "Successfully updated your profile")
            );
        });
      });
  }

  updateUserPhoneInfoToDb(phoneNo) {
    const db = firebase.firestore();
    const user = this.authService.getUser();
    const userID = user.uid;
    db.collection("users")
      .where("id", "==", userID)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const docRef = db.collection("users").doc(doc.id);
          docRef
            .set({ phoneNo }, { merge: true })
            .then(res =>
              this.showAlert(
                "Success",
                "Successfully updated your profile phone number"
              )
            );
        });
      });
  }

  addImagetoDB(image: MyData) {
    // Create an ID for document
    const id = this.afStore.createId();

    // Set document id with value in database
    this.imageCollection
      .doc(id)
      .set(image)
      .then(resp => {
        console.log("The Response of adding image to collection", resp);
      })
      .catch(error => {
        console.log("Error of adding image to collection " + error);
      });
  }

  getDefaultUserInfo() {
    this.userEmail = "Placeholder email";
    this.userName = "Placeholder name";
  }

  uploadImage() {
    let storageRef = firebase.storage().ref();

    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/${filename}.jpg`);

    imageRef
      .putString(this.fileUrl, firebase.storage.StringFormat.DATA_URL)
      .then(
        snapshot => {
          // Do something here when the data is succesfully uploaded!
          this.uploadAlert("Success!", "successful");
        },
        err => {
          this.uploadAlert("Error", "unsuccessful");
        }
      );
  }

  async uploadAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message: `Image upload ${message}!`,
      buttons: ["OK"]
    });
    await alert.present();
    // clear the previous photo data in the variable
    this.fileUrl = "";
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.fileUrl = "data:image/jpeg;base64," + imageData;
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      err => {
        // handle error
        console.log("Camera error", err);
      }
    );
  }

  async selectImageLocation() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image Source",
      buttons: [
        {
          text: "Load from Gallery",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Take a Picture",
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });

    await actionSheet.present();
  }

  // openImagePicker() {
  //   this.imgPicker.hasReadPermission().then(
  //     (result) => {
  //       if (result == false) {
  //         // no callbacks required as this opens a popup which returns async
  //         this.imgPicker.requestReadPermission();
  //       }
  //       else if (result == true) {
  //         this.imgPicker.getPictures({
  //           maximumImagesCount: 1
  //         }).then(
  //           (results) => {
  //             for (var i = 0; i < results.length; i++) {
  //               this.fileUrl = results[i];
  //               this.uploadImageToFirebase(results[i]);
  //             }
  //           }, (err) => console.log(err)
  //         );
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     });
  // }

  // openImagePickerCrop() {
  //   this.imgPicker.hasReadPermission().then(
  //     (result) => {
  //       if (result == false) {
  //         // no callbacks required as this opens a popup which returns async
  //         this.imgPicker.requestReadPermission();
  //       }
  //       else if (result == true) {
  //         this.imgPicker.getPictures({
  //           maximumImagesCount: 1
  //         }).then(
  //           (results) => {
  //             for (var i = 0; i < results.length; i++) {
  //               this.crop.crop(results[i], { quality: 75 }).then(
  //                 newImage => {
  //                   this.fileUrl = newImage;
  //                   this.uploadImageToFirebase(newImage);
  //                 },
  //                 error => console.error("Error cropping image", error)
  //               );
  //             }
  //           }, (err) => console.log(err)
  //         );
  //       }
  //     }, (err) => {
  //       console.log(err);
  //     });
  // }

  // uploadImageToFirebase(image) {
  //   image = this.webView.convertFileSrc(image);

  //   //uploads img to firebase storage
  //   this.firebaseService.uploadImage(image)
  //     .then(photoURL => {
  //       this.fileUrl = photoURL;
  //       this.toastFunction();
  //     })
  // }

  // async toastFunction() {
  //   const toast = await this.toastCtrl.create({
  //     message: 'Image was updated successfully',
  //     duration: 3000
  //   });

  //   await toast.present();
  // }
}
