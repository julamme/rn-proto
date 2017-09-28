//@flow
import React, { Component } from 'react';
import { View } from 'react-native';
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
        <TextWithLabel label={'Name'} content={this.props.place.name} />
        <TextWithLabel
          label={'Description'}
          content={this.props.place.description}
        />
        <TextWithLabel
          label={'Address'}
          content={
            this.props.place.address ? this.props.place.address : 'debug 2'
          }
        />
        <TextWithLabel
          label={'Overall rating'}
          content={this.props.place.rating ? this.props.place.rating : '3'}
        />
        <TextWithLabel
          label={'Price'}
          content={this.props.place.price ? this.props.place.price : '0'}
        />
      </View>
    );
  }
}
