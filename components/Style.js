import {Dimensions, StyleSheet} from 'react-native';

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

export default StyleSheet.create({
    max: {
        flex: 1,
    },
    buttonHolder: {
        position: 'absolute',
        height: 40,
        alignSelf: 'center',
        top: '50%',
        flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#0093E9',
        borderRadius: 25,
        zIndex: 1,
    },
    buttonText: {
        color: '#fff',
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height,
    },
    localview: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 124,
        height: 124,
        marginHorizontal: 2.5,
    },
    remoteContainer: {
        width: '100%',
        height: 124,
        position: 'absolute',
        top: 4,
    },
    remote: {
        width: 124,
        height: 124,
        marginHorizontal: 2.5,
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
});
