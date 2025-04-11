import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function Input({
    label,
    error,
    style,
    inputStyle,
    theme,
    editable = true,
    ...props
}) {
    // Получаем цвета из темы или используем дефолтные
    const textColor = theme?.colors?.text || '#333';
    const backgroundColor = theme?.colors?.surface || '#fff';
    const borderColor = theme?.colors?.border || '#ddd';
    const errorColor = theme?.colors?.error || '#dc2626';
    const disabledColor = theme?.colors?.disabled || '#f3f4f6';
    const placeholderColor = theme?.colors?.placeholder || '#9ca3af';

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    { 
                        borderColor: borderColor,
                        backgroundColor: editable ? backgroundColor : disabledColor,
                        color: editable ? textColor : placeholderColor
                    },
                    error && [styles.inputError, { borderColor: errorColor }],
                    inputStyle
                ]}
                placeholderTextColor={placeholderColor}
                editable={editable}
                {...props}
            />
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
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderWidth: 1.5,
    },
    error: {
        fontSize: 14,
        marginTop: 4,
    },
}); 