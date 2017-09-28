//@flow
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import { inject, observer } from 'mobx-react';
import colors from './../../constants/colors';
import PlaceInformation from './../PlaceInformation';
import NewReviewModal from './../NewReviewModal';

type State = {
  showReviewModal: boolean
};
@inject('rootStore')
@observer
export default class PlaceContainer extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      showReviewModal: false
    };
  }
  renderPlaceInformation() {
    if (this.props.rootStore.placeStore.currentPlace) {
      return (
        <PlaceInformation
          style={styles.placeInformation}
          place={this.props.rootStore.placeStore.currentPlace}
        />
      );
    }
    return <View />;
  }
  renderReviewModal() {
    if (this.props.rootStore.placeStore.isCreatingReview) {
      return (
        <View
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        >
          <NewReviewModal />
        </View>
      );
    }
    return <View />;
  }
  renderList() {
    if (this.props.rootStore.placeStore.currentPlace) {
      return (
        <FlatList
          style={{ marginLeft: 8, marginRight: 8 }}
          data={this.props.rootStore.placeStore.currentPlace.reviews}
          keyExtractor={(item, key) => key}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text>{item.user.displayName} </Text>
              <Text>{item.rating} </Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      );
    }
    return <View />;
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderReviewModal()}
        <View style={styles.imageContainer}>
          <Text>ImageBox</Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: Dimensions.get('window').height * 0.3,
              backgroundColor: colors.dirtyWhite,
              padding: 7,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: colors.darkGray
            }}
            onPress={() =>
              this.props.rootStore.placeStore.setIsCreatingReview(true)}
          >
            <Text>Add review</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={{ fontSize: 20, alignSelf: 'center' }}>Reviews</Text>
          {this.renderPlaceInformation()}
        </View>
        <View style={styles.reviewsContainer}>{this.renderList()}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.pureWhite
  },
  imageContainer: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.debugYellow
  },
  detailsContainer: { flex: 3, flexDirection: 'column' },
  reviewsContainer: { flex: 5, flexDirection: 'column' }
});
