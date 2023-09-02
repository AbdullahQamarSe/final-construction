import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './ip';

const BView = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${ip}/api/order/BiddingData/`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (identity) => {
    try {
      const response = await fetch(`${ip}/api/order/Bidding_View_Data/?identity=${identity}`);
      const jsonData = await response.json();
      setMessages(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchMessages(selectedItem.identity);
    }
  }, [selectedItem]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    const filteredMessages = messages.filter((message) => message.email === name.email);
    setMessages(filteredMessages);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleItemClick(item)}>
      <View style={styles.itemContainer}>
        <Image source={{ uri: `${ip}${item.image1}` }} style={styles.image} />
        <Text style={styles.title}>{item.Title}{'\n'}</Text>
        <Text>{'\n'}</Text>
        <Text style={styles.price}>{'\n'}{item.Price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => {
    if (item.identity === selectedItem?.identity) {
      return (
        <TouchableOpacity onPress={() => openDialer(item.Phone)}>
          <View style={styles.messageItemContainer}>
            <View style={styles.messageContentContainer}>
              <Text style={{ color: 'red' }}>{item.email}</Text>
              <Text style={{ color: 'blue' }}>{item.name}</Text>
              <Text>{item.Message}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null; // Skip rendering if identity doesn't match
  };

  const openDialer = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const sendMessage = async () => {
    try {
      console.log(name.Phone);
      const response = await fetch(`${ip}/api/order/Bidding_View_Data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: selectedItem?.identity,
          Message: message,
          email: name.email,
          name: name.name,
          Phone: name.Phone,
        }),
      });
      const jsonData = await response.json();
      // Handle response
      console.log(jsonData);
      fetchMessages(selectedItem?.identity); // Fetch updated messages
    } catch (error) {
      console.error(error);
    }
  };

  const completeItem = async () => {
    fetch(`${ip}/api/order/BiddingData/${selectedItem.id}/`, { method: 'DELETE' })
      .then((response) => {
        console.log(response);
        setModalVisible(false);
        setSelectedItem(null);
        fetchData();
      })
      .catch((error) => console.error(error));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.email === name.email)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.completeButton} onPress={completeItem}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
          <Image source={{ uri: `${ip}${selectedItem?.image1}` }} style={styles.modalImage} />
          <Text style={styles.modalTitle}>{selectedItem?.Title}</Text>
          <Text style={styles.modalPrice}>{selectedItem?.Price}</Text>
          <Text style={styles.modalDescription}>{selectedItem?.Description}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.messageListContainer}
          />

          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  modalImage: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalPrice: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalEmail: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalIdentity: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'blue',
    padding: 3,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  completeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'green',
    padding: 3,
    borderRadius: 5,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  messageListContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 60,
  },
  messageItemContainer: {
    paddingHorizontal: 10,
    width: 400,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContentContainer: {
    width: '80%',
  },
  bottomContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BView;
