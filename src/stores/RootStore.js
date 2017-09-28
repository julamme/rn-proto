import LoginStore from './LoginStore';
import NavigationStore from './NavigationStore';
import PlaceStore from './PlaceStore';
class RootStore {
  constructor() {
    this.loginStore = new LoginStore(this);
    this.navStore = new NavigationStore(this);
    this.placeStore = new PlaceStore(this);
  }
}
export default RootStore;
