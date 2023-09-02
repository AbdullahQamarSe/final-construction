import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ip from './ip';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch(`${ip}/api/Login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.UserType === 'vendors') {
          AsyncStorage.setItem('loginDetails', JSON.stringify(data));
          navigation.navigate('AdminHome');
        } else if (data.UserType === 'customer') {
          AsyncStorage.setItem('loginDetails', JSON.stringify(data));
          navigation.navigate('Home');
        } else if (data.UserType === 'Admin') {
          AsyncStorage.setItem('loginDetails', JSON.stringify(data));
          navigation.navigate('AdminHomePage');
        }
        else {
          console.log(data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../Images/construct.png')} style={styles.image} />
      <Text style={styles.title}>Smart Construction</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerText}>Register Your Shop</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('CostCalculator')}>
        <Text style={styles.forgotPasswordText}>Cost Calculator</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'tomato',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 0,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: 'tomato',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: 'tomato',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerText: {
    color: 'tomato',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;
