import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Add_product from './add_product';
import Aorder from './Aorder';
import Logout from './logout';
import Pending from './pendings';
import Report from './report';
import Product from './product';



function CartScreen() {
  return (
    <Pending />
  );
}

function CategoryScreen() {
  return (
    <Add_product />
  );
}

function OrdersScreen() {
  return (
    <Aorder />
  );
}

function LogoutScreen() {
  return (
    <Logout />
  );
}

function ProductScreen() {
  return (
    <Product />
  );
}

export default function AdminHome() {
  const [activeTab, setActiveTab] = React.useState('Home');

  const onPressTab = (tabName) => {
    setActiveTab(tabName);
  };

  const renderTabButton = (tabName, iconSource) => {
    return (
      <TouchableOpacity
        key={tabName}
        style={[styles.tabButton, activeTab === tabName && styles.activeTabButton]}
        onPress={() => onPressTab(tabName)}
      >
        <Image source={iconSource} style={styles.tabIcon} />
        <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{tabName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'Bidding' && <CartScreen />}
        {activeTab === 'Add' && <CategoryScreen />}
        {activeTab === 'Orders' && <OrdersScreen />}
        {activeTab === 'Logout' && <LogoutScreen />}
        {activeTab === 'Product' && <ProductScreen />}
      </View>
      <View style={styles.tabBar}>
        {renderTabButton('Bidding', require('../Images/cart.png'))}
        {renderTabButton('Add', require('../Images/category.png'))}
        {renderTabButton('Orders', require('../Images/order.png'))}
        {renderTabButton('Product', require('../Images/product.png'))}
        {renderTabButton('Logout', require('../Images/logout.png'))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,  // Adjust the padding to make the buttons smaller
  },
  activeTabButton: {
    backgroundColor: '#ddd',
  },
  tabIcon: {
    width: 20,  // Adjust the width to make the icons smaller
    height: 20,  // Adjust the height to make the icons smaller
    marginBottom: 2,  // Adjust the margin to align the icons properly
  },
  tabText: {
    fontSize: 10,  // Adjust the font size to make the text smaller
    color: '#333',
  },
  activeTabText: {
    color: 'tomato',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'tomato',
  },
  footer: {
    backgroundColor: 'tomato',
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,  // Adjust the font size to make the text smaller
    color: '#fff',
  },
});
