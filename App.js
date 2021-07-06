/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import UnityView from '@asmadsen/react-native-unity-view';
import VideoView from './components/VideoView';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    NativeModules,
    Button,
} from 'react-native';

class App extends React.Component {
    state = {callState: 0};

    onMessage(event) {
        console.log('OnUnityMessage: ', event); // OnUnityMessage: click
        this.setState({callState: event});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <UnityView
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: -1,
                    }}
                    onMessage={this.onMessage.bind(this)}
                />

                <VideoView callState={this.state.callState} />
            </View>
        );
    }
}

export default App;
