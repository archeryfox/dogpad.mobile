import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        height: 60,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        borderRadius: 3,
    },
});

export default styles; 