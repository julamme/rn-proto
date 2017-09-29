//@flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
        <TextWithLabel
          style={styles.textContainer}
          contentStyle={styles.content}
          label={'Name:'}
          content={this.props.place.name}
        />

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
          content={this.props.place.price ? this.props.place.price : '0'}
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
    width: '50%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  content: {
    textAlign: 'right',
    alignSelf: 'flex-end',
    fontSize: 16
  }
});
