import LoginStore from './LoginStore';
import NavigationStore from './NavigationStore';
import PlaceStore from './PlaceStore';

export type RootStoreType = {
  loginStore: LoginStore,
  navStore: NavigationStore,
  placeStore: PlaceStore
};
class RootStore {
  constructor() {
    this.loginStore = new LoginStore(this);
    this.placeStore = new PlaceStore(this);
  }
}
export default RootStore;
