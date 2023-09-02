import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './ip';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const Pending = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('loginDetails');
        if (value !== null) {
          const data = JSON.parse(value);
          setName(data);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    getAllStudent();
  }, [name]);

  const getAllStudent = async () => {
    try {
      setIsLoading(true);
      if (name && name.email) {
        const response = await axios.get(`${ip}/api/OrderView/`);
        const filteredData = response.data.data.filter(
          item => item.status && item.vemail.includes(name.email)
        );
        const updatedData = filteredData.map(item => {
          const filteredIndexes = item.vemail
            .map((email, index) => (email === name.email ? index : null))
            .filter(index => index !== null);
  
          return {
            ...item,
            productName: item.productName.filter((_, index) => filteredIndexes.includes(index)),
            price: item.price.filter((_, index) => filteredIndexes.includes(index)),
            quantity: item.quantity.filter((_, index) => filteredIndexes.includes(index)),
            code: item.code.filter((_, index) => filteredIndexes.includes(index)),
            vemail: item.vemail.filter(email => email === name.email),
          };
        });
        setData(updatedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  
  

  const getProductDetails = async email => {
    try {
      const response = await axios.get(`${ip}/api/users/${email}/`);
      setProductDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetails = async (email, itemId) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
      getProductDetails(email);
    }
  };

  const handleDelete = async itemId => {
    try {
      const response = await axios.delete(`${ip}/api/order/OrderView/${itemId}/`);
      console.log(response.data);
      getAllStudent();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrint = async item => {
    try {
      const customerResponse = await axios.get(`${ip}/api/users/${item.email}/`);
      console.log()
      const customerDetails = customerResponse.data;

      let totalBill = 0; // Variable to calculate the total bill

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f9f9f9;
              }
              h1 {
                color: tomato;
                font-size: 28px;
                margin-bottom: 20px;
                text-align: center;
                text-transform: uppercase;
              }
              h2 {
                font-size: 22px;
                margin-top: 30px;
                margin-bottom: 10px;
                text-decoration: underline;
              }
              p {
                font-size: 16px;
                margin-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: #f0f0f0;
                font-weight: bold;
                text-transform: uppercase;
              }
              .invoice-header {
                background-color: #f0f0f0;
                padding: 10px;
                margin-bottom: 20px;
                text-align: center;
              }
              .invoice-total {
                font-weight: bold;
                text-align: right;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <h1>Smart Construction</h1>
              <p>123 Main Street, City, Country</p>
              <p>Contact: +1 234 5678</p>
            </div>
            <p><strong>Email:</strong> ${item.email}</p>
            <h2>Customer Details:</h2>
            ${
              customerDetails
                ? `
              <p><strong>Name:</strong> ${customerDetails.name}</p>
              <p><strong>Address:</strong> ${customerDetails.address}</p>
              <p><strong>Select Area:</strong> ${customerDetails.select_area}</p>
            `
                : ''
            }
            <h2>Product Details:</h2>
            <table>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
              ${
                item.productName.map((name, index) => `
                  <tr>
                    <td>${name}</td>
                    <td>${item.quantity[index]}</td>
                    <td>$${item.price[index]}</td>
                    <td>$${item.quantity[index] * item.price[index]}</td>
                  </tr>
                `).join('')
              }
            </table>
            <div class="invoice-total">
              <p><strong>Total Bill:</strong> $${item.quantity.reduce((acc, val, index) => acc + val * item.price[index], 0)}</p>
            </div>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: 'order_details',
        directory: 'Documents',
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      console.log(pdf.filePath);

      // Send the generated PDF via email here
      // Add your code to send the email with the generated PDF attachment
    } catch (error) {
      console.log(error);
    }
  };

  const renderEntity = ({ item }) => {
    const headings = ['Product', 'Price', 'Quantity', 'Code'];

    const showDetails = selectedItem === item.id;

    return (
      <View style={styles.entityContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {headings.map((heading, index) => (
              <Text key={index} style={[styles.headerText, index !== 0 && { marginLeft: 10 }]}>
                {heading}
              </Text>
            ))}
          </View>
          {item.productName.map((name, index) => (
            <View style={styles.dataRow} key={index}>
              <View style={styles.column}>
                <Text style={styles.dataText}>{name}</Text>
              </View>
              <View style={styles.column}>
                <Text style={[styles.dataText, styles.centerText]}>{item.price[index]}</Text>
              </View>
              <View style={styles.column}>
                <Text style={[styles.dataText, styles.centerText]}>{item.quantity[index]}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.dataText}>{item.code[index]}</Text>
              </View>
            </View>
          ))}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.detailsButton, styles.button]}
              onPress={() => handleDetails(item.email, item.id)}
            >
              <Text style={styles.detailsButtonText}>
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.printButton, styles.button]}
              onPress={() => handlePrint(item)}
            >
              <Text style={styles.printButtonText}>Print</Text>
            </TouchableOpacity>
          </View>
          {showDetails && (
            <View style={styles.detailsContainer}>
              <Text>Item ID: {item.id}</Text>
              <Text>Email: {item.email}</Text>
              {productDetails && (
                <View>
                  <Text>Name: {productDetails.name}</Text>
                  <Text>Address: {productDetails.address}</Text>
                  <Text>Select Area: {productDetails.select_area}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000000" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderEntity}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#f2f2f2',
  },
  entityContainer: {
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'tomato',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
  },
  centerText: {
    textAlign: 'center',
  },
  greenText: {
    color: 'green',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  deliveredButton: {
    backgroundColor: 'tomato',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deliveredButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  detailsButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  printButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  printButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
});

export default Pending;
