//@flow
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { inject } from 'mobx-react';
import { NavigationActions } from 'react-navigation';
import Place from './../../models/Place';
import InputWithLabel from './../common/InputWithLabel';
import colors from './../../constants/colors';
type State = {
  place: Place
};

type Props = {
  rootStore: RootStore
};
@inject('rootStore')
export default class NewPlaceContainer extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      place: new Place()
    };
  }

  save: () => void = () => {
    this.props.rootStore.placeStore.mergeAndSavePlace(this.state.place);
    this.props.rootStore.navStore.dispatch(
      NavigationActions.navigate({ routeName: 'Main' })
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-around'
        }}
      >
        <View style={styles.rowContainer}>
          <InputWithLabel
            style={{ flex: 9 }}
            label={'name'}
            onChangeText={text => {
              console.log(text);
              this.state.place.name = text;
            }}
          />
          <View style={{ flex: 1 }} />
        </View>
        <View style={styles.rowContainer}>
          <InputWithLabel
            style={{ flex: 9 }}
            label={'description'}
            onChangeText={text => {
              console.log(text);
              this.state.place.description = text;
            }}
          />
          <View style={{ flex: 1 }} />
        </View>
        <View
          style={[
            styles.rowContainer,
            { alignItems: 'center', justifyContent: 'center' }
          ]}
        >
          <TouchableOpacity
            style={{
              padding: 5,
              borderRadius: 4,
              backgroundColor: colors.aqua
            }}
            onPress={this.save}
          >
            <Text>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 8 }} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  rowContainer: { flex: 1, flexDirection: 'row' }
});
