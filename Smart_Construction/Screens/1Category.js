import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Image, Alert,TouchableOpacity,Text} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ip from './ip';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  const handleCategoryImagePicker = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
    })
      .then((selectedImage) => {
        setCategoryImage({ uri: selectedImage.path });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategorySubmit = () => {
    // Handle category form submission and API request
    const categoryData = new FormData();
    categoryData.append('Category', category);
    categoryData.append('CategoryDes', categoryDescription);

    if (categoryImage) {
      categoryData.append('image1', {
        uri: categoryImage.uri,
        type: 'image/jpeg',
        name: 'categoryImage.jpg',
      });
    }

    fetch(`${ip}/api/order/Category_APi/`, {
      method: 'POST',
      body: categoryData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        Alert.alert('Success', 'Category added successfully!');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to add category. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      {categoryImage ? (
    <TouchableOpacity onPress={handleCategoryImagePicker}>
      <Image source={{ uri: categoryImage.uri }} style={styles.categoryImage} />
    </TouchableOpacity>
        ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={handleCategoryImagePicker}>
            <Text style={styles.imagePickerText}>Choose Image</Text>
            </TouchableOpacity>
        )}
      <TextInput
        style={styles.input}
        placeholder="Category"
        onChangeText={setCategory}
        placeholderTextColor="#333"
      />
      <TextInput
        style={styles.input}
        placeholder="Category Description"
        onChangeText={setCategoryDescription}
        placeholderTextColor="#333"
      />
      <Button title="Submit" onPress={handleCategorySubmit} color="#ff6347" />
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
  imagePicker: {
    marginVertical: 10,
  },
  imagePickerText: {
    color: '#ff6347',
    fontSize: 16,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default AddCategory;
