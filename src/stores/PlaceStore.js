//@flow
import { observable, computed, action } from 'mobx';
import Place from './../models/Place';

export default class PlaceStore {
  @observable currentPlace = null;

  @computed
  get latlng(): any {
    if (this.currentPlace) {
      return [this.currentPlace.latitude, this.currentPlace.longitude];
    }
  }

  @action
  setCurrentPlaceLocation: (latlng: any) => void = latlng => {
    console.log('latlng');
    console.log(latlng);
    this.currenPlace = new Place();
    this.currenPlace.latitude = latlng.latitude;
    this.currenPlace.longitude = latlng.longitude;
  };
}
