// dogpad.mobile/components/ui/Button.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

const Button = ({ 
    title, 
    onPress, 
    isLoading, 
    loading, 
    style, 
    textStyle,
    disabled, 
    theme,
    variant = 'primary', // primary, outline, secondary, danger
    size = 'medium', // small, medium, large
    icon,
    iconPosition = 'left'
}) => {
    // Поддерживаем оба параметра для совместимости
    const isLoadingState = isLoading || loading;
    
    // Используем цвета из темы
    const colors = {
        primary: theme?.colors?.primary || '#2563eb',
        secondary: theme?.colors?.secondary || '#4B5563',
        danger: theme?.colors?.error || '#DC2626',
        text: theme?.colors?.buttonText || 'white',
        outline: theme?.colors?.background || 'white',
        outlineText: theme?.colors?.primary || '#2563eb',
        disabled: theme?.colors?.disabled || '#93c5fd',
    };
    
    // Определяем стили на основе варианта
    const getButtonStyle = () => {
        switch(variant) {
            case 'outline':
                return {
                    backgroundColor: colors.outline,
                    borderWidth: 1,
                    borderColor: colors.outlineText,
                };
            case 'secondary':
                return {
                    backgroundColor: colors.secondary,
                };
            case 'danger':
                return {
                    backgroundColor: colors.danger,
                };
            case 'primary':
            default:
                return {
                    backgroundColor: colors.primary,
                };
        }
    };
    
    // Определяем цвет текста
    const getTextColor = () => {
        if (variant === 'outline') {
            return colors.outlineText;
        }
        return colors.text;
    };
    
    // Определяем размер кнопки
    const getSizeStyle = () => {
        switch(size) {
            case 'small':
                return styles.buttonSmall;
            case 'large':
                return styles.buttonLarge;
            case 'medium':
            default:
                return {};
        }
    };
    
    // Определяем размер текста
    const getTextSizeStyle = () => {
        switch(size) {
            case 'small':
                return styles.textSmall;
            case 'large':
                return styles.textLarge;
            case 'medium':
            default:
                return {};
        }
    };
    
    return (
        <TouchableOpacity
            style={[
                styles.button,
                getSizeStyle(),
                getButtonStyle(),
                (isLoadingState || disabled) && [
                    styles.buttonDisabled, 
                    { opacity: 0.7 }
                ],
                style
            ]}
            onPress={onPress}
            disabled={isLoadingState || disabled}
            activeOpacity={0.7}
        >
            {isLoadingState ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator 
                        color={getTextColor()} 
                        size={size === 'small' ? 'small' : 'small'} 
                    />
                    {title && <Text style={[
                        styles.buttonText, 
                        getTextSizeStyle(),
                        { color: getTextColor(), marginLeft: 8 },
                        textStyle
                    ]}>
                        {title}
                    </Text>}
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {icon && iconPosition === 'left' && 
                        <View style={styles.iconLeft}>{icon}</View>}
                    
                    <Text style={[
                        styles.buttonText, 
                        getTextSizeStyle(),
                        { color: getTextColor() },
                        textStyle
                    ]}>
                        {title}
                    </Text>
                    
                    {icon && iconPosition === 'right' && 
                        <View style={styles.iconRight}>{icon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    buttonSmall: {
        padding: 10,
        borderRadius: 10,
    },
    buttonLarge: {
        padding: 18,
        borderRadius: 14,
    },
    buttonDisabled: {
        // Стили применяются динамически
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    textSmall: {
        fontSize: 14,
    },
    textLarge: {
        fontSize: 18,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    }
});

export default Button; 