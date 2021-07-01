/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
// import VideoView from './components/VideoView';
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

import {Colors} from 'react-native/Libraries/NewAppScreen';

const {CalendarModule} = NativeModules;

const onPress = () => {
    CalendarModule.createCalendarEvent('testName', 'testLocation');
};

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <View style={{flex: 1}}>
            <UnityView
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}
            />

            <VideoView />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    headline: {
        fontWeight: 'bold',
        fontSize: 18,
        margin: 0,
        width: '100%',
        backgroundColor: 'transparent',
        textAlign: 'center',
        textAlignVertical: 'center', // Centered horizontally
        flex: 1,
    },
});

export default App;
