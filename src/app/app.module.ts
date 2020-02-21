import { environment } from "./../environments/environment.prod";
import { CartModalPageModule } from "./pages/coffee/cart-modal/cart-modal.module";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { FirebaseService } from "./services/firebase.service";
import { FcmService } from "./services/fcm.service";
import { UserService } from "./services/user.service";
import { AdminService } from "src/app/services/admin.service";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { PlaceslistmodalPageModule } from "./pages/placeslistmodal/placeslistmodal.module";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import { NativeGeocoder } from "@ionic-native/native-geocoder/ngx";
import { FirebaseAuthentication } from "@ionic-native/firebase-authentication/ngx";
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { FirebaseAnalytics } from "@ionic-native/firebase-analytics/ngx";
import { FirebaseDynamicLinks } from "@ionic-native/firebase-dynamic-links/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { File } from "@ionic-native/file/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { Contacts } from "@ionic-native/contacts/ngx";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { Facebook } from "@ionic-native/facebook/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Network } from "@ionic-native/network/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { EmailComposer } from "@ionic-native/email-composer/ngx";

import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from "@angular/fire/firestore";

import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/auth.service";
import { BookingService } from "./services/booking.service";
import { OfflineredirectmodalPageModule } from "./pages/offlineredirectmodal/offlineredirectmodal.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    CartModalPageModule,
    PlaceslistmodalPageModule,
    OfflineredirectmodalPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    AdminService,
    BookingService,
    UserService,
    FcmService,
    FirebaseService,
    NativeStorage,
    ImagePicker,
    Crop,
    Network,
    Contacts,
    File,
    Facebook,
    GooglePlus,
    Camera,
    FileTransfer,
    WebView,
    AndroidPermissions,
    UniqueDeviceID,
    SocialSharing,
    Geolocation,
    LocationAccuracy,
    NativeGeocoder,
    OneSignal,
    EmailComposer,
    FirebaseX,
    FirebaseAnalytics,
    FirebaseAuthentication,
    FirebaseDynamicLinks,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
