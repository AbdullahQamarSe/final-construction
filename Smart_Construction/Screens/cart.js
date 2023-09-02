import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Button, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ip from './ip';

const Cart = () => {
  
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [productArray, setProductArray] = useState([]);
  const [priceArray, setPriceArray] = useState([]);
  const [quantityArray, setQuantityArray] = useState([]);
  const [codeArray, setCodeArray] = useState([]);
  const [vemail, setvemail] = useState([]);

  const fetchData = () => {
    setIsLoading(true);
    fetch(`${ip}/api/cart_view/`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.data);
        const products = data.data.filter(item => item.useremail === name.email);
        const productNames = products.map(item => item.productName);
        const prices = products.map(item => item.price);
        const quantities = products.map(item => item.quantity);
        const codes = products.map(item => item.productcode);
        const vemail1 = products.map(item => item.vemail);
        setProductArray(productNames);
        setPriceArray(prices);
        setQuantityArray(quantities);
        setCodeArray(codes);
        setvemail(vemail1);
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const value = await AsyncStorage.getItem('loginDetails');
        if (value !== null) {
          const data = JSON.parse(value);
          setName(data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [name]);

  const handleRemoveItem = (itemId) => {
    fetch(`${ip}/api/cart_view/?cart_id=${itemId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProducts(prevProducts => prevProducts.filter(item => item.id !== itemId));
          fetchData();
        } else {
          console.log('Failed to remove item:', data.error);
        }
      })
      .catch(error => console.error(error));
  };

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Product Name</Text>
      <Text style={styles.headerText}>Product Price</Text>
      <Text style={styles.headerText}>Product Quantity</Text>
    </View>
  );

  const renderTableItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.productName}</Text>
      <Text style={styles.itemText}>{item.price}</Text>
      <Text style={styles.itemText}>{item.quantity}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const Ordernow = () => {
    setIsLoading(true);
    fetch(`${ip}/api/OrderView/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: name.email,
        productName: productArray,
        price: priceArray,
        quantity: quantityArray,
        code: codeArray,
        vemail: vemail
      })
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);

        const cartItemIds = products
          .filter(item => item.useremail === name.email)
          .map(item => item.id);

        Promise.all(
          cartItemIds.map(itemId =>
            fetch(`${ip}/api/cart_view/?cart_id=${itemId}`, {
              method: 'DELETE'
            })
          )
        )
          .then(responses => {
            const deleteResponses = responses.map(response => response.json());
            return Promise.all(deleteResponses);
          })
          .then(deleteData => {
            console.log('Cart items deleted:', deleteData);
            setProducts([]);
            setProductArray([]);
            setPriceArray([]);
            setQuantityArray([]);
            setCodeArray([]);
            setvemail([]);
            setIsLoading(false);
            navigation.navigate('OrderBill', {
              email: name.email,
              productArray: productArray,
              priceArray: priceArray,
              quantityArray: quantityArray,
              codeArray: codeArray,
              cartItemIds: cartItemIds,
              vemail: vemail
            });
          })
          .catch(error => console.error(error));
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.companyName}>Smart Construction</Text>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>
      <View style={styles.tableContainer}>
        {renderTableHeader()}
        {products.filter(item => item.useremail === name.email).length === 0 ? (
          <Text style={styles.emptyCartText}>Cart is empty</Text>
        ) : (
          <FlatList
            data={products.filter(item => item.useremail === name.email)}
            renderItem={renderTableItem}
            keyExtractor={item => item.id.toString()}
          />
        )}
        {products.filter(item => item.useremail === name.email).length !== 0 && (
          <Button title='Order Now' onPress={Ordernow}>
            <Text>Order Now</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    width: 300,
    flex: 1,
    backgroundColor: '#fff',
  },
  companyName: {
    color: 'tomato',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tableContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  removeButtonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  emptyCartText:{
    textAlign:'center'
  },
});
