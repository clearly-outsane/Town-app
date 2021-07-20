/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import UnityView from '@asmadsen/react-native-unity-view';
import VideoView from './VideoView';

import {View} from 'react-native';

class App extends React.Component {
    state = {netId: -1, channelName: '', peers: [], message: ''};

    onMessage(event) {
        this.setState({message: event});
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

                <VideoView message={this.state.message} />
            </View>
        );
    }
}

export default App;
