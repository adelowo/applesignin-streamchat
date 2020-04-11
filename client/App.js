import React, {Component} from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Login />
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
