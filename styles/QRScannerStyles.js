// dogpad.mobile/styles/QRScannerStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scannerContainer: {
        flex: 1,
        position: 'relative',
    },
    scanner: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 8,
        borderRadius: 8,
    },
    scanArea: {
        width: 250,
        height: 250,
        borderWidth: 2,
        alignSelf: 'center',
        marginTop: 40,
    },
    instructions: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        margin: 20,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    scanAgainButton: {
        padding: 12,
        borderRadius: 8,
        margin: 20,
        alignSelf: 'center',
    },
    scanAgainText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default styles; 