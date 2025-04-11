import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#4b5563',
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    errorText: {
        color: '#ef4444',
        marginTop: 4,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#2563eb',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#2563eb',
        fontSize: 16,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    termsCheckbox: {
        width: 24,
        height: 24,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termsText: {
        fontSize: 14,
        color: '#4b5563',
        flex: 1,
    },
    termsLink: {
        color: '#2563eb',
    },
});

export default styles; 