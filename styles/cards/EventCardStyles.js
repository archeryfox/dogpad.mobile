import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
        marginTop: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        color: '#1f2937',
    },
    eventDate: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
    },
    eventImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 12,
    },
    cardBody: {
        marginBottom: 16,
    },
    eventDescription: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 12,
        lineHeight: 20,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    categoryBadge: {
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: '#4b5563',
    },
    venueContainer: {
        marginBottom: 12,
    },
    venueLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    venueName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
    },
    venueAddress: {
        fontSize: 12,
        color: '#4b5563',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    subscribeButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    subscribeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    speakerBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    speakerText: {
        color: '#15803d',
        fontWeight: '600',
        fontSize: 14,
    },
    participantsContainer: {
        marginBottom: 12,
    },
    participantsText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1f2937',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    modalButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    confirmButton: {
        backgroundColor: '#2563eb',
    },
    cancelButton: {
        backgroundColor: '#9ca3af',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    table: {
        marginVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tableHeaderCell: {
        padding: 8,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1f2937',
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tableCell: {
        padding: 8,
        fontSize: 14,
        color: '#4b5563',
        borderRightWidth: 1,
        borderRightColor: '#e5e7eb',
    },
});

export default styles; 