/**
 * @flow
 */
import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation';

type Props = {
    navigation: any,
}

class About extends Component {
    props: Props;

    updateHome = (params) => {
      const { state, dispatch, goBack } = this.props.navigation;
      dispatch(NavigationActions.setParams({
        params,
        key: state.params.parentKey,
      }));

      goBack();
    }
    render() {
      return (
        <View>
          <Text> test</Text>
          <TouchableHighlight title="done" onPress={this.updateHome('testing')} >
            <Text>Click me</Text>
          </TouchableHighlight>
        </View>
      );
    }
}

export default About;
