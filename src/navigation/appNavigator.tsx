import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/home.component';
import {
  HOME_SCREEN,
  PRODUCT_CART_SCREEM,
  PRODUCT_DETAILS_SCREEN,
} from '../constants/screen';
import ProductCart from '../screens/product-cart/product-cart.component';
import ProductDetail from '../screens/product-details/product-details.component';

export type RootStackParamList = {
  [HOME_SCREEN]: undefined
  [PRODUCT_CART_SCREEM]: undefined;
  [PRODUCT_DETAILS_SCREEN]: {
    productId: string
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={HOME_SCREEN}
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}>
      <Stack.Screen
        name={HOME_SCREEN}
        component={HomeScreen}
        options={{title: 'PRODUCTS'}}
      />
      <Stack.Screen name={PRODUCT_CART_SCREEM} component={ProductCart} />
      <Stack.Screen name={PRODUCT_DETAILS_SCREEN} component={ProductDetail} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
