import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 20,
    },
    profileSection: {
        marginBottom: 20,
    },
    speakerSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 32,
        color: '#9ca3af',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    balance: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
    },
    editButton: {
        backgroundColor: '#2563eb',
    },
    saveButton: {
        backgroundColor: '#059669',
    },
    cancelButton: {
        backgroundColor: '#6b7280',
    },
    qrButton: {
        backgroundColor: '#7c3aed',
    },
    logoutButton: {
        backgroundColor: '#dc2626',
    },
    subscriptionsSection: {
        flex: 1,
    },
    error: {
        fontSize: 16,
        color: '#dc2626',
        textAlign: 'center',
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
    },
    qrContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
    },
    qrText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#6b7280',
        width: '100%',
    },
    themeSection: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 8,
    },
    themeSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});

export default styles; 