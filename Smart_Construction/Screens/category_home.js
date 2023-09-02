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
} from 'react-native';
import App1 from './UserHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ip from './ip';
import ImageSlider from './ImageSlider';
import { useRoute } from '@react-navigation/native';

const Categoryhome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;
  console.log(category);

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

  useEffect(() => {
    fetch(`${ip}/api/Product_Add/`)
      .then((response) => response.json())
      .then((data) => setProducts(data.data))
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

  const renderItem = ({ item }) => {
    if (item.category !== category) {
      return null; // Skip rendering if category doesn't match
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setSelectedProduct(item)}
      >
        <View style={styles.itemImageContainer}>
          <Image source={{ uri: `${ip}/${item.image1}` }} style={styles.itemImage} />
          <Text style={styles.itemName}>Name: {item.productName}</Text>
          <Text style={styles.itemPrice}>Price: ${item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProductDetail = () => (
    <View style={styles.productDetailContainer}>
      <ImageSlider
        images={[
          `${ip}/${selectedProduct.image1}`,
          `${ip}/${selectedProduct.image2}`,
          `${ip}/${selectedProduct.image3}`,
          `${ip}/${selectedProduct.image4}`,
          `${ip}/${selectedProduct.image5}`,
          `${ip}/${selectedProduct.image6}`,
        ]}
      />

      <Text style={styles.productText}>Name: {selectedProduct.productName}</Text>
      <Text style={styles.productText}>Price: ${selectedProduct.price}</Text>
      <Text style={styles.productText}>Description: {selectedProduct.description}</Text>
      {quantity > 0 && quantity <= selectedProduct.quantity ? (
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
      ) : null}
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
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>

      <TextInput
        placeholder="Search by product name"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={styles.searchInput}
      />

      <FlatList
        data={products.filter((item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />

      {selectedProduct && renderProductDetail()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderRightWidth: 1,
    borderRightColor: '#d9d9d9',
  },
  itemImage: {
    width: 200,
    height: 200,
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
    marginHorizontal: 50,
    marginVertical: 20,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
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
});

export default Categoryhome;
