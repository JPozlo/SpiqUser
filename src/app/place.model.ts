export class Place {

    seatsAvailable: number;

    constructor(private id: string, private placeName: string) {
        this.seatsAvailable = 60;
    }

    getID() {
        return this.id;
    }

    getPlaceName() {
        if (this.getID) {
            return this.placeName;
        }
    }

    getSeatsAvailable() {
        if (this.getID()) {
            return this.seatsAvailable;
        }
    }
}