//@flow
import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import colors from './../../constants/colors';

const TextWithLabel = props => {
  return (
    <View style={props.style}>
      <Text style={[styles.fontcolor, props.labelStyle]}>{props.label} </Text>
      <Text style={[styles.fontcolor, props.contentStyle]}>
        {props.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fontcolor: {
    color: colors.pureBlack
  }
});

export default TextWithLabel;
