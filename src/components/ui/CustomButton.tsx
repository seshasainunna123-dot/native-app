import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps,
  StyleProp,
  TextStyle
} from 'react-native';

/**
 * CustomButton Component
 * 
 * Buttons in React Native are typically built using `TouchableOpacity` or `Pressable`.
 * `TouchableOpacity` automatically dims its opacity when pressed, providing built-in 
 * user feedback without writing custom animation code.
 */
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;           // The text displayed on the button
  isLoading?: boolean;     // Whether to show a loading spinner
  variant?: 'primary' | 'secondary'; // Theme variants
  textStyle?: StyleProp<TextStyle>; // Optional style for the button text
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  isLoading = false, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled, 
  ...props 
}) => {
  // Determine if the button should use primary or secondary styling based on the variant prop
  const isPrimary = variant === 'primary';
  const buttonStyles = [
    styles.button,
    isPrimary ? styles.primaryButton : styles.secondaryButton,
    // If the button is disabled or loading, we reduce its opacity to visually indicate it can't be clicked
    (disabled || isLoading) && styles.disabledButton,
    style, // User-provided style overrides
  ];

  const textStyles = [
    styles.text,
    isPrimary ? styles.primaryText : styles.secondaryText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      // activeOpacity defines how much the button dims when pressed (0 to 1). Default is usually ~0.2.
      activeOpacity={0.8}
      disabled={disabled || isLoading} // Prevent pressing if already loading or explicitly disabled
      {...props}
    >
      {isLoading ? (
        // ActivityIndicator is the native loading spinner component provided by React Native
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#10B981'} />
      ) : (
        // Text is the ONLY component allowed to contain strings in React Native!
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52, // Matching the height of the CustomInput for a balanced layout
    borderRadius: 8,
    // alignItems & justifyContent 'center' align children perfectly in the middle horizontally AND vertically
    alignItems: 'center', 
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
    
    // Minimal shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    
    // Elevation for Android (adds a drop shadow based on Material Design guidelines)
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#10B981', // A trustworthy "Finance Green"
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  disabledButton: {
    // Opacity dims the entire component including its children
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    // fontWeight controls text thickness. Note: Always use strings like 'bold' or '600' in React Native
    fontWeight: '700', 
  },
  primaryText: {
    color: '#FFFFFF', // White text stands out well on a dark green primary button
  },
  secondaryText: {
    color: '#10B981', // Green text for secondary buttons to match the border
  },
});

export default CustomButton;
