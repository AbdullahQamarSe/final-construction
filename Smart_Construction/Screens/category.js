import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ip from './ip';
import ImageSlider from './ImageSlider';

const HomeClient = () => {
  const navigation = useNavigation();

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

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategories, setShowCategories] = useState(true);
  const [dropdownValue, setDropdownValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${ip}/api/order/SignData/`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    fetch(`${ip}/api/Product_Add/`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data);
        setFilteredProducts(data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const refreshData = () => {
    fetch(`${ip}/api/Product_Add/`)
      .then((response) => response.json())
      .then((data) => setProducts(data.data))
      .catch((error) => console.error(error));
  };

  const increaseQuantity = () => {
    if (quantity < selectedProduct.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const cart = () => {
    if (selectedProduct.quantity === 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock.');
      return;
    }

    const updatedQuantity = selectedProduct.quantity - quantity;

    fetch(`${ip}/api/cart_view/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useremail: name.email,
        productcode: selectedProduct.productCode,
        productName: selectedProduct.productName,
        quantity: quantity,
        price: selectedProduct.price,
        vemail: selectedProduct.vemail,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        fetch(`${ip}/api/order/ProductNew/${selectedProduct.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: updatedQuantity,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            setSelectedProduct((prevSelectedProduct) => ({
              ...prevSelectedProduct,
              quantity: updatedQuantity,
            }));
            // Show success message or navigate back to the main screen
            Alert.alert('Product Added to Cart', 'The product has been added to your cart.');
            setSelectedProduct(null);
            setQuantity(1);
            refreshData(); // Refresh the data
          });
      });
  };

  const sendResponse = () => {
    const requestData = {
      email_vendors: selectedProduct.vemail,
      email_customer: name.email,
      drop_down: dropdownValue,
      message: message,
    };

    fetch('http://192.168.1.94:8000/api/order/FeedBack_View/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response
        console.log(data);
        // Show success message or perform any other actions
        Alert.alert('Response Sent', 'Your response has been sent successfully.');
      })
      .catch((error) => {
        console.error(error);
        // Show error message or perform any other actions
        Alert.alert('Error', 'Failed to send response. Please try again later.');
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => setSelectedProduct(item)}
    >
      <View style={styles.itemImageContainer}>
        {item.image1 && (
          <Image source={{ uri: `${ip}/${item.image1}` }} style={styles.itemImage} />
        )}
        <Text style={styles.itemName}>Name: {item.productName}</Text>
        <Text style={styles.itemPrice}>Price: pkr {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductDetail = () => (
    <ScrollView style={styles.productDetailContainer}>
      <ImageSlider
        images={[
          selectedProduct.image1 && `${ip}/${selectedProduct.image1}`,
          selectedProduct.image2 && `${ip}/${selectedProduct.image2}`,
          selectedProduct.image3 && `${ip}/${selectedProduct.image3}`,
          selectedProduct.image4 && `${ip}/${selectedProduct.image4}`,
          selectedProduct.image5 && `${ip}/${selectedProduct.image5}`,
          selectedProduct.image6 && `${ip}/${selectedProduct.image6}`,
        ]}
      />

      <Text style={styles.productText}>Name: {selectedProduct.productName}</Text>
      <Text style={styles.productText}>Price: pkr {selectedProduct.price}</Text>
      <Text style={styles.productText}>Description: {selectedProduct.description}</Text>
      {quantity > 0 && quantity <= selectedProduct.quantity && (
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text))}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      {quantity > 0 && quantity <= selectedProduct.quantity ? (
        <TouchableOpacity style={styles.addToCartButton} onPress={cart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.outOfStockText}>Out of Stock</Text>
      )}
      <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProduct(null)}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>

      <View style={styles.responseContainer}>
        <Text style={styles.responseLabel}>Select an Option:</Text>
        <TextInput
          style={styles.responseInput}
          value={dropdownValue}
          onChangeText={setDropdownValue}
          placeholder="Enter option"
        />
        <Text style={styles.responseLabel}>Message:</Text>
        <TextInput
          style={[styles.responseInput, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter your message"
          multiline
        />
        <TouchableOpacity style={styles.responseButton} onPress={sendResponse}>
          <Text style={styles.buttonText}>Send Response</Text>
        </TouchableOpacity>
      </View>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  );

  const renderCategories = () => {
    if (!showCategories || selectedCategory) {
      return null;
    }

    return (
      <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            // Check if category.image1 is empty
            category.image1 && (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  category.Category === selectedCategory && styles.selectedCategoryItem,
                ]}
                key={category.id}
                onPress={() => setSelectedCategory(category.email)}
              >
                <Image source={{ uri: `${ip}/${category.image1}` }} style={styles.categoryImage} />
                <Text
                  style={[
                    styles.categoryText,
                    category.Category === selectedCategory && styles.selectedCategoryText,
                  ]}
                >
                  {category.Shop_name}
                </Text>
              </TouchableOpacity>
            )
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>

      {renderCategories()}

      {selectedCategory && (
        <FlatList
          data={filteredProducts.filter((item) => item.vemail === selectedCategory)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
        />
      )}

      {selectedProduct && renderProductDetail()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  companyName: {
    color: 'tomato',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemImageContainer: {
    padding: 10,
    borderRightColor: '#d9d9d9',
  },
  itemImage: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  flatList: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  productDetailContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    padding: 20,
  },
  productText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: 'tomato',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  quantityInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 10,
    flex: 1,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: 'tomato',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  outOfStockText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red',
  },
  categoriesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    width: 350,
    alignSelf: 'center',
  },
  categoryItem: {
    width: '40%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  selectedCategoryItem: {
    backgroundColor: 'tomato',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedCategoryText: {
    color: 'white',
  },
  categoryImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  responseContainer: {
    marginTop: 20,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  responseButton: {
    backgroundColor: 'tomato',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
});

export default HomeClient;
