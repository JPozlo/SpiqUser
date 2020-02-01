import { Network } from "@ionic-native/network/ngx";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NetworkService {
  constructor(private network: Network) {}

  connected() {
    return this.network.onConnect();
  }
  disconnected() {
    return this.network.onDisconnect();
  }
}
