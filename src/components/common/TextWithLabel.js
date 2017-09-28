//@flow
import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import colors from './../../constants/colors';

const TextWithLabel = props => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.label}>{props.label} </Text>
      <Text style={styles.content}>{props.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  label: {
    flex: 4
  },
  content: {
    flex: 10,
    fontSize: 16
  }
});

export default TextWithLabel;
