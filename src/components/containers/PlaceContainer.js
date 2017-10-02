//@flow
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image
} from 'react-native';
import { inject, observer } from 'mobx-react';
import colors from './../../constants/colors';
import PlaceInformation from './../PlaceInformation';
import NewReviewModal from './../NewReviewModal';
import TextWithLabel from './../../components/common/TextWithLabel';
import ReviewRow from './../ReviewRow';
import Review from './../../models/Review';
import { RootStoreType } from './../../stores/RootStore';

type State = {
  showReviewModal: boolean
};
type Props = {
  rootStore: RootStore
};
@inject('rootStore')
@observer
export default class PlaceContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showReviewModal: false
    };
  }

  state: State;
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
        //$FlowFixMe
        <FlatList
          data={this.props.rootStore.placeStore.currentPlace.reviews}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => <ReviewRow review={item} />}
        />
      );
    }
    return <View />;
  }

  renderImage() {
    if (
      this.props.rootStore.placeStore.currentPlace &&
      this.props.rootStore.placeStore.currentPlace.imageUrl
    ) {
      return (
        <Image
          style={{ flex: 1 }}
          source={{
            uri: this.props.rootStore.placeStore.currentPlace.imageUrl
          }}
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
          {this.renderImage()}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: Dimensions.get('window').height * 0.25,
              alignSelf: 'center',
              backgroundColor: colors.dirtyWhite,
              padding: 7,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: colors.darkGray
            }}
            onPress={() =>
              this.props.rootStore.placeStore.setIsCreatingReview(true)}
          >
            <Text style={{ color: colors.pureBlack }}>Add review</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContainer}>
          {this.renderPlaceInformation()}
        </View>
        <View style={styles.reviewsContainer}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: 'center',
              color: colors.pureBlack
            }}
          >
            Reviews
          </Text>
          {this.renderList()}
        </View>
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
    backgroundColor: colors.debugYellow
  },
  detailsContainer: { flex: 3, flexDirection: 'column' },
  reviewsContainer: {
    flex: 5,
    padding: 2,
    flexDirection: 'column'
  }
});
