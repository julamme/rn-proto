//@flow
import React, { Component } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Slider,
  Dimensions
} from 'react-native';
import { inject } from 'mobx-react';
import colors from './../constants/colors';

@inject('rootStore')
export default class NewReviewModal extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      rating: 1,
      description: ''
    };
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.rootStore.placeStore.isCreatingReview}
          onRequestClose={() => console.log('request close')}
        >
          <View
            style={{
              padding: 2,
              position: 'absolute',
              top: Dimensions.get('window').height * 0.15,
              left: Dimensions.get('window').width * 0.15,
              bottom: 0,
              right: 0,
              width: '70%',
              height: '70%',
              backgroundColor: colors.pureWhite,
              borderWidth: 2,
              borderRadius: 10,
              borderColor: colors.lightGray
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: colors.aquaBlack,
                alignContent: 'center',
                alignSelf: 'center'
              }}
            >
              Add new review
            </Text>
            <Text>Rating: {this.state.rating}</Text>
            <Slider
              style={{ padding: 4 }}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={this.state.rating}
              onValueChange={rating => this.setState({ rating })}
            />
            <Text>Description:</Text>
            <TextInput
              value={this.state.description}
              onChangeText={description => this.setState({ description })}
            />
            <TouchableOpacity
              onPress={() =>
                this.props.rootStore.placeStore.addReview({
                  rating: this.state.rating,
                  description: this.state.description
                })}
            >
              <Text style={{ fontSize: 24 }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}