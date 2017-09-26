import React from 'react';
import { Text, View, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class MainContainer extends React.Component {
  render() {
    console.log(this.props);
    return (
      <View
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
      </View>
    );
  }
}
