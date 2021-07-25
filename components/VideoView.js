import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    PermissionsAndroid,
} from 'react-native';
import RtcEngine, {
    RtcLocalView,
    RtcRemoteView,
    VideoRenderMode,
} from 'react-native-agora';
import FAIcon from 'react-native-vector-icons/FontAwesome';

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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: '0ba24239f1d341798594240b204f8835',
            token: null,
            channelName: 'lol',
            joinSucceed: false,
            peerIds: [],
            proximityPeers: [],
            netId: -1,
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

    componentDidUpdate(prevProps) {
        if (prevProps.dynamicStyles !== this.props.dynamicStyles) {
            console.log(this.props.dynamicStyles);
        }
        if (prevProps.message !== this.props.message) {
            msg = this.props.message;
            console.log(
                'OnUnityMessage: ',
                msg,
                'received on',
                this.state.netId,
            );
            const parsedJson = JSON.parse(msg);

            if (parsedJson.action === 'Initial') {
                this.setState(
                    {
                        ...this.state,
                        netId: parseInt(parsedJson.netId),
                    },
                    this.startCall,
                );
            }

            if (parsedJson.action === 'EnterProximityMeeting') {
                const index = this.state.proximityPeers.indexOf(
                    parsedJson.name,
                );
                if (index === -1) {
                    uid = parseInt(parsedJson.name);
                    this._engine.muteRemoteVideoStream(uid, false);
                    this._engine.muteRemoteAudioStream(uid, false);
                    this.setState({
                        ...this.state,
                        proximityPeers: [
                            ...this.state.proximityPeers,
                            parsedJson.name,
                        ],
                    });
                }
                console.log(
                    'Adding : ',
                    parsedJson.name,
                    'to',
                    this.state.netId,
                );
            }

            if (parsedJson.action === 'LeaveProximityMeeting') {
                const index = this.state.proximityPeers.indexOf(
                    parsedJson.name,
                );

                var tempPeers = this.state.proximityPeers;

                if (index > -1) {
                    tempPeers.splice(index, 1);
                    //mute them if they leave
                    uid = parseInt(parsedJson.name);
                    this._engine.muteRemoteVideoStream(uid, true);
                    this._engine.muteRemoteAudioStream(uid, true);
                    this.setState({
                        ...this.state,
                        proximityPeers: [...tempPeers],
                    });
                }
                console.log(
                    'Removing : ',
                    parsedJson.name,
                    'from',
                    this.state.netId,
                );
            }

            console.log(
                'State in onMessage:',
                this.state.proximityPeers,
                '_netId: ',
                this.state.netId,
            );
        }
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
            // this._engine.muteRemoteVideoStream(uid, true);
            // this._engine.muteRemoteAudioStream(uid, true);
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
        this.startCall();
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
            // this.state.netId,
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
            <View style={{flex: 1}}>
                <View style={styles.max}>
                    {/* <View style={styles.buttonHolder}>
                        <TouchableOpacity
                            onPress={this.unmuteEveryone}
                            style={styles.button}>
                            <Text style={styles.buttonText}> Unmute Call </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.muteEveryone}
                            style={styles.button}>
                            <Text style={styles.buttonText}> Mute Call </Text>
                        </TouchableOpacity>
                    </View> */}
                    {this._renderVideos()}
                </View>
            </View>
        );
    }

    _videoControls = () => {
        return (
            <View
                style={{position: 'absolute', bottom: 4, flexDirection: 'row'}}>
                <View style={styles.leftButton}>
                    <FAIcon name="microphone" size={18} />
                </View>
                <View style={styles.rightButton}>
                    <FAIcon name="video-camera" size={18} />
                </View>
            </View>
        );
    };

    _renderVideos = () => {
        const {joinSucceed} = this.state;
        return joinSucceed ? (
            <View style={this.props.dynamicStyles}>
                <View style={styles.localview}>
                    <View style={{flex: 1}}>
                        <RtcLocalView.SurfaceView
                            style={styles.max}
                            channelId={this.state.channelName}
                            renderMode={VideoRenderMode.Hidden}
                            // zOrderOnTop={true}
                        />
                    </View>
                    <View style={styles.videoControlsOverlay}>
                        {this._videoControls()}
                    </View>
                </View>

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
                    // value = parseInt(value);
                    console.log(
                        'Remote Peer View-',
                        value,
                        'local peer view- ',
                        this.state.netId,
                    );
                    return (
                        <View style={styles.remote} key={value}>
                            <RtcRemoteView.SurfaceView
                                style={styles.max}
                                uid={value}
                                channelId={this.state.channelName}
                                renderMode={VideoRenderMode.Hidden}
                                // zOrderOnTop={true}
                            />
                        </View>
                    );
                })}
            </ScrollView>
        );
    };
}
