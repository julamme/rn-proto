import React from 'react';
import { StyleSheet } from 'react-native';
import { observer, Provider } from 'mobx-react';
import AppWithNavigation from './app/containers/AppWithNavigation';
import NavigationStore from './app/stores/NavigationStore';

export default @observer class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    // initialize the navigation store
    this.store = new NavigationStore();
  }
  render() {
    return (
      <Provider navStore={new NavigationStore()}> 
        <AppWithNavigation />
      </Provider>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
