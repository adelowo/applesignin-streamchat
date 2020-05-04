import React, {Component} from 'react';
import {View, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthError,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import {StreamChat} from 'stream-chat';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.chatClient = new StreamChat('wyw7beuuwb2p');
    this.state = {
      hideSigninButton: false,
    };
  }

  onAppleButtonPress = async () => {
    this.setState({
      hideSigninButton: true,
    });

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      // get current authentication state for user
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        console.log('User apple sign in auth authorized');
        axios
          .post('https://36b0bb03.ngrok.io/auth', {
            username: appleAuthRequestResponse.user,
            code: appleAuthRequestResponse.authorizationCode,
          })
          .then(res => {
            console.log(res.data);
            if (res.data.status) {
              this.chatClient.setUser(
                {
                  id: res.data.username,
                  username: res.data.username,
                  image:
                    'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
                },
                res.data.token
              );
              this.props.cb(this.chatClient);
            }
          })
          .catch(err => {
            this.setState({
              hideSigninButton: false,
            });

            Alert.alert('Auth', 'could not set up Stream chat');
            console.log('Could not authenticate user.. ', err);
          });

        return;
      }

      Alert.alert('Auth', 'Could not authenticate you');
    } catch (err) {
      if (err === AppleAuthError.CANCELED) {
        this.setState({
          hideSigninButton: false,
        });
        Alert.alert(
          'Authentication',
          'You canceled the authentication process'
        );
      }

      console.log(err);
    }
  };

  componentDidMount() {
    return appleAuth.onCredentialRevoked(() => {
      console.log('User auth has been revoked');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hideSigninButton ? (
          <ActivityIndicator size="large" />
        ) : (
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 160,
              height: 45,
            }}
            onPress={() => this.onAppleButtonPress()}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
