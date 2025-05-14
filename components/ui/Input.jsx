// dogpad.mobile/components/ui/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Input({
    label,
    error,
    style,
    inputStyle,
    theme,
    editable = true,
    icon,
    ...props
}) {
    // Получаем цвета из темы или используем дефолтные
    const textColor = theme?.colors?.text || '#333';
    const backgroundColor = theme?.colors?.surface || '#fff';
    const borderColor = theme?.colors?.border || '#f0f0f0';
    const errorColor = theme?.colors?.error || '#dc2626';
    const disabledColor = theme?.colors?.disabled || '#f3f4f6';
    const placeholderColor = theme?.colors?.placeholder || '#9ca3af';

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                { 
                    borderColor: borderColor,
                    backgroundColor: editable ? backgroundColor : disabledColor,
                },
                error && [styles.inputError, { borderColor: errorColor }],
            ]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        { 
                            color: editable ? textColor : placeholderColor
                        },
                        inputStyle
                    ]}
                    placeholderTextColor={placeholderColor}
                    editable={editable}
                    {...props}
                />
            </View>
            {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    iconContainer: {
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        padding: 14,
        fontSize: 16,
    },
    inputError: {
        borderWidth: 1,
    },
    error: {
        fontSize: 14,
        marginTop: 6,
        fontWeight: '500',
    },
});