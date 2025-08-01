import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import { GlobalStyles } from '@/styles/globalStyles';
import { Colors } from '@/styles/colors';
import { STORAGE_KEYS, SCREEN_NAMES } from '@/utils/constants';
import { setUser, setToken } from '@/store/slices/userSlice';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const checkAuthStatus = async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (userId && token && userData) {
        dispatch(setUser(JSON.parse(userData)));
        dispatch(setToken(token));
        navigation.navigate(SCREEN_NAMES.HOME as never);
      } else {
        navigation.navigate(SCREEN_NAMES.LOGIN as never);
      }
    } catch (error) {
      navigation.navigate(SCREEN_NAMES.LOGIN as never);
    }
  };

  useEffect(() => {
    opacity.value = withSpring(1, { duration: 1000 });
    scale.value = withSequence(
      withSpring(1.1, { duration: 800 }),
      withSpring(1, { duration: 400 }),
      withDelay(1500, withSpring(0.9, { duration: 300 }))
    );

    const timer = setTimeout(() => {
      runOnJS(checkAuthStatus)();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[GlobalStyles.centerContainer, { backgroundColor: Colors.background }]}>
      <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
        <View style={{
          width: 120,
          height: 120,
          backgroundColor: Colors.primary,
          borderRadius: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <Text style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: Colors.textPrimary,
          }}>C</Text>
        </View>
        <Text style={[GlobalStyles.header, { marginBottom: 8 }]}>ChatLift</Text>
        <Text style={GlobalStyles.subHeader}>Connect • Chat • Elevate</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
