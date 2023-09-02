import * as React from 'react';
import {useEffect,useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import HomeClint from './home';
import AddArea from './1Area';
import AddCategory from './1Category';
import Order from './report';
import AddCategory1 from './1Person';
import Logout from './logout';
import User1 from './1User';
import BView from './BView';

function Users() {
  return (
    <>
      <User1/>
    </>
  );
}

function Area() {
  return (
    <>
      <AddArea/>
    </>
  );
}

function CategoryScreen() {
  return (
    <AddCategory />
  );
}

function Report() {
  return (
    <>
    <Order />
    </>
  );
}

function Addper() {
  return (
    <AddCategory1/>
  );
}

function LogoutScreen() {
  return (
    <Logout/>
  );
}

export default function AdminHomePage() {
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
        {activeTab === 'Users' && <Users />}
        {activeTab === 'Area' && <Area />}
        {activeTab === 'Category' && <CategoryScreen />}
        {activeTab === 'Report' && <Report />}
        {activeTab === 'AddPer' && <Addper />}
        {activeTab === 'Logout' && <LogoutScreen />}
      </View>
      <View style={styles.tabBar}>
        {renderTabButton('Users', require('../Images/home.png'))}
        {renderTabButton('Area', require('../Images/cart.png'))}
        {renderTabButton('Category', require('../Images/category.png'))}
        {renderTabButton('Report', require('../Images/order.png'))}
        {renderTabButton('AddPer', require('../Images/add_product.png'))}
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
    fontSize: 12,
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