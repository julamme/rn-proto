import LoginStore from './LoginStore';
import PlaceStore from './PlaceStore';

export type RootStoreType = {
  loginStore: LoginStore,
  placeStore: PlaceStore
};
class RootStore {
  constructor() {
    this.loginStore = new LoginStore(this);
    this.placeStore = new PlaceStore(this);
  }
}
export default RootStore;
