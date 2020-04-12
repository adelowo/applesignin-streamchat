import React, {Component} from 'react';
import {View, SafeAreaView} from 'react-native';
import Login from './Login';
import Chat from './Chat';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
    };
    this.chatClient = null;
  }

  onLoginSuccessCallback = chatClient => {
    this.chatClient = chatClient;
    this.setState({
      isAuthenticated: true,
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.isAuthenticated && this.chatClient !== null ? (
            <Chat chatClient={this.chatClient} />
          ) : (
            <Login cb={this.onLoginSuccessCallback} />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
