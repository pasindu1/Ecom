import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';

import tw from 'twrnc';

import Header from '../../components/header';
import productStore from '../../store/store';
import {
  PRODUCT_CART_SCREEM,
  PRODUCT_DETAILS_SCREEN,
} from '../../constants/screen';
import {RootStackParamList} from '../../navigation/appNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type ScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof PRODUCT_DETAILS_SCREEN
>;
type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductDetail = () => {
  const {
    params: {productId},
  } = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<ScreenNavigationProp>();

  const selectedProduct = productStore(
    state => state.productByKeys?.[productId],
  );

  const {
    SKU,
    brandName,
    colour,
    description,
    mainImage,
    price,
    stockStatus,
    sizes,
    name,
  } = selectedProduct ?? {};

  const addToCart = productStore(state => state.addToCart);
  const [selectedSize, setSelectedSize] = useState<number | null>(sizes?.[0]);
  

  const handleSizeSelect = (size: number) => setSelectedSize(size);

  const goBack = () => navigation.goBack();

  // add to the cart and navigate to the product cart screen
  const addToTheCart = () => {
    addToCart(productId, selectedSize);
    navigation.navigate(PRODUCT_CART_SCREEM);
  };

  return (
    <>
      <Header
        title={brandName}
        onPressBackButton={goBack}
        enablebackButton={true}
      />
      <ScrollView style={tw`flex-1 bg-white px-3`}>
        <Image
          source={{
            uri: mainImage,
          }}
          style={tw`w-full h-60 mt-4`}
          resizeMode="cover"
        />
        <View style={tw`p-4`}>
          <Text style={tw`text-xl font-bold mb-2`}>{name}</Text>
          <Text style={tw`text-gray-600 mb-2`}>SKU: {SKU}</Text>
          <Text style={tw`text-gray-600 mb-2`}>Color: {colour}</Text>
          <Text style={tw`text-gray-600 mb-2`}>Brand: {brandName}</Text>
          <Text style={tw`text-green-500 mb-4`}>{stockStatus}</Text>
          <Text style={tw`text-lg font-bold mb-2`}>
            Price: {`${price?.currency} ${price?.amount}`}
          </Text>
          <View style={tw`flex-1 flex-row`}>
            {sizes?.map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  tw`bg-gray-200 px-3 py-1 rounded-full mr-2`,
                  selectedSize === size && tw`bg-blue-500 text-white`,
                ]}
                onPress={() => handleSizeSelect(size)}>
                <Text style={tw`text-base`}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={tw`text-base mt-4 mb-4`}>
            Description: {description}
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={addToTheCart}
        style={tw`bg-blue-500 py-3 rounded-2xl items-center mb-10 mx-3`}>
        <Text style={tw`text-white text-lg font-bold`}>Add to Cart</Text>
      </TouchableOpacity>
    </>
  );
};

export default ProductDetail;
