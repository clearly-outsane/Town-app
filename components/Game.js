/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, Dimensions, StatusBar} from 'react-native';
import UnityView from '@asmadsen/react-native-unity-view';
import VideoView from './VideoView';
import Orientation from 'react-native-orientation';

class App extends React.Component {
    state = {
        orientation: '',
        message: '',
        width: null,
        height: null,
    };

    componentDidMount() {
        Orientation.lockToLandscape();
        Orientation.addOrientationListener(this._orientationDidChange);
        Dimensions.addEventListener('change', this.onDimensionsChange);
    }

    componentWillUnmount() {
        Orientation.unlockAllOrientations();
        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);
        Dimensions.removeEventListener('change', this.onDimensionsChange);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevState);
    }

    onDimensionsChange = ({window, screen}) => {
        console.log('Dimensions changed ! ', window, screen);
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
                {/* <UnityView
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: -1,
                        height: '100%',
                    }}
                    onMessage={this.onMessage.bind(this)}
                /> */}

                <VideoView
                    message={this.state.message}
                    dynamicStyles={{
                        width: this.state.width,
                        height: this.state.height,
                        backgroundColor: '#0093E9',
                    }}
                />
            </View>
        );
    }
}

export default App;
