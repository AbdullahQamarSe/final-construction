import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';

const OrderBill = ({ route, navigation }) => {
  const { email, productArray, priceArray, quantityArray, codeArray } = route.params;
  const totalPrice = priceArray.reduce((total, price, index) => {
    const quantity = parseInt(quantityArray[index]);
    return total + (parseInt(price) * quantity);
  }, 0);
  const viewRef = useRef(null);

  const navigateToAnotherScreen = () => {
    // Replace 'Another Screen' with the actual screen name you want to navigate to
    navigation.navigate('Home');
  };

  const generateRandomNo = () => {
    const randomNo = Math.floor(Math.random() * 1000000);
    return randomNo;
  };

  const captureAndSaveScreenshot = async () => {
    try {
      const captureOptions = { format: 'png', quality: 0.8 };

      const uri = await captureRef(viewRef.current, captureOptions);
      const randomNo = generateRandomNo();
      const destinationPath = RNFS.DownloadDirectoryPath + `/randomno_${randomNo}.png`;

      await RNFS.copyFile(uri, destinationPath);

      console.log('Screenshot saved:', destinationPath);
    } catch (error) {
      console.log('Failed to save screenshot:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View ref={viewRef} style={{ backgroundColor: '#ffffff' }}>
        <Text style={styles.heading}>Order Summary</Text>
        <View style={styles.billContainer}>
          <View style={styles.table}>
            <View style={styles.row}>
              <Text style={[styles.headerText, { marginRight: 16 }]}>Product Name</Text>
              <Text style={styles.headerText}>Price</Text>
              <Text style={styles.headerText}>Quantity</Text>
            </View>
            {productArray.map((data, index) => (
              <View key={index} style={styles.row}>
                <Text style={[styles.itemText, { marginRight: 16 }]}>{data}</Text>
                <Text style={styles.itemText}>{parseInt(priceArray[index]) * quantityArray[index]}</Text>
                <Text style={styles.itemText}>{quantityArray[index]}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Bill: $ {totalPrice}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { marginRight: 16 }]} onPress={captureAndSaveScreenshot}>
          <Text style={styles.buttonText}>Save to Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToAnotherScreen}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#ff5757',
  },
  billContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  table: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    color: '#333',
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  totalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ff5757',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    backgroundColor: '#ff5757',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderBill;
