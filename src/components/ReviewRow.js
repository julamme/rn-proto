import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const ReviewRow = props => {
  console.log('new row');
  console.log(props);
  return (
    <View>
      <Image
        style={{ flex: 1 }}
        source={{ uri: props.review.user.profilePicture }}
      />
      <View style={{ flex: 1 }}>
        <Text>{props.review.user.displayName} </Text>
        <Text>{props.review.rating} </Text>
        <Text>{props.review.description}</Text>
      </View>
    </View>
  );
};

export default ReviewRow;
