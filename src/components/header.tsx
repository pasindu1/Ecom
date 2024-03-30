import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import {PRODUCT_CART_SCREEM} from '../constants/screen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/appNavigator';

type Header = {
  title?: string;
  enablebackButton?: boolean;
  onPressBackButton?: () => void;
};
type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = ({
  title,
  enablebackButton = false,
  onPressBackButton,
}: Header) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const style = useMemo(() => {
    if (!title && !enablebackButton) return '';
    return `flex-row justify-between items-center`;
  }, [title, enablebackButton]);

  const onPressRightButton = () => navigation.navigate(PRODUCT_CART_SCREEM);

  return (
    <SafeAreaView
      style={tw`bg-white ${Platform.OS === 'android' ? 'pt-4' : ''}`}>
      <View style={tw`flex ${style} border-b border-gray-300 px-4 pb-4`}>
        {enablebackButton ? (
          <TouchableOpacity onPress={onPressBackButton}>
            <Image
              source={{uri: 'https://img.icons8.com/ios-glyphs/30/back.png'}}
              style={tw`w-5 h-5`}
            />
          </TouchableOpacity>
        ) : null}
        {title ? <Text style={tw`text-lg font-bold`}>{title}</Text> : null}

        <TouchableOpacity
          style={tw`flex-row justify-end items-end`}
          onPress={onPressRightButton}>
          <Image
            source={{
              uri: 'https://img.icons8.com/ios/50/shopping-cart--v1.png',
            }}
            style={tw`w-5 h-5`}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
