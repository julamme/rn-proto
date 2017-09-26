/** @flow */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import Permissions from 'react-native-permissions';
import MapView from 'react-native-maps';

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
          height: 400,
          width: 400,
          justifyContent: 'flex-end',
          alignItems: 'center'
        },
        map: {
          ...StyleSheet.absoluteFillObject
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
  region: ?Object
};

type Props = {};
export default class MapContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      locationPermission: 'undetermined',
      currentLocation: null,
      region: null
    };
  }

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
        console.log(this.state);
      },
      error => {
        console.error(error);
      }
    );
  };
  componentDidMount() {
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
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          scrollEnabled={true}
          zoomEnabled={true}
          mapType={mapSettings.mapType}
          showsUserLocation={mapSettings.showUserLocation}
          region={this.state.region}
          onRegionChange={this.onRegionChanged}
        />
      </View>
    );
  }
}
