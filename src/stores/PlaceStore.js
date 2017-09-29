//@flow
import { observable, computed, action } from 'mobx';
import Geofire from 'geofire';
import R from 'ramda';
import Place from './../models/Place';
import Review from './../models/Review';
import firebase from './../firebase';

export default class PlaceStore {
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }
  rootStore: RootStore;
  @observable currentPlace = null;
  @observable shownPlaces = [];
  @observable isCreatingReview = false;

  @computed
  get latlng(): any {
    if (this.currentPlace) {
      return [this.currentPlace.latitude, this.currentPlace.longitude];
    }
  }

  @computed
  get currentPlaces() {
    if (!this.shownPlaces) {
      return [];
    }
    const arr = this.shownPlaces.slice();
    return arr;
  }

  @action
  cancelReview: () => void = reviewBase => {
    this.isCreatingReview = false;
  };

  @action
  addReview: (reviewBase: object) => void = reviewBase => {
    const review = new Review();
    review.description = reviewBase.description;
    review.rating = reviewBase.rating;
    review.user = {
      uid: this.rootStore.loginStore.firebaseUser.uid,
      displayName: this.rootStore.loginStore.firebaseUser.displayName,
      profilePicture: this.rootStore.loginStore.firebaseUser.photoURL
    };
    this.currentPlace.reviews
      ? this.currentPlace.reviews.push(review)
      : (this.currentPlace.reviews = Array.of(review));
    let ratingCount = 0;
    let totalRatingCounter = 0;
    this.currentPlace.reviews.map(item => {
      ratingCount += 1;
      totalRatingCounter += item.rating;
    });
    if (ratingCount > 0) {
      this.currentPlace.rating = totalRatingCounter / ratingCount;
      this.currentPlace.ratingCount = ratingCount;
    }

    firebase
      .database()
      .ref(`locations/${this.currentPlace.id}`)
      .update(this.currentPlace)
      .then(response => {
        console.log(response);
      });
    this.isCreatingReview = false;
  };

  @action
  setIsCreatingReview: (value: boolean) => void = value => {
    this.isCreatingReview = value;
  };
  @action
  loadDetailsFor: (id: string) => void = id => {
    firebase
      .database()
      .ref(`locations/${id}`)
      .on('value', snapshot => {
        const value = snapshot.val();
        value.id = snapshot.key;
        this.currentPlace = value;
        console.log(this.currentPlace);
      });
  };

  @action
  refreshPlacesToShow: (latlng: any) => void = latlng => {
    const tempData = [];
    const geofire = new Geofire(firebase.database().ref('geofire'));
    const geoquery = geofire.query({
      center: latlng,
      radius: 10
    });
    const entered = geoquery.on('key_entered', (key, location, distance) => {
      firebase
        .database()
        .ref(`locations/${key}`)
        .on('value', snapshot => {
          const value = snapshot.val();
          value.id = snapshot.key;
          if (!R.contains(value, this.shownPlaces)) {
            this.shownPlaces.push({ id: value.id, value });
          }
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
    this.currentPlace.addedBy = {
      uid: this.rootStore.loginStore.firebaseUser.uid,
      displayName: this.rootStore.loginStore.firebaseUser.displayName,
      profilePicture: this.rootStore.loginStore.firebaseUser.photoURL
    };
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
