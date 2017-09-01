import React, { Component } from 'react';
import { inject } from 'mobx';
import { addNavigationHelpers } from 'react-navigation';
import { AppNavigator } from '../AppNavigator';

type Props = {
    navStore: any,
}
@inject('navStore')
export default class AppWithNavigation extends Component {
    props: Props;

    render() {
      console.log(this.props);
      return (
        <AppNavigator
          navigation={addNavigationHelpers({
            dispatch: this.props.navStore.dispatch,
            state: this.store.navigationState,
          })}
        />
      );
    }
}
