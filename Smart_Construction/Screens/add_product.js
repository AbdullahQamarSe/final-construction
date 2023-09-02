import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ip from './ip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProduct = () => {
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

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productCode, setProductCode] = useState('');
  const [categoryCode, setCategoryCode] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    // Fetch category list from API
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${ip}/api/order/Category_APi/`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryList(data);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch category list. Please try again.');
      });
  };

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then((selectedImages) => {
        setProductImages(selectedImages.map((image) => ({ uri: image.path })));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    console.log(name.email);
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('quantity', quantity);
    formData.append('productCode', productCode);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', categoryCode);
    formData.append('vemail', name.email);
    productImages.forEach((image, index) => {
      formData.append(`image${index + 1}`, {
        uri: image.uri,
        type: 'image/jpeg',
        name: `image${index + 1}.jpg`,
      });
    });

    fetch(`${ip}/api/Product_Add/`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        Alert.alert('Success', 'Product added successfully!');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to add product. Please try again.');
      });
  };

  const renderForm = () => {
    return (
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          onChangeText={setProductName}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          onChangeText={setQuantity}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Product Code"
          onChangeText={setProductCode}
          placeholderTextColor="#333"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={setDescription}
          placeholderTextColor="#333"
        />
        <TouchableOpacity
          style={styles.dropdownInput}
          onPress={() => setIsCategoryModalVisible(true)}
        >
          <Text style={styles.dropdownInputText}>
            {categoryCode ? categoryCode : 'Select Category'}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Price"
          onChangeText={setPrice}
          placeholderTextColor="#333"
        />
        <View style={styles.imagePickerContainer}>
          <View style={styles.imagePicker}>
            <Button title="Choose Images" onPress={handleImagePicker} color="#ff6347" />
          </View>
        </View>
        <Text></Text>
        <Button title="Submit" onPress={handleSubmit} color="#ff6347" />
        <Text></Text>
        {/* Category Modal */}
        <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              {categoryList.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategoryCode(category.Category);
                    setIsCategoryModalVisible(false);
                  }}
                >
                  <Text style={styles.categoryItemText}>{category.Category}</Text>
                </TouchableOpacity>
              ))}
              <Text></Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsCategoryModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderForm()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
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
  dropdownInput: {
    height: 40,
    borderColor: '#ff6347',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownInputText: {
    color: '#333',
    fontSize: 16,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imagePicker: {
    marginRight: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: 260,
    maxHeight: '80%',
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryItemText: {
    color: '#333',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ff6347',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AddProduct;
