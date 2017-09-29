import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import TextWithLabel from './common/TextWithLabel';
import colors from './../constants/colors';

const ReviewRow = ({ review }) => {
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: 48,
          height: 48
        }}
        source={{ uri: review.user.profilePicture }}
      />
      <View style={styles.row}>
        <TextWithLabel
          style={[styles.textContainer, styles.withBorder]}
          label={'Rating:'}
          content={review.rating}
        />
        <TextWithLabel
          style={styles.textContainer}
          label={'Description:'}
          content={review.description}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 2,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 4
  },
  row: { flexDirection: 'row', padding: 5 },
  textContainer: {
    marginLeft: 5,
    paddingRight: 2
  },
  withBorder: { borderRightColor: colors.lightGray, borderRightWidth: 1 }
});

export default ReviewRow;
