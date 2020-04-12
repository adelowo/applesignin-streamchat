import React, {Component} from 'react';
import {View} from 'react-native';
import {
  Chat as StreamChat,
  Channel,
  MessageList,
  MessageInput,
} from 'stream-chat-react-native';

export default class Chat extends Component {
  render() {
    const channel = this.props.chatClient.channel('livestream', 'General');
    channel.watch();

    return (
      <StreamChat client={this.props.chatClient}>
        <Channel channel={channel}>
          <View style={{display: 'flex', height: '100%'}}>
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
      </StreamChat>
    );
  }
}
