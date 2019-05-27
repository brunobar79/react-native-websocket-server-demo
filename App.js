/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNWebsocketServer from 'react-native-websocket-server';


export default class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      messages: [],
      status: 'stopped',
      clients: 0,
      error: ''
    }
    this.subscriptions = [];
  }
  componentDidMount(){
    // TODO: What to do with the module?
    const server = new RNWebsocketServer('127.0.0.1', 9001);
    server.start();
    this.subscriptions.push(server.eventEmitter.addListener(
      'onStart',
      () => {
        this.setState({status:'started'});
      }
    ));

    this.subscriptions.push(server.eventEmitter.addListener(
      'onStop',
      () => {
        this.setState({status:'stopped'});
      }
    ));

   this.subscriptions.push(server.eventEmitter.addListener(
      'onOpen',
      () => {
        this.setState({clients: this.state.clients + 1 });
      }
    ));
    this.subscriptions.push(server.eventEmitter.addListener(
      'onClose',
      () => {
        this.setState({clients: this.state.clients - 1 });
      }
    ));
    
    this.subscriptions.push(server.eventEmitter.addListener(
      'onMessage',
      (message) => {
        this.setState({messages: [...this.state.messages, message]});
      }
    ));

    this.subscriptions.push(server.eventEmitter.addListener(
      'onError',
      (error) => {
        this.setState({error});
      }
    ));
  }

  componentWillUnmount(){
    this.subscriptions.forEach((subscription)=>subscription.remove());
  }

  renderMessages(){
    if(this.state.messages.length){
      const messages =  this.state.messages.map((msg, i)=>(<Text key={`msg_${i}`} style={styles.instructions}>{JSON.stringify(msg)}}</Text>));
      return (<React.Fragment>
                <Text style={styles.msgTitle}>MESSAGES:</Text>
                <View style={styles.messages}>
                  {messages}
                </View>
              </React.Fragment>
      );
    }

    return null;

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Websockets server</Text>
        <Text style={styles.instructions}>Server status: {this.state.status}</Text>
        <Text style={styles.instructions}>Client(s) connected: {this.state.clients.toString()}</Text>
        { this.renderMessages() }
        <Text style={styles.instructions}>{this.state.error}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  messages:{
    flexDirection: 'column',
  },
  msg: {
    flex: 1,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  msgTitle: {
    marginVertical: 15,
  }
});
