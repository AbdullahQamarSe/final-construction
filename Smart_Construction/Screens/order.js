import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ip from './ip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyForm = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('loginDetails');
        if (value !== null) {
          const data = JSON.parse(value);
          setName(data);
          console.log(data.email);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    // Generate a random 4-digit number for identity
    const identity = Math.floor(1000 + Math.random() * 9000);

    // Create a FormData object to send data including the image
    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Price', price);
    formData.append('email', name.email);
    formData.append('Description', description);
    formData.append('identity', identity);
    formData.append('image1', {
      uri: image.path,
      type: image.mime,
      name: 'image1.jpg',
    });

    // Send the form data to the API
    // Replace 'API_URL' with your actual API endpoint
    fetch(`${ip}/api/order/BiddingData/`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  };

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((image) => {
        setImage(image);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create a New Proposal</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default MyForm;
