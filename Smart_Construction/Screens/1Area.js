import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import ip from './ip';

const AddArea = () => {
  const [areaName, setAreaName] = useState('');

  const handleAreaSubmit = () => {
    // Handle area form submission and API request
    const areaData = {
      Area: areaName,
    };

    fetch(`${ip}/api/order/Area_APi/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        Alert.alert('Success', 'Area added successfully!');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to add area. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Area Name"
        onChangeText={setAreaName}
        placeholderTextColor="#333"
      />
      <Button title="Submit" onPress={handleAreaSubmit} color="#ff6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: '#ff6347',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: '#333',
    fontSize: 16,
  },
});

export default AddArea;
