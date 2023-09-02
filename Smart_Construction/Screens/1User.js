import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { Text, DataTable } from 'react-native-paper';
import ip from './ip';

const API_URL = `${ip}/api/order/SignData/`;
const FEEDBACK_API_URL = `${ip}/api/order/FeedBack_View/`;

const App = () => {
  const [data, setData] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null); // New state to store selected email
  const [feedbackData, setFeedbackData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const [selectedFeedbackType, setSelectedFeedbackType] = useState(null); // State to store selected feedback type

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  };

  const deleteData = (itemId) => {
    fetch(`${API_URL}${itemId}/`, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 204) {
          console.log('Item deleted successfully');
          fetchData();
        } else if (response.status === 404) {
          console.log('Item not found');
        } else {
          console.log('Error deleting item');
        }
      })
      .catch((error) => console.error(error));
  };

  const fetchFeedbackData = (email) => {
    fetch(FEEDBACK_API_URL)
      .then(response => response.json())
      .then(jsonData => {
        const selectedFeedbackData = jsonData.filter(item => item.email_vendors === email);
        setFeedbackData(selectedFeedbackData);
        setSelectedEmail(email);
        setModalVisible(true); // Show the modal when feedback data is fetched
      })
      .catch(error => console.error('1Error fetching feedback data:', error));
  };

  const handleFeedbackType = (type) => {
    setSelectedFeedbackType(type);
  };

  const renderItems = () => {
    return data.map((item, index) => {
      if (!item.image1) {
        return null; // Skip rendering if image is empty
      }
      return (
        <TouchableOpacity key={index} onPress={() => fetchFeedbackData(item.email)}>
          <DataTable.Row>
            <DataTable.Cell style={styles.imageContainer}>
              <Image source={{ uri: `${ip}/${item.image1}` }} style={styles.image} />
            </DataTable.Cell>
            <DataTable.Cell style={styles.email}>{item.email}</DataTable.Cell>
            <DataTable.Cell style={styles.shopName}>{item.Shop_name}</DataTable.Cell>
            <DataTable.Cell>
              <TouchableOpacity onPress={() => deleteData(item.id)}>
                <Text>X</Text>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        </TouchableOpacity>
      );
    });
  };

  const renderFeedbackData = () => {
    if (selectedFeedbackType === null) {
      // No feedback type selected, show all feedback data
      return feedbackData.map((feedback, index) => (
        <View key={index} style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Feedback {index + 1}</Text>
          <Text>Email Vendors: {feedback.email_vendors}</Text>
          <Text>Email Customer: {feedback.email_customer}</Text>
          <Text>Feedback Type: {feedback.drop_down}</Text>
          <Text>Message: {feedback.message}</Text>
        </View>
      ));
    } else {
      // Filter feedback data based on selected feedback type
      const filteredFeedbackData = feedbackData.filter(feedback => feedback.drop_down === selectedFeedbackType);
      return filteredFeedbackData.map((feedback, index) => (
        <View key={index} style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Feedback {index + 1}</Text>
          <Text>Email Vendors: {feedback.email_vendors}</Text>
          <Text>Email Customer: {feedback.email_customer}</Text>
          <Text>Feedback Type: {feedback.drop_down}</Text>
          <Text>Message: {feedback.message}</Text>
        </View>
      ));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Image</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title>Shop Name</DataTable.Title>
            <DataTable.Title>Delete</DataTable.Title>
          </DataTable.Header>
          {renderItems()}
        </DataTable>
        {selectedEmail && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.selectedEmail}>Selected Email: {selectedEmail}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Complain"
                  onPress={() => handleFeedbackType('Complain')}
                  disabled={selectedFeedbackType === 'Complain'}
                />
                <Button
                  title="Review"
                  onPress={() => handleFeedbackType('Review')}
                  disabled={selectedFeedbackType === 'Review'}
                />
              </View>
              {renderFeedbackData()}
            </View>
          </Modal>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: '100%',
  },
  contentContainer: {
    paddingVertical: 16,
  },
  imageContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  email: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    paddingLeft: 16,
  },
  shopName: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    paddingLeft: 16,
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default App;
