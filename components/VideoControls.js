import React from 'react';
import {View, TouchableHighlight} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './Style';

export default class VideoControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mic: true,
            video: true,
        };
    }

    onMicPress = user => {
        if (user === -1)
            this.setState({mic: !this.state.mic}, () => {
                this.props._engine.muteLocalAudioStream(!this.state.mic);
            });
        else {
            this.setState({mic: !this.state.mic}, () => {
                this.props._engine.muteRemoteAudioStream(user, !this.state.mic);
            });
        }
    };

    onVideoPress = user => {
        if (user === -1)
            this.setState({video: !this.state.video}, () => {
                this.props._engine.muteLocalVideoStream(!this.state.video);
            });
        else {
            this.setState({video: !this.state.video}, () => {
                this.props._engine.muteRemoteVideoStream(
                    user,
                    !this.state.video,
                );
            });
        }
    };

    render() {
        return (
            <View style={{flexDirection: 'row', ...styles.btnGroup}}>
                <TouchableHighlight
                    onPress={() => this.onMicPress(this.props.user)}
                    style={styles.leftButton}
                    underlayColor={'transparent'}>
                    <View>
                        {this.state.mic ? (
                            <FAIcon name="microphone" size={18} color="white" />
                        ) : (
                            <FAIcon
                                name="microphone-slash"
                                size={18}
                                color="red"
                            />
                        )}
                    </View>
                </TouchableHighlight>
                <View style={styles.btnSeperator} />
                <TouchableHighlight
                    style={styles.rightButton}
                    onPress={() => this.onVideoPress(this.props.user)}
                    underlayColor={'transparent'}>
                    <View>
                        {this.state.video ? (
                            <FAIcon
                                name="video-camera"
                                size={18}
                                color="white"
                            />
                        ) : (
                            <FA5Icon name="video-slash" size={18} color="red" />
                        )}
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}
