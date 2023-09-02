import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import ip from './ip';
import Login from './Login';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [showAreaList, setShowAreaList] = useState(false);
  const [areas, setAreas] = useState([]);
  const [image, setImage] = useState(null);
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const fetchAreas = () => {
    fetch(`${ip}/api/order/Area_APi/`)
      .then((response) => response.json())
      .then((data) => {
        setAreas(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit OTP
    setOtpCode(otp.toString()); // Convert OTP to string and store it
    sendOTP(email, otp); // Send OTP to the specified API
  };

  const sendOTP = (email, otp) => {
    fetch(`${ip}/api/verify-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSignup = () => {
    if (otp === otpCode) {
      const userData = new FormData();
      userData.append('name', username);
      userData.append('email', email);
      userData.append('password', password);
      userData.append('address', address);
      userData.append('select_area', area);
      userData.append('cordinate', '1234');
      userData.append('UserType', 'vendors');
      userData.append(
        'image1',
        image
          ? {
              uri: image.path,
              name: 'image.jpg',
              type: 'image/jpeg',
            }
          : null
      );
      userData.append('Shop_name', shopName);
      userData.append('Phone', phone);

      createUser(userData);
    } else {
      console.log('Invalid OTP');
    }
  };

  const createUser = (userData) => {
    fetch(`${ip}/api/Signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data', // Update content type to send form data
      },
      body: userData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.email);
        console.log(email);

        if (data.email === email) {
          navigation.navigate('Login');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAreaPress = () => {
    setShowAreaList(!showAreaList);
  };

  const handleAreaSelect = (item) => {
    setArea(item.Area);
    setShowAreaList(false);
  };

  const handleImageUpload = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        setImage(image);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOtpSubmit = () => {
    // Handle OTP verification here
    handleSignup(); // Call handleSignup if the OTP is correct
  };

  const navigation = useNavigation();

  const renderOTPInputs = () => {
    const otpInputs = [];

    for (let i = 0; i < 4; i++) {
      otpInputs.push(
        <TextInput
          key={i}
          style={styles.otpInput}
          keyboardType="numeric"
          maxLength={1}
          value={otp[i] || ''}
          onChangeText={(text) => {
            const newOtp = [...otp];
            newOtp[i] = text;
            setOtp(newOtp.join(''));
          }}
        />
      );
    }

    return otpInputs;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../Images/construct.png')} style={styles.image} />
      <Text style={styles.title}>Smart Construction</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TouchableWithoutFeedback onPress={handleAreaPress}>
          <View style={styles.areaInput}>
            <Text style={styles.areaText}>{area ? area : 'Select Area'}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text></Text>
        <Text></Text>
        <Modal visible={showAreaList} animationType="slide">
          <FlatList
            data={areas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleAreaSelect(item)}>
                <Text style={styles.areaOption}>{item.Area}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => setShowAreaList(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Modal>
        <TextInput
          style={styles.input}
          placeholder="Shop Name"
          value={shopName}
          onChangeText={(text) => setShopName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={generateOTP}>
          <Text style={styles.buttonText}>Send OTP To Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setOtpModalVisible(true)}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={otpModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter OTP</Text>
          <View style={styles.otpContainer}>{renderOTPInputs()}</View>
          <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOtpModalVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'tomato',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 3,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 8,
    borderRadius: 5,
    width:80,
    marginTop: 15,
    justifyContent:'center',
    alignSelf:'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 12,
    marginRight: 5,
  },
  footerLink: {
    color: 'tomato',
    fontWeight: 'bold',
    fontSize: 12,
  },
  areaInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  areaText: {
    fontSize: 12,
    color: '#555',
  },
  areaOption: {
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 0,
  },
  locationButtonText: {
    color: '#555',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: 'tomato',
    paddingVertical: 8,
    width:80,
    borderRadius: 5,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'tomato',
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 3,
    width: 60,
    height:60,
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 16,
  },
});

export default Register;
