import React, { useState } from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';

/**
 * CustomInput Component
 * 
 * In React Native, industry standards recommend creating reusable UI components 
 * wrapped around native elements like `TextInput`. This ensures visual consistency 
 * and reduces code duplication across your app.
 * 
 * We extend `TextInputProps` so our component accepts all standard props 
 * like `placeholder`, `secureTextEntry`, `keyboardType`, etc.
 */
interface CustomInputProps extends TextInputProps {
  label: string; // The text shown above the input field
  error?: string; // Optional error message to display below the input
  containerStyle?: StyleProp<ViewStyle>; // Optional style for the container view
}

const CustomInput: React.FC<CustomInputProps> = ({ label, error, style, containerStyle, ...props }) => {
  // useState Hook: Used for dynamic UI changes. We track whether the user is 
  // currently typing in this input (isFocused) to highlight the border.
  const [isFocused, setIsFocused] = useState(false);

  return (
    // View: The fundamental UI building block in React Native (similar to a <div> in HTML).
    <View style={styles.container}>
      {/* Label Text */}
      <Text style={styles.label}>{label}</Text>

      <View 
        style={[
          styles.inputContainer,
          // Dynamic Style: If focused, change border color to our primary green.
          // If there's an error, change to a red border.
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
          containerStyle
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF" // A subtle gray color for the placeholder
          // Event Handlers for dynamic UI states (Focus)
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props} // Spread all remaining TextInputProps onto the native TextInput
        />
      </View>

      {/* Conditional Rendering: Show error message if `error` prop is provided */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// StyleSheet.create: The standard way to style React Native components.
// It's similar to CSS but uses camelCase keys and doesn't use units (values are density-independent pixels).
const styles = StyleSheet.create({
  container: {
    // marginVertical adds space above and below the component.
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF', // White text for the artistic dark glassmorphism theme
    marginBottom: 6,
  },
  inputContainer: {
    // Flex direction is 'column' by default in React Native.
    // We specify background, border, and padding here.
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8, // Slightly rounded corners for a modern, friendly feel
    height: 52, // Fixed height ensures consistency across all inputs
    justifyContent: 'center', // Centers the text vertically inside the container
  },
  inputContainerFocused: {
    // Finance theme primary color (e.g., deep trusted green) when focused
    borderColor: '#10B981', 
    backgroundColor: '#FFFFFF', // Turn background pure white on focus
  },
  inputContainerError: {
    borderColor: '#EF4444', // Red border to indicate a validation error
  },
  input: {
    flex: 1, // `flex: 1` tells the input to take up all available space inside its parent container
    fontSize: 16,
    color: '#111827', // Almost black for high contrast text
    paddingHorizontal: 16, // Padding applied directly to input to prevent text sticking
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;
