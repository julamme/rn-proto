import React from 'react';
import { Text, View } from 'react-native';

export default class LocationContainer extends React.Component {
  render() {
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
        <Text> LocationContainer </Text>
      </View>
    );
  }
}