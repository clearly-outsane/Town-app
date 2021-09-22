/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Dimensions, StatusBar} from 'react-native';
import UnityView, {UnityModule} from '@asmadsen/react-native-unity-view';
import VideoView from './VideoView';
import Orientation from 'react-native-orientation';
import {userProfile, channelId, community_roles} from './Data';

const GAME_OBJECT_NAME = 'GameState';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.unityRef = React.createRef();
    }

    state = {
        orientation: '',
        message: '',
        width: null,
        height: null,
    };

    componentDidUpdate() {}

    async postMessageToUnity() {
        const isUnityReady = await UnityModule.isReady();
        if (isUnityReady) {
            UnityModule.postMessage(
                GAME_OBJECT_NAME,
                'passUserProfile',
                JSON.stringify(userProfile),
            );
            UnityModule.postMessage(
                GAME_OBJECT_NAME,
                'passChannelId',
                channelId,
            );
            UnityModule.postMessage(
                GAME_OBJECT_NAME,
                'passRoleDataFromCommunity',
                JSON.stringify(community_roles),
            );
        }
    }

    componentDidMount() {
        Orientation.lockToLandscape();
        Orientation.addOrientationListener(this._orientationDidChange);
        Dimensions.addEventListener('change', this.onDimensionsChange);
        setTimeout(() => {
            this.postMessageToUnity();
        }, 5000);
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
        Dimensions.removeEventListener('change', this.onDimensionsChange);
    }

    onDimensionsChange = ({window, screen}) => {
        // console.log('Dimensions changed ! ', window, screen);
    };

    _orientationDidChange = orientation => {
        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout
            console.log('Set to landscape');

            Dimensions.get('window').width > Dimensions.get('window').height
                ? this.setState({
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height,
                  })
                : this.setState({
                      width: Dimensions.get('window').height,
                      height:
                          Dimensions.get('window').width -
                          StatusBar.currentHeight,
                  });
        } else {
            // do something with portrait layout
        }
    };

    onMessage(event) {
        this.setState({message: event});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <UnityView
                    style={{
                        flex: 1,
                    }}
                    onMessage={this.onMessage.bind(this)}
                    ref={this.unityRef}
                />
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                    <VideoView
                        message={this.state.message}
                        dynamicStyles={{
                            width: this.state.width,
                            height: this.state.height,
                        }}
                    />
                </View>
            </View>
        );
    }
}

export default App;
