import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    profileHeader: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    profileTitle: {
        fontSize: 18,
       
        fontWeight: 'bold',
    },
    container: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
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
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarPlaceholderText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    biography: {
        fontSize: 14,
    },
    requestsSection: {
        marginTop: 16,
    },
    requestsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    requestItem: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    requestText: {
        fontSize: 14,
        marginBottom: 4,
    },
    bold: {
        fontWeight: 'bold',
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