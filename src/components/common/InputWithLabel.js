//@flow
import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';

export default class InputWithLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue ? props.initialValue : ''
    };
  }
  onChangeText: (value: ?string) => void = value => {
    this.setState({
      value
    });
    if (this.props.onChangeText) {
      this.props.onChangeText(this.state.value);
    }
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={{ flex: 1, alignSelf: 'center' }}>{this.props.label}</Text>
        <TextInput
          style={{ flex: 4 }}
          value={this.state.value}
          onChangeText={text => this.onChangeText(text)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
