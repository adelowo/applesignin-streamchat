import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
          .post('https://c1ebc8c3.ngrok.io/auth', {
            username: appleAuthRequestResponse.user,
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
        <View style={styles.email}>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.password}>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity disabled={this.state.hideSigninButton}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </View>
        </TouchableOpacity>
        {!this.state.hideSigninButton && (
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
  button: {
    width: 325,
    borderColor: 'white',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderRadius: 24,
    marginTop: 20,
    backgroundColor: '#0080EF',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  welcomeContainer: {
    flex: 1,
  },
  email: {
    width: 325,
    borderColor: '#CFD0D1',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    backgroundColor: '#F5F6F7',
  },
  password: {
    width: 325,
    borderColor: '#CFD0D1',
    borderWidth: 1,
    height: 50,
    padding: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#F5F6F7',
  },
});
