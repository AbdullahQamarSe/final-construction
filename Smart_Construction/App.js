import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import add_product from './Screens/add_product';
import user_home from './Screens/UserHome';
import ProductList from './Screens/home';
import OrderBill from './Screens/Orderbill';
import Order from './Screens/order';
import AdminHome from './Screens/adminHome';
import Categoryhome from './Screens/category_home';
import Cart from './Screens/cart';
import Register from './Screens/Register'
import AdminHomePage from './Screens/1Adminhome';
import CostCalculator from './Screens/gray_area';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} >
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="CostCalculator" component={CostCalculator}/>
        <Stack.Screen name="AdminHomePage" component={AdminHomePage}/>
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Cart" component={Cart}/>
        <Stack.Screen name="CategoryHome" component={Categoryhome}/>
        <Stack.Screen name="AdminHome" component={AdminHome}/>
        <Stack.Screen name="Home" component={user_home} />
        <Stack.Screen name="Order" component={Order} />
        <Stack.Screen name="Add_Product" component={add_product} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="OrderBill" component={OrderBill}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;