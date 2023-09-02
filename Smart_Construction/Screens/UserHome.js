import * as React from 'react';
import {useEffect,useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import HomeClint from './home';
import Cart from './cart';
import Order from './order';
import Logout from './logout';
import Category from './category';
import BView from './BView';
import Job from './job';

function HomeScreen() {
  return (
    <>
      <HomeClint/>
    </>
  );
}

function CartScreen() {
  return (
    <>
      <Cart/>
    </>
  );
}

function CategoryScreen() {
  return (
    <Category />
  );
}

function OrdersScreen() {
  return (
    <>
    <Order />
    </>
  );
}

function BiddingView() {
  return (
    <BView/>
  );
}

function Job1() {
  return (
    <Job/>
  );
}

function LogoutScreen() {
  return (
    <Logout/>
  );
}

export default function App1() {
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
        {activeTab === 'Home' && <HomeScreen />}
        {activeTab === 'Cart' && <CartScreen />}
        {activeTab === 'Vendors' && <CategoryScreen />}
        {activeTab === 'Bidding' && <OrdersScreen />}
        {activeTab === 'BView' && <BiddingView />}
        {activeTab === 'Services' && <Job1 />}
        {activeTab === 'Logout' && <LogoutScreen />}
      </View>
      <View style={styles.tabBar}>
        {renderTabButton('Home', require('../Images/home.png'))}
        {renderTabButton('Cart', require('../Images/cart.png'))}
        {renderTabButton('Vendors', require('../Images/category.png'))}
        {renderTabButton('Bidding', require('../Images/order.png'))}
        {renderTabButton('BView', require('../Images/add_product.png'))}
        {renderTabButton('Services', require('../Images/profile.png'))}
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
    paddingVertical: 8,
  },
  activeTabButton: {
    backgroundColor: '#ddd',
  },
  tabIcon: {
    width: 25,
    height: 25,
    marginBottom: 5,
  },
  tabText: {
    fontSize: 10,
    color: '#333',
  },
  activeTabText: {
color: 'tomato'
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
fontSize: 12,
color: '#fff',
},

});