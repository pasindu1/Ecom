import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';

import tw from 'twrnc';

import productStore, { Product } from '../../store/store';
import Header from '../../components/header';
import { PRODUCT_DETAILS_SCREEN } from '../../constants/screen';
import { RootStackParamList } from '../../navigation/appNavigator';

type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const fetchProducts = productStore(state => state.fetchProducts);
  const navigation = useNavigation<ScreenNavigationProp>();
  const products: Product[] = productStore(state => state.products);

  // getting the products JSON initially
  useEffect(() => {
    fetchProducts();
  }, []);

  const Item = ({item}) => (
    <TouchableOpacity onPress={() => navigation.navigate(PRODUCT_DETAILS_SCREEN, { productId: item?.id })}>
      <View style={[tw`bg-white rounded-lg p-4 shadow-md mb-4`]}>
        <Image
          source={{uri: item?.mainImage}}
          style={tw`w-full h-60 mb-2`}
          resizeMode="cover"
        />
        <View style={tw`flex flex-row`}>
          <Text
            style={tw`text-gray-500`}>{`${item?.price?.currency} `}</Text>
          <Text style={tw`text-gray-500`}>{item?.price?.amount}</Text>
        </View>

        <Text style={tw`text-lg font-semibold`}>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <ScrollView style={tw`px-4 py-4`}>
        {/* use map functionality as this is a small list and have static data 
        if the list getting larger Flatlist would be ideal */}
        {products.map((product) => (
          <Item item={product} key={product?.id}/>
        ))}
      </ScrollView>
    </>
  );
};

export default HomeScreen;
