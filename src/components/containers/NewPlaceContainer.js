//@flow
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  PermissionsAndroid,
  Dimensions
} from 'react-native';
import { inject } from 'mobx-react';
import Permissions from 'react-native-permissions';
import * as ImagePicker from 'react-native-image-picker';
import { NavigationActions } from 'react-navigation';
import Place from './../../models/Place';
import PermissionStatus from './../../constants/PermissionStatus';
import InputWithLabel from './../common/InputWithLabel';
import colors from './../../constants/colors';
type State = {
  place: Place,
  photoUri: string,
  photoFileName: string
};

type Props = {
  rootStore: RootStore
};

const photoOptions = {
  mediaType: 'photo',
  noData: true,
  quality: 0.9
};

@inject('rootStore')
export default class NewPlaceContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      place: new Place(),
      photoUri: ''
    };
  }

  save: () => void = () => {
    this.props.rootStore.placeStore.mergeAndSavePlace(
      this.state.place,
      this.state.photoUri,
      this.state.photoFileName
    );
    this.props.navigation.goBack();
  };

  addPhoto: () => void = () => {
    if (Platform.OS === 'ios') {
      this.checkPermissionsIOS().then(response => {
        if (response === PermissionStatus.authorized) {
          this.showImagePicker();
        } else {
          this.requestIOSPermissions().then(response => {
            if (response === PermissionStatus.authorized) {
              this.showImagePicker();
            }
          });
        }
      });
    } else {
      this.checkAndroidPermissions().then(granted => {
        if (granted) {
          this.showImagePicker();
        }
      });
    }
  };

  checkPermissionsIOS: () => Promise<*> = () => {
    return Permissions.check('photo').then();
  };

  checkAndroidPermissions: () => Promise<*> = () => {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA
    ).then(granted => {
      if (granted) {
        return granted;
      } else {
        return this.requestAndroidPermission();
      }
    });
  };

  async requestAndroidPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Hotel Relief Camera Permission',
          message:
            'Hotel Relief needs access to your camera ' +
            'so you can take pictures.'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  requestIOSPermissions: () => Promise<*> = () => {
    return Permissions.request('photo');
  };

  showImagePicker: () => void = () => {
    ImagePicker.showImagePicker(photoOptions, response => {
      if (response.error) {
        console.error('error taking photo', response.error);
      }
      if (response.didCancel) {
        console.log('user canceled');
      }
      this.setState({
        photoUri: response.uri,
        photoFileName: response.fileName
      });
    });
  };

  shouldRenderImage() {
    if (this.state.photoUri && this.state.photoUri.length > 1) {
      return (
        <View style={styles.imageRow}>
          <View
            style={{
              flex: 9
            }}
          >
            <Image
              style={{
                flex: 1,
                paddingLeft: 6,
                paddingRight: 6,
                width: Dimensions.get('window').width
              }}
              source={{ uri: this.state.photoUri }}
            />
          </View>

          <View style={{ flex: 1 }} />
        </View>
      );
    }
    return <View />;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: colors.pureWhite
        }}
      >
        <View style={{ flex: 1, flexDirection: 'row' }} />
        <View style={[styles.rowContainer]}>
          <InputWithLabel
            style={{ flex: 9 }}
            label={'Name'}
            onChangeText={text => {
              this.state.place.name = text;
            }}
          />
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.rowContainer}>
          <InputWithLabel
            style={{ flex: 9 }}
            label={'Price'}
            onChangeText={text => {
              this.state.place.price = text;
            }}
          />
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.rowContainer}>
          <InputWithLabel
            style={{ flex: 9 }}
            label={'Description'}
            onChangeText={text => {
              this.state.place.description = text;
            }}
          />
          <View style={{ flex: 1 }} />
        </View>

        {this.shouldRenderImage()}

        <View
          style={[
            styles.rowContainer,
            { alignItems: 'center', justifyContent: 'center' }
          ]}
        >
          <TouchableOpacity
            style={{
              margin: 5,
              padding: 5,
              borderRadius: 4,
              backgroundColor: colors.aqua
            }}
            onPress={this.addPhoto}
          >
            <Text style={{ color: colors.pureBlack }}>Add photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              margin: 5,
              padding: 5,
              borderRadius: 4,
              backgroundColor: colors.aqua
            }}
            onPress={this.save}
          >
            <Text style={{ color: colors.pureBlack }}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 8 }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  rowContainer: {
    flex: 2,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  imageRow: {
    flex: 7,
    marginTop: 5,
    marginBottom: 5,
    width: Dimensions.get('window').width,
    flexDirection: 'row'
  }
});
