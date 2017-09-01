/**
 * @flow
 */
import { StackNavigator } from 'react-navigation';
import Home from './containers/Home';
import About from './containers/About';

const AppNavigator = StackNavigator({
  Home: { screen: Home },
  About: { screen: About },
}, {
  initialRouteName: 'Home',
  navigationOptions: ({ navigation: { state } }) => {
    return {
      title: state.params && state.params.title,
    };
  },
});

export default AppNavigator;
