/**
 * @Flow
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

type Props = {
  navigation: any,
}
class Home extends Component {
    props: Props

    render() {
      const { navigate, state, params, dispatch } = this.props.navigation;
      console.log(this.props);
      return (
        <View>
          <Text> Hello boys { state.params.test} </Text>
          <View>
            <TouchableHighlight
              onPress={() => {
                dispatch(NavigationActions.navigate('About'));
              }}
            >
              <Text>testing it!</Text>
            </TouchableHighlight>
          </View>
        </View>
      );
    }
}
export default Home;
