import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, FlatList, TouchableOpacity } from 'react-native';
import ip from './ip';

const HomeAdmin = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${ip}/api/Product_Add/`)
      .then(response => response.json())
      .then(data => {
        console.log(data); // check the data format
        setProducts(data.data)
      })
      .catch(error => console.error(error))
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => setSelectedProduct(item)}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: `${ip}${item.image1}` }} style={styles.itemImage} />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.productName}</Text>
        <Text style={styles.itemCode}>Product Code: {item.productCode}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.companyName}>Smart Construction</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <View style={styles.navBar}>
        <View style={styles.iconContainer}>
          <Image source={require('../Images/add_product.png')} style={styles.icon} />
          <Text style={styles.iconText}>Add Product</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={require('../Images/order.png')} style={styles.icon} />
          <Text style={styles.iconText}>Orders</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={require('../Images/pending_order.png')} style={styles.icon} />
          <Text style={styles.iconText}>Pending Orders</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image source={require('../Images/productcart.png')} style={styles.icon} />
          <Text style={styles.iconText}>Products</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  companyName: {
    color: '#007aff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#999',
  },
  itemCode: {
    fontSize: 14,
    color: '#999',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    backgroundColor: '#007aff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
  },
  centerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  companyName: {
    color: '#007aff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeAdmin;
