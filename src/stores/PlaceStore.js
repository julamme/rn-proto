//@flow
import { observable, computed, action } from 'mobx';
import Geofire from 'geofire';
import R from 'ramda';
import Place from './../models/Place';
import firebase from './../firebase';

export default class PlaceStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  @observable currentPlace = null;
  @observable shownPlaces = [];

  @computed
  get latlng(): any {
    if (this.currentPlace) {
      return [this.currentPlace.latitude, this.currentPlace.longitude];
    }
  }

  @action
  refreshPlacesToShow: (latlng: any) => void = latlng => {
    console.log('refresh places');
    console.log(latlng);
    const tempData = [];
    const geofire = new Geofire(firebase.database().ref('geofire'));
    const geoquery = geofire.query({
      center: latlng,
      radius: 10
    });
    const entered = geoquery.on('key_entered', (key, location, distance) => {
      console.log('entered');
      firebase
        .database()
        .ref(`locations/${key}`)
        .on('value', snapshot => {
          const value = snapshot.val();
          value.id = snapshot.key;
          this.shownPlaces.push(value);
        });
    });
    const ready = geoquery.on('ready', () => {});
    const onKeyExitedRegistration = geoquery.on('key_exited', function(
      key,
      location,
      distance
    ) {
      this.shownPlaces = R.reject(n => n.id === key, this.shownPlaces);
    });

    const onKeyMovedRegistration = geoquery.on('key_moved', function(
      key,
      location,
      distance
    ) {
      console.log(
        key +
          ' moved within query to ' +
          location +
          ' (' +
          distance +
          ' km from center)'
      );
    });
  };

  @action
  mergeAndSavePlace: (place: Place) => void = place => {
    if (place) {
      place.latitude = this.currentPlace ? this.currentPlace.latitude : 0;
      place.longitude = this.currentPlace ? this.currentPlace.longitude : 0;
    }

    this.currentPlace = place;
    this.currentPlace.addedBy = this.rootStore.loginStore.firebaseUser.uid;
    this.currentPlace.rating = 0;
    this.currentPlace.price = 0;
    this.currentPlace.ratingCount = 0;
    this.currentPlace.reviews = [];

    this.saveToFirebase();
  };

  saveToFirebase: () => void = () => {
    firebase
      .database()
      .ref('locations')
      .push(this.currentPlace)
      .then(response => this.saveGeofire(response));
  };

  saveGeofire: (response: any) => void = response => {
    const id = response.path.replace('/locations/', '');
    const geofire = new Geofire(firebase.database().ref(`geofire`));
    geofire
      .set(id, [this.currentPlace.latitude, this.currentPlace.longitude])
      .then(resp => (this.currentPlace = new Place()));
  };

  @action
  setCurrentPlaceLocation: (latlng: any) => void = latlng => {
    if (this.currentPlace === null) {
      this.currentPlace = new Place();
    }
    this.currentPlace.latitude = latlng.latitude;
    this.currentPlace.longitude = latlng.longitude;
  };
}
