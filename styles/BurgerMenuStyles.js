// dogpad.mobile/styles/BurgerMenuStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    burgerButton: {
        padding: 12,
        margin: 8,
        borderRadius: 8,
    },
    modalContainer: {
        flex: 1,
    },
    menuContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '80%',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 12,
    },
});

export default styles; 