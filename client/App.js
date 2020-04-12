import React, {Component} from 'react';
import {View, SafeAreaView} from 'react-native';
import Login from './Login';
import axios from 'axios';
import {StreamChat} from 'stream-chat';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      currentUser: null,
    };

    this.chatClient = new StreamChat('wyw7beuuwb2p');
  }

  onLoginSuccessCallback = userID => {
    return axios
      .post('https://c1ebc8c3.ngrok.io/auth', {})
      .then(res => {
        if (res.data.status) {
          this.chatClient.setUser(
            {
              id: userID,
              username: userID,
              image:
                'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
            },
            res.data.token
          );
          this.setState({
            isAuthenticated: true,
          });
          return;
        }
      })
      .catch(err => {
        return err;
      });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {!this.state.isAuthenticated || this.state.currentUser === null ? (
            <Login cb={userID => this.onLoginSuccessCallback(userID)} />
          ) : (
            <View style={[{flex: 1}]} />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default App;
