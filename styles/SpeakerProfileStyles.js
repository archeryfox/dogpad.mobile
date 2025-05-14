// dogpad.mobile/styles/SpeakerProfileStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    profileHeader: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    profileTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarPlaceholderText: {
        fontSize: 24,
        fontWeight: '600',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 6,
    },
    biography: {
        fontSize: 14,
        lineHeight: 20,
    },
    requestsSection: {
        marginTop: 16,
    },
    requestsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    requestItem: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    requestText: {
        fontSize: 14,
        marginBottom: 4,
    },
    bold: {
        fontWeight: '600',
    },
    requestDate: {
        fontSize: 12,
        marginTop: 4,
    },
    noRequests: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});

export default styles;