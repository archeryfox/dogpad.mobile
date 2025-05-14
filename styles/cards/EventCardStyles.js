// dogpad.mobile/styles/cards/EventCardStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        color: '#1f2937',
        marginRight: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventDate: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 4,
    },
    eventImage: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
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
    readMoreButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
    readMoreText: {
        fontSize: 14,
        color: '#2563eb',
        fontWeight: '500',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        opacity: 0.9,
    },
    categoryText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '500',
    },
    venueContainer: {
        marginBottom: 12,
    },
    venueRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    venueName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
        marginLeft: 4,
    },
    venueAddress: {
        fontSize: 12,
        color: '#4b5563',
        marginLeft: 20,
    },
    participantsContainer: {
        marginBottom: 12,
    },
    participantsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantsText: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 8,
    },
    subscribeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
    },
    subscribeButtonText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    speakerBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#d1fae5',
    },
    speakerText: {
        fontSize: 12,
        color: '#059669',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 22,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    modalButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    priceContainer: {
        marginBottom: 12,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    text: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 8,
        lineHeight: 20,
    },
    heading: {
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        marginTop: 4,
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    underline: {
        textDecorationLine: 'underline',
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    listItemBullet: {
        marginRight: 8,
        fontSize: 14,
        lineHeight: 20,
    },
    listItemText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    link: {
        color: '#3b82f6',
        textDecorationLine: 'underline',
    },
    table: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        marginVertical: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1f2937',
    },
    tableRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    tableCell: {
        fontSize: 14,
        color: '#4b5563',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
});

export default styles;