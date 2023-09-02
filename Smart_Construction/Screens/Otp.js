import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OTPInput = () => {
  const [otp, setOTP] = useState('');
  const inputRef = useRef([]);

  const handleOTPChange = (index, value) => {
    // Update the OTP value
    setOTP((prevOTP) => {
      const otpArray = prevOTP.split('');
      otpArray[index] = value;
      return otpArray.join('');
    });

    // Focus on the next input field
    if (value && index < 3) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleOTPKeyPress = (index, key) => {
    // Delete the previous input value on backspace press
    if (key === 'Backspace' && index > 0) {
      setOTP((prevOTP) => {
        const otpArray = prevOTP.split('');
        otpArray[index - 1] = '';
        return otpArray.join('');
      });

      // Focus on the previous input field
      inputRef.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((index) => (
        <TextInput
          key={index}
          style={[styles.input, { borderColor: 'tomato' }]}
          onChangeText={(value) => handleOTPChange(index, value)}
          onKeyPress={({ nativeEvent: { key } }) => handleOTPKeyPress(index, key)}
          value={otp[index]}
          keyboardType="numeric"
          maxLength={1}
          ref={(ref) => (inputRef.current[index] = ref)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    width: 50,
    color: 'tomato',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 20,
  },
});

export default OTPInput;
