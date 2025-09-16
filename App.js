/**
 * React Native Calculator App
 * 
 * A modern calculator application with dark mode support, built using React Native and Expo.
 * Features include basic arithmetic operations, error handling, and responsive design.
 * 
 * @author Scott
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  // Calculator state management
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme configuration for light and dark modes
  const colors = {
    light: {
      background: '#ffffff',
      display: '#f8f9fa',
      displayText: '#000000',
      button: '#e9ecef',
      buttonText: '#000000',
      operator: '#007bff',
      operatorText: '#ffffff',
      equals: '#28a745',
      equalsText: '#ffffff',
      clear: '#dc3545',
      clearText: '#ffffff',
      toggle: '#6c757d',
      toggleText: '#ffffff',
    },
    dark: {
      background: '#1a1a1a',
      display: '#2d2d2d',
      displayText: '#ffffff',
      button: '#404040',
      buttonText: '#ffffff',
      operator: '#007bff',
      operatorText: '#ffffff',
      equals: '#28a745',
      equalsText: '#ffffff',
      clear: '#dc3545',
      clearText: '#ffffff',
      toggle: '#6c757d',
      toggleText: '#ffffff',
    }
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  /**
   * Handles number input with validation and error handling
   * @param {number} num - The number to input
   */
  const inputNumber = (num) => {
    // Prevent input if display shows an error
    if (display === 'Error') {
      clear();
      setDisplay(String(num));
      return;
    }

    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      // Limit display length to prevent overflow
      const newDisplay = display === '0' ? String(num) : display + num;
      if (newDisplay.length <= 12) {
        setDisplay(newDisplay);
      }
    }
  };

  /**
   * Handles decimal point input with validation
   */
  const inputDecimal = () => {
    // Prevent input if display shows an error
    if (display === 'Error') {
      clear();
      setDisplay('0.');
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1 && display.length < 12) {
      setDisplay(display + '.');
    }
  };

  /**
   * Clears the calculator and resets all state
   */
  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  /**
   * Performs calculator operations (+, -, ×, ÷)
   * @param {string} nextOperation - The operation to perform
   */
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  /**
   * Performs the actual mathematical calculation
   * @param {number} firstValue - The first operand
   * @param {number} secondValue - The second operand
   * @param {string} operation - The operation to perform
   * @returns {number|string} The result or 'Error' if invalid
   */
  const calculate = (firstValue, secondValue, operation) => {
    try {
      switch (operation) {
        case '+':
          return firstValue + secondValue;
        case '-':
          return firstValue - secondValue;
        case '×':
          return firstValue * secondValue;
        case '÷':
          if (secondValue === 0) {
            throw new Error('Cannot divide by zero');
          }
          return firstValue / secondValue;
        case '=':
          return secondValue;
        default:
          return secondValue;
      }
    } catch (error) {
      return 'Error';
    }
  };

  /**
   * Handles the equals operation and displays the final result
   */
  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  /**
   * Toggles between light and dark mode themes
   */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  /**
   * Reusable Button component for calculator buttons
   * @param {Object} props - Component props
   * @param {Function} props.onPress - Press handler function
   * @param {string} props.title - Button text
   * @param {Object} props.style - Additional button styles
   * @param {Object} props.textStyle - Additional text styles
   */
  const Button = ({ onPress, title, style, textStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header with dark mode toggle */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.toggleButton, { backgroundColor: currentColors.toggle }]} 
          onPress={toggleDarkMode}
        >
          <Text style={[styles.toggleText, { color: currentColors.toggleText }]}>
            {isDarkMode ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Display */}
      <View style={[styles.display, { backgroundColor: currentColors.display }]}>
        <Text style={[styles.displayText, { color: currentColors.displayText }]}>
          {display}
        </Text>
      </View>

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        {/* Row 1 */}
        <View style={styles.buttonRow}>
          <Button
            onPress={clear}
            title="C"
            style={[styles.clearButton, { backgroundColor: currentColors.clear }]}
            textStyle={[styles.clearText, { color: currentColors.clearText }]}
          />
          <Button
            onPress={() => performOperation('÷')}
            title="÷"
            style={[styles.operatorButton, { backgroundColor: currentColors.operator }]}
            textStyle={[styles.operatorText, { color: currentColors.operatorText }]}
          />
          <Button
            onPress={() => performOperation('×')}
            title="×"
            style={[styles.operatorButton, { backgroundColor: currentColors.operator }]}
            textStyle={[styles.operatorText, { color: currentColors.operatorText }]}
          />
          <Button
            onPress={() => {
              if (display === 'Error') {
                clear();
              } else {
                setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
              }
            }}
            title="⌫"
            style={[styles.operatorButton, { backgroundColor: currentColors.operator }]}
            textStyle={[styles.operatorText, { color: currentColors.operatorText }]}
          />
        </View>

        {/* Row 2 */}
        <View style={styles.buttonRow}>
          <Button
            onPress={() => inputNumber(7)}
            title="7"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(8)}
            title="8"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(9)}
            title="9"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => performOperation('-')}
            title="-"
            style={[styles.operatorButton, { backgroundColor: currentColors.operator }]}
            textStyle={[styles.operatorText, { color: currentColors.operatorText }]}
          />
        </View>

        {/* Row 3 */}
        <View style={styles.buttonRow}>
          <Button
            onPress={() => inputNumber(4)}
            title="4"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(5)}
            title="5"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(6)}
            title="6"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => performOperation('+')}
            title="+"
            style={[styles.operatorButton, { backgroundColor: currentColors.operator }]}
            textStyle={[styles.operatorText, { color: currentColors.operatorText }]}
          />
        </View>

        {/* Row 4 */}
        <View style={styles.buttonRow}>
          <Button
            onPress={() => inputNumber(1)}
            title="1"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(2)}
            title="2"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={() => inputNumber(3)}
            title="3"
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={handleEquals}
            title="="
            style={[styles.equalsButton, { backgroundColor: currentColors.equals }]}
            textStyle={[styles.equalsText, { color: currentColors.equalsText }]}
          />
        </View>

        {/* Row 5 */}
        <View style={styles.buttonRow}>
          <Button
            onPress={() => inputNumber(0)}
            title="0"
            style={[styles.zeroButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
          <Button
            onPress={inputDecimal}
            title="."
            style={[styles.numberButton, { backgroundColor: currentColors.button }]}
            textStyle={[styles.numberText, { color: currentColors.buttonText }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles for the calculator application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  toggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 20,
  },
  display: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 48,
    fontWeight: '300',
    textAlign: 'right',
  },
  buttonGrid: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  numberButton: {
    // Inherits from button
  },
  numberText: {
    // Inherits from buttonText
  },
  operatorButton: {
    // Inherits from button
  },
  operatorText: {
    // Inherits from buttonText
  },
  equalsButton: {
    // Inherits from button
  },
  equalsText: {
    // Inherits from buttonText
  },
  clearButton: {
    // Inherits from button
  },
  clearText: {
    // Inherits from buttonText
  },
  zeroButton: {
    width: 155, // Takes up space of two buttons plus gap
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
