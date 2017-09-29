import { StackNavigator } from 'react-navigation';
import MainContainer from './containers/MainContainer';
import ProfileContainer from './containers/ProfileContainer';
import PlaceContainer from './containers/PlaceContainer';
import NewPlaceContainer from './containers/NewPlaceContainer';

const AppStack = StackNavigator(
  {
    Main: {
      screen: MainContainer,
      navigationOptions: {
        title: 'Hotel Relief'
      }
    },
    NewPlace: {
      screen: NewPlaceContainer,
      navigationOptions: {
        title: 'Add new Place'
      }
    },
    Profile: {
      screen: ProfileContainer,
      navigationOptions: {
        title: 'Profile'
      }
    },
    PlaceDetails: {
      screen: PlaceContainer,
      navigationOptions: {
        title: 'Details'
      }
    }
  },
  { initialRouteName: 'Main' }
);

export default AppStack;
