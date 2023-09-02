import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './ip';
import { Calendar } from 'react-native-calendars';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const Order = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('loginDetails');
        if (value !== null) {
          const data = JSON.parse(value);
          setName(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    getAllStudent();
  }, []);

  const getAllStudent = async (page = 1, allData = []) => {
    try {
      const response = await axios.get(`${ip}/api/OrderView/`, {
        params: {
          page,
        },
      });

      const newData = response.data.data;
      const updatedData = allData.concat(newData);

      if (response.data.hasMore) {
        return getAllStudent(page + 1, updatedData);
      }

      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderEntity = ({ item }) => {
    const headings = ['Product', 'Price', 'Quantity'];
    return (
      <View style={styles.entityContainer}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {headings.map((heading, index) => (
              <Text
                key={index}
                style={[
                  styles.headerText,
                  index === headings.length - 1 && styles.rightAlignText,
                ]}
              >
                {heading}
              </Text>
            ))}
          </View>
          {item.productName.map((productName, index) => (
            <View style={styles.dataRow} key={index}>
              <View style={styles.column}>
                <Text style={[styles.dataText, styles.leftAlignText]}>
                  {productName}
                </Text>
              </View>
              <View style={styles.column}>
                <Text style={[styles.dataText, styles.centerAlignText]}>
                  ${item.price[index]}
                </Text>
              </View>
              <View style={styles.column}>
                <Text
                  style={[
                    styles.dataText,
                    styles.rightAlignText,
                    styles.quantityText,
                  ]}
                >
                  {item.quantity[index]}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.dataRow}>
            <View style={styles.column}>
              <Text style={[styles.dataText, styles.leftAlignText]}>
                Status
              </Text>
            </View>
            <View style={styles.column} />
            <View style={styles.column} />
            <View style={styles.column}>
              <Text style={[styles.dataText, styles.rightAlignText]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCalendarVisible(false);

    const filteredData = data.filter((item) => item.date === date);
    setFilteredData(filteredData);
  };

  const handleDayPress = (day) => {
    const formattedDate = day.dateString;
    handleDateSelect(formattedDate);
  };

  const markedDatesObj = data.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { marked: true };
    }
    return acc;
  }, {});

  const generatePDF = async () => {
    try {
      const filteredData = data.filter((item) => item.date === selectedDate);
  
      let pendingOrdersCount = 0;
      let deliveredOrdersCount = 0;
  
      const tableRows = filteredData.map((item) => {
        const code = item.code.join('<br/>');
        const productName = item.productName.join('<br/>');
        const price = item.price.join('<br/>');
        const quantity = item.quantity.join('<br/>');
        const status = item.status;
  
        if (status === 'pending') {
          pendingOrdersCount++;
        } else if (status === 'Delivered') {
          deliveredOrdersCount++;
        }
  
        return `
          <tr>
            <td>${code}</td>
            <td>${productName}</td>
            <td>${price}</td>
            <td>${quantity}</td>
            <td>${status}</td>
          </tr>
        `;
      }).join('');
  
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                padding: 20px;
              }
              h1 {
                text-align: center;
                margin-bottom: 20px;
                color: tomato;
              }
              .order-summary {
                margin-bottom: 30px;
              }
              .order-summary h2 {
                margin-bottom: 10px;
                color: tomato;
              }
              .order-summary .count {
                font-weight: bold;
                font-size: 18px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 10px;
                text-align: center;
              }
              th {
                background-color: #f5f5f5;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <h1>Order Details - ${selectedDate}</h1>
            <div class="order-summary">
              <h2>Report:</h2>
              <div class="count">Pending Orders: ${pendingOrdersCount}</div>
              <div class="count">Delivered Orders: ${deliveredOrdersCount}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </body>
        </html>
      `;
  
      const options = {
        html: htmlContent,
        fileName: 'order_data',
        directory: 'Documents',
      };
      const pdf = await RNHTMLtoPDF.convert(options);
  
      setFileUri(pdf.filePath);
  
      setPendingOrders(pendingOrdersCount);
      setDeliveredOrders(deliveredOrdersCount);
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.calendarButtonText}>Open Calendar</Text>
      </TouchableOpacity>
      <Modal visible={isCalendarVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCalendarVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Calendar
            markedDates={{ ...markedDates, ...markedDatesObj }}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#333333',
              todayTextColor: '#00adf5',
              dayTextColor: '#333333',
              textDisabledColor: '#d9e1e8',
              arrowColor: '#333333',
              monthTextColor: '#333333',
            }}
          />
        </View>
      </Modal>
      <Button title="Download PDF" onPress={generatePDF} color="tomato" />
      <FlatList
        data={filteredData}
        renderItem={renderEntity}
        keyExtractor={(_, index) => index.toString()}
        initialNumToRender={filteredData.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#f2f2f2',
  },
  entityContainer: {
    marginBottom: 20,
  },
  table: {
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
    textTransform: 'uppercase',
    marginRight: 15,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  dataText: {
    fontSize: 16,
    color: '#333333',
  },
  leftAlignText: {
    textAlign: 'left',
  },
  centerAlignText: {
    textAlign: 'center',
  },
  rightAlignText: {
    textAlign: 'right',
    fontSize: 14,
  },
  quantityText: {
    fontWeight: 'bold',
    color: 'green',
  },
  calendarButton: {
    backgroundColor: '#eaeaea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  calendarButtonText: {
    fontSize: 16,
    color: 'tomato',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'tomato',
  },
  downloadLink: {
    color: 'blue',
    marginTop: 10,
  },
  orderCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderCountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Order;
