import React, {Component} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import RtcEngine, {
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
} from 'react-native-agora';

import {PermissionsAndroid} from 'react-native';

import styles from './Style';

const requestCameraAndAudioPermission = async () => {
    try {
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
            granted['android.permission.RECORD_AUDIO'] ===
                PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.CAMERA'] ===
                PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('You can use the cameras & mic');
        } else {
            console.log('Permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '458915b8278f49fd84d5db3da66ca0a5',
            token: '006458915b8278f49fd84d5db3da66ca0a5IAAvkgl43v1LxDqAaweDLSDz7QggG4RZt/I0bwq3Qipa9U2x7RgAAAAAEACqPfBqcfTeYAEAAQBw9N5g',
            channelName: 'lol',
            joinSucceed: false,
            peerIds: [],
        };
        if (Platform.OS === 'android') {
            // Request required permissions from Android
            requestCameraAndAudioPermission().then(() => {
                console.log('requested!');
            });
        }
    }

    componentDidMount() {
        this.init();
    }

    /**
     * @name init
     * @description Function to initialize the Rtc Engine, attach event listeners and actions
     */
    init = async () => {
        const {appId} = this.state;
        this._engine = await RtcEngine.create(appId);
        await this._engine.enableVideo();

        this._engine.addListener('Warning', warn => {
            console.log('Warning', warn);
        });

        this._engine.addListener('Error', err => {
            console.log('Error', err);
        });

        this._engine.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed);
            // Get current peer IDs
            const {peerIds} = this.state;
            // If new user
            if (peerIds.indexOf(uid) === -1) {
                this.setState({
                    // Add peer ID to state array
                    peerIds: [...peerIds, uid],
                });
            }
        });

        this._engine.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason);
            const {peerIds} = this.state;
            this.setState({
                // Remove peer ID from state array
                peerIds: peerIds.filter(id => id !== uid),
            });
        });

        // If Local user joins RTC channel
        this._engine.addListener(
            'JoinChannelSuccess',
            (channel, uid, elapsed) => {
                console.log('JoinChannelSuccess', channel, uid, elapsed);
                // Set state variable to true
                this.setState({
                    joinSucceed: true,
                });
            },
        );
    };

    /**
     * @name startCall
     * @description Function to start the call
     */
    startCall = async () => {
        // Join Channel using null token and channel name
        await this._engine?.joinChannel(
            this.state.token,
            this.state.channelName,
            null,
            0,
        );
    };

    /**
     * @name endCall
     * @description Function to end the call
     */
    endCall = async () => {
        await this._engine?.leaveChannel();
        this.setState({peerIds: [], joinSucceed: false});
    };

    render() {
        return (
            <View style={styles.max}>
                <View style={styles.max}>
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity
                            onPress={this.startCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> Start Call </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.endCall}
                            style={styles.button}>
                            <Text style={styles.buttonText}> End Call </Text>
                        </TouchableOpacity>
                    </View>
                    {this._renderVideos()}
                </View>
            </View>
        );
    }

    _renderVideos = () => {
        const {joinSucceed} = this.state;
        return joinSucceed ? (
            <View style={styles.fullView}>
                <RtcLocalView.SurfaceView
                    style={styles.localview}
                    channelId={this.state.channelName}
                    renderMode={VideoRenderMode.Hidden}
                />
                {this._renderRemoteVideos()}
            </View>
        ) : null;
    };

    _renderRemoteVideos = () => {
        const {peerIds} = this.state;
        return (
            <ScrollView
                style={styles.remoteContainer}
                contentContainerStyle={{paddingHorizontal: 2.5}}
                horizontal={true}>
                {peerIds.map(value => {
                    return (
                        <RtcRemoteView.SurfaceView
                            style={styles.remote}
                            uid={value}
                            channelId={this.state.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true}
                        />
                    );
                })}
            </ScrollView>
        );
    };
}
