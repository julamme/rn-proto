import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MapContainer from './MapContainer';

export default class MainContainer extends Component {
  render() {
    console.log(this.props);
    return (
      <View>
        <MapContainer />
      </View>
      /*<View
        style={{
          paddingTop: 20,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text> MainContainer </Text>
        <Button
          title={'test'}
          onPress={() => {
            this.props.navigation.dispatch(
              NavigationActions.setParams({
                test: 'testingii'
              })
            );
            this.props.navigation.navigate('Profile', {
              title: 'Profile',
              parentKey: this.props.navigation.state.key
            });
          }}
        />
      </View>*/
    );
  }
}
