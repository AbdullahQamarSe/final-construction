import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ip from './ip';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Product = () => {
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

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch(`${ip}/api/Product_Add/`)
      .then((response) => response.json())
      .then((data) => {
        const uniqueCategories = [
          ...new Set(data.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
        setProducts(data.data);
      })
      .catch((error) => console.error(error));
  };

  const removeProduct = (productId) => {
    fetch(`${ip}/api/order/ProductNew/${productId}/`, { method: 'DELETE' })
      .then((response) => {
        console.log(response);
        fetchProducts(); // Refresh the products after successful deletion
      })
      .catch((error) => console.error(error));
  };

  const handleEditProduct = (productId, newQuantity) => {
    fetch(`${ip}/api/order/ProductNew/${productId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchProducts();
      })
      .catch((error) => console.error(error));
  };

  const renderCategories = () => {
    return (
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <View key={category}>
            {renderProducts(category)}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderProducts = (category) => {
    const categoryProducts = products.filter((product) => product.category === category);
    const filteredProducts = categoryProducts.filter((product) => product.vemail === name.email);

    return (
      <View>
        {filteredProducts.map((product) => (
          <View style={styles.productItem} key={product.id}>
            <Text style={styles.productId}>ID: {product.id}</Text>
            <Text style={styles.productName}>Name: {product.productName}</Text>
            <Text style={styles.productQuantity}>
              Quantity: {product.quantity}
            </Text>
            <View style={styles.codeContainer}>
              <Text style={styles.productCodeHeading}>Product Code:</Text>
              <Text style={styles.productCode}>{product.productCode}</Text>
            </View>
            <Text style={styles.productPrice}>Price pkr {product.price}</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              onChangeText={(text) => setProductName(text)}
              placeholderTextColor="#333"
              underlineColorAndroid="transparent"
            />
            <View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeProduct(product.id)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditProduct(product.id, productName)}
              >
                <Text style={styles.buttontext}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>
      {renderCategories()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  companyName: {
    color: 'tomato',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  categoriesContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  productId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'steelblue',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    marginBottom: 5,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productCodeHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  productCode: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 25,
    width: 75,
    borderColor: 'steelblue',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
    fontSize: 13,
  },
  removeButton: {
    backgroundColor: 'tomato',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    marginTop: 5,
  },
  editButton: {
    backgroundColor: 'steelblue',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Product;
