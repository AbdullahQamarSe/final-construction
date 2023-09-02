import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import ip from './ip';

const Job = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${ip}/api/order/Job_View/`);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const openDialer = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.rowContainer} onPress={() => openDialer(item.Phone)}>
      <View style={styles.rowItem}>
        <Text style={styles.title}>{item.Title}</Text>
      </View>
      <View style={styles.rowItem}>
        <Image style={styles.image} source={{ uri: `${ip}${item.image1}` }} />
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.phone}>{item.Phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Title</Text>
        <Text style={styles.headerTitle}>Image</Text>
        <Text style={styles.headerTitle}>Phone</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  listContentContainer: {
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  rowItem: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#666666',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default Job;
