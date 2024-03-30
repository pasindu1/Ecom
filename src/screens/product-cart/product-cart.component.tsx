import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';

import tw from 'twrnc';

import Header from '../../components/header';
import productStore, {ProductStore} from '../../store/store';
import {HOME_SCREEN} from '../../constants/screen';
import {RootStackParamList} from '../../navigation/appNavigator';

type CartItem = {
  productByKeys: ProductStore['productByKeys'];
  productsInCart: {[id: string]: {quantity: number}};
  id: string;
  handleRemoveOneItem: Function;
  handleRemoveItem: Function;
  handleAddItem: Function;
  size: string;
};
type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductCart = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const productsInCart = productStore(state => state.productsInCart);
  const productByKeys = productStore(state => state.productByKeys);
  const addToCart = productStore(state => state.addToCart);
  const removeFromCart = productStore(state => state.removeFromCart);
  const removeItem = productStore(state => state.removeItem);
  const items = Object.keys(productsInCart);

  const totalAmount =
     items.reduce(
      (total, curValue) =>
        total +
        Number(productByKeys[curValue].price.amount) *
          productsInCart[curValue].totalQuantity,
      0,
    );

  const handleAddItem = (id: string, size: string) => addToCart(id, size);

  const handleRemoveOneItem = (id: string, size: string) =>
    removeFromCart(id, size);

  const handleRemoveItem = (id: string, size: string) => removeItem(id, size);

  const goBack = () => navigation.navigate(HOME_SCREEN);

  return (
    <>
      <Header title="Cart" onPressBackButton={goBack} enablebackButton={true} />
      <ScrollView style={tw`bg-white flex-1`}>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          items.map(id => {
            const sizesArray = Object.keys(productsInCart?.[id]?.sizes);
            return sizesArray.map(size => (
              <CartItem
                key={size}
                productByKeys={productByKeys}
                productsInCart={productsInCart}
                id={id}
                size={size}
                handleRemoveOneItem={handleRemoveOneItem}
                handleRemoveItem={handleRemoveItem}
                handleAddItem={handleAddItem}
              />
            ));
          })
        )}
      </ScrollView>
      <View style={tw`p-4 border-t border-gray-200 pb-10 bg-white`}>
        <Text style={tw`text-lg font-bold mb-4`}>
          Total Amount: {productByKeys?.[1]?.price?.currency} {totalAmount}
        </Text>

        <TouchableOpacity
          onPress={() => {}}
          style={tw`bg-blue-500 py-3 rounded-2xl items-center`}>
          <Text style={tw`text-white text-lg font-bold`}>
            Proceed To Payment
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const EmptyCart = () =>
  React.useMemo(
    () => (
      <View style={tw`flex-1 justify-center items-center mt-10`}>
        <Text style={tw`text-lg`}>Your cart is empty</Text>
        <Text style={tw`text-gray-500 mt-2`}>
          Add some items to your cart to get started
        </Text>
      </View>
    ),
    [],
  );

const CartItem = ({
  productByKeys,
  productsInCart,
  id,
  handleRemoveOneItem,
  handleRemoveItem,
  handleAddItem,
  size,
}: CartItem) => (
  <>
    <Text style={tw`text-lg font-bold mb-2 px-4 pt-4`}>
      {productByKeys?.[id]?.name}
    </Text>
    <Text style={tw`text-gray-600 mb-2 px-4`}>
      Price: {productByKeys?.[id].price.currency}{' '}
      {productByKeys?.[id].price.amount}
    </Text>
    <Text style={tw`text-gray-600 mb-2 px-4`}>Shoe size: {size}</Text>
    <View
      key={productByKeys?.[id].id}
      style={tw`flex-row p-4 border-b border-gray-200 items-center`}>
      <Image
        source={{uri: productByKeys?.[id].mainImage}}
        style={tw`w-20 h-20 mr-4`}
        resizeMode="cover"
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-600`}>
          Quantity: {productsInCart[id].sizes?.[size]?.quantity}
        </Text>
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          style={tw`bg-blue-500 px-4 py-2 rounded-lg mr-2`}
          onPress={() => handleRemoveOneItem(id, size)}>
          <Text style={tw`text-white`}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-red-500 px-4 py-2 rounded-lg mr-2`}
          onPress={() => handleRemoveItem(id, size)}>
          <Text style={tw`text-white`}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
          onPress={() => handleAddItem(id, size)}>
          <Text style={tw`text-white`}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
);

export default ProductCart;
