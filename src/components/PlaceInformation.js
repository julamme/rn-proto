//@flow
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Place from './../models/Place';
import TextWithLabel from './common/TextWithLabel';
import colors from './../constants/colors';

type Props = {
  place: Place
};
export default class PlaceInformation extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
          },
          this.props.style
        ]}
      >
        <Text
          style={{ fontSize: 20, alignSelf: 'center', textAlign: 'center' }}
        >
          {this.props.place.name}
        </Text>

        <TextWithLabel
          style={styles.textContainer}
          contentStyle={styles.content}
          label={'Address:'}
          content={
            this.props.place.address ? this.props.place.address : 'debug 2'
          }
        />
        <TextWithLabel
          style={styles.textContainer}
          contentStyle={styles.content}
          label={'Overall rating:'}
          content={this.props.place.rating ? this.props.place.rating : '3'}
        />
        <TextWithLabel
          style={styles.textContainer}
          contentStyle={styles.content}
          label={'Price:'}
          content={
            this.props.place.price || this.props.place.price > 0
              ? this.props.place.price
              : 'Free'
          }
        />
        <TextWithLabel
          style={styles.textContainer}
          contentStyle={styles.content}
          label={'Description:'}
          content={this.props.place.description}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    alignItems: 'flex-end'
  }
});
