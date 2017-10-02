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
import R from 'ramda';
import Permissions from 'react-native-permissions';
import MapView from 'react-native-maps';
import { NavigationActions } from 'react-navigation';
import Geofire from 'geofire';
import { inject, observer } from 'mobx-react';
import colors from './../../constants/colors';
import PermissionStatus from './../../constants/PermissionStatus';
import firebase from './../../firebase';
import RootStore from './../../stores/RootStore';

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
const locationResponses = PermissionStatus;
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
  showAddNewLocation: boolean,
  currentSelection: ?string
};

type Props = {
  navigation: any,
  rootStore: RootStore
};
const newMarkerRef = null;

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
      showAddNewLocation: false,
      currentSelection: null
    };
  }
  state: State;

  mapRef: any;

  requestPermission() {
    return Permissions.request('location');
  }

  onRegionChanged: (region: Object) => void = region => {
    this.setState({
      region
    });
  };

  startLocationUpdates: () => void = () => {
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
        this.startLocationUpdates();
      } else {
        this.requestPermission().then(_response => {
          this.setState({
            locationPermission:
              _response === locationResponses.allow ||
              _response === locationResponses.authorized
                ? locationResponses.authorized
                : locationResponses.denied
          });
          if (
            _response === locationResponses.allow ||
            _response === locationResponses.authorized
          ) {
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
          bottom: Dimensions.get('window').height * 0.15,
          padding: 10,
          borderRadius: 2,
          backgroundColor: colors.pureWhite,
          zIndex: 2
        }}
        onPress={() => {
          this.props.rootStore.placeStore.setCurrentPlaceLocation(
            this.state.currentNewMarker.latlng
          );
          this.props.navigation.navigate('NewPlace');
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
      return (
        <MapView.Marker
          title={'test'}
          coordinate={this.state.currentNewMarker.latlng}
        />
      );
    }
    return <View />;
  }
  //
  addMarkers() {
    return R.uniqBy(
      item => item.id,
      this.props.rootStore.placeStore.currentPlaces
    ).map(item => {
      return (
        <MapView.Marker
          key={item.id}
          identifier={item.id}
          title={item.value.name}
          onPress={event => {
            //this.mapRef.animateToCoordinate(event.nativeEvent.coordinate, 1);
            this.setState({
              currentSelection: event.nativeEvent.id,
              showAddNewLocation: false,
              currentNewMarker: null
            });
          }}
          coordinate={{
            longitude: item.value.longitude,
            latitude: item.value.latitude
          }}
        >
          <MapView.Callout
            onPress={() => {
              this.props.rootStore.placeStore.loadDetailsFor(
                this.state.currentSelection
                  ? this.state.currentSelection
                  : item.id
              );
              this.props.navigation.navigate('PlaceDetails');
            }}
          >
            <View>
              <Text style={{ color: colors.pureBlack }}>{item.value.name}</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }
  conditionalShowDetailsButton() {
    if (this.state.currentSelection && !this.state.showAddNewLocation) {
      return (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: Dimensions.get('window').height * 0.15,
            padding: 10,
            borderRadius: 2,
            backgroundColor: colors.pureWhite,
            zIndex: 2
          }}
          onPress={() => {
            this.props.rootStore.placeStore.loadDetailsFor(
              this.state.currentSelection
            );
            this.props.navigation.navigate('PlaceDetails');
          }}
        >
          <Text style={{ fontSize: 14, color: colors.darkGray }}>
            View Details
          </Text>
        </TouchableOpacity>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => (this.mapRef = ref)}
          style={styles.map}
          scrollEnabled={true}
          zoomEnabled={true}
          mapType={mapSettings.mapType}
          showsUserLocation={mapSettings.showUserLocation}
          region={this.state.region}
          onLongPress={this.onLongPress}
          onPress={() => {
            this.setState({
              showAddNewLocation: false,
              currentSelection: null,
              currentNewMarker: null
            });
          }}
          onRegionChange={this.onRegionChanged}
        >
          {this.addNewMarker()}
          {this.addMarkers()}
        </MapView>
        {this.conditionalAddLocationButton()}
        {this.conditionalShowDetailsButton()}
      </View>
    );
  }
}
