/** @flow */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import Permissions from 'react-native-permissions';
import MapView from 'react-native-maps';
import { NavigationActions } from 'react-navigation';
import Geofire from 'geofire';
import { inject, observer } from 'mobx-react';
import colors from './../../constants/colors';
import firebase from './../../firebase';

const styles =
  Platform.OS === 'ios'
    ? StyleSheet.create({
        container: {
          position: 'relative',
          height: '100%'
        },
        map: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }
      })
    : StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          justifyContent: 'flex-end',
          alignItems: 'center'
        },
        map: {
          ...StyleSheet.absoluteFillObject,
          zIndex: 1
        }
      });
const locationResponses = {
  authorized: 'authorized',
  denied: 'denied',
  restricted: 'restricted',
  undetermined: 'undetermined',
  allow: 'allow',
  notAllow: 'not allow'
};
const mapSettings = {
  mapType: 'standard',
  showUserLocation: true,
  latDelta: 0.04,
  lonDelta: 0.04
};
type State = {
  locationPermission: ?string,
  currentLocation: ?Coordinates,
  region: ?Object,
  markers: Array<Object>,
  currentNewMarker: any,
  showAddNewLocation: boolean
};

type Props = {
  navigation: any,
  rootStore: RootStore
};

@inject('rootStore')
@observer
export default class MapContainer extends Component<Props, State> {
  static navigationOptions = {
    header: { visible: false }
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      locationPermission: 'undetermined',
      currentLocation: null,
      region: null,
      markers: [],
      showAddNewLocation: false
    };
  }
  state: State;

  requestPermission() {
    return Permissions.request('location');
  }

  onRegionChanged: (region: Object) => void = region => {
    console.log(region);
  };

  startLocationUpdates: () => void = () => {
    console.log('startlocationUpdates');
    navigator.geolocation.getCurrentPosition(
      response => {
        this.setState({
          currentLocation: response.coords,
          region: {
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
            latitudeDelta: mapSettings.latDelta,
            longitudeDelta: mapSettings.lonDelta
          }
        });
        this.props.rootStore.placeStore.refreshPlacesToShow([
          response.coords.latitude,
          response.coords.longitude
        ]);
      },
      error => {
        console.error(error);
      }
    );
  };
  componentDidMount() {
    this.checkPermissions();
  }

  checkPermissions: () => void = () => {
    Platform.OS === 'android'
      ? this.checkPermissionsAndroid()
      : this.checkPermissionsIOS();
  };

  checkPermissionsAndroid() {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then(status => {
      console.log(`android ${status}`);
      if (status) {
        this.setState({
          locationPermission: locationResponses.authorized
        });
        this.startLocationUpdates();
      } else {
        this.requestAndroidPermission();
      }
    });
  }

  async requestAndroidPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Hotel Relief location permission',
          message:
            'Hotel Relief needs to use your location for displaying places.'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.startLocationUpdates();
      } else {
        console.warn('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  checkPermissionsIOS: () => void = () => {
    Permissions.check('location', 'always').then(response => {
      if (response === locationResponses.authorized) {
        this.setState({
          locationPermission: response
        });
        console.log('should start updates');
        this.startLocationUpdates();
      } else {
        this.requestPermission().then(_response => {
          console.log(_response);
          this.setState({
            locationPermission:
              _response === locationResponses.allow ||
              _response === locationResponses.authorized
                ? locationResponses.authorized
                : locationResponses.denied
          });
          console.log(this.state);
          if (
            _response === locationResponses.allow ||
            _response === locationResponses.authorized
          ) {
            console.log('shoould start 2');
            this.startLocationUpdates();
          }
        });
      }
    });
  };

  onLongPress: (event: any) => void = event => {
    this.setState({
      currentNewMarker: {
        latlng: event.nativeEvent.coordinate
      },
      showAddNewLocation: true
    });
  };

  conditionalAddLocationButton() {
    if (!this.state.showAddNewLocation) {
      return <View />;
    }
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 50,
          padding: 10,
          borderRadius: 2,
          backgroundColor: colors.pureWhite,
          zIndex: 2
        }}
        onPress={() => {
          console.log(this.props);
          this.props.rootStore.placeStore.setCurrentPlaceLocation(
            this.state.currentNewMarker.latlng
          );
          this.props.rootStore.navStore.dispatch(
            NavigationActions.navigate({ routeName: 'NewPlace' }),
            false
          );
          /*this.props.navigation.navigate('NewLocation');
          this.props.placeStore.setCurrentPlaceLocation(
            this.state.currentNewMarker.latlng
          );*/
        }}
      >
        <Text style={{ fontSize: 14, color: colors.darkGray }}>
          Add new location
        </Text>
      </TouchableOpacity>
    );
  }
  addNewMarker() {
    if (this.state.currentNewMarker) {
      console.log('new marker');
      console.log(this.state.currentNewMarker.latlng);
      return (
        <MapView.Marker
          title={'test'}
          coordinate={this.state.currentNewMarker.latlng}
        />
      );
    }
    return <View />;
  }
  addMarkers() {
    return this.props.rootStore.placeStore.shownPlaces.map(item => {
      console.log('singleitem');
      console.log(item);
      console.log({ longitude: item.longitude, latitude: item.latitude });

      return (
        <MapView.Marker
          key={item.id}
          identifier={item.id}
          title={item.name}
          coordinate={{ longitude: item.longitude, latitude: item.latitude }}
        />
      );
    });
  }
  render() {
    console.log(this.props.rootStore.placeStore);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          scrollEnabled={true}
          zoomEnabled={true}
          mapType={mapSettings.mapType}
          showsUserLocation={mapSettings.showUserLocation}
          region={this.state.region}
          onLongPress={this.onLongPress}
          onRegionChange={this.onRegionChanged}
        >
          {this.addNewMarker()}
          {this.addMarkers()}
        </MapView>
        {this.conditionalAddLocationButton()}
      </View>
    );
  }
}
