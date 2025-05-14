// dogpad.mobile/styles/ProfileStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
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
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarPlaceholderText: {
        fontSize: 32,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        marginBottom: 8,
    },
    balance: {
        fontSize: 16,
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 4,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: '500',
    },
    editFormContainer: {
        width: '100%',
    },
    editButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
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
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        width: '85%',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    qrContainer: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    qrText: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#6b7280',
        width: '100%',
        borderRadius: 12,
    },
    themeSection: {
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    themeSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});

export default styles;