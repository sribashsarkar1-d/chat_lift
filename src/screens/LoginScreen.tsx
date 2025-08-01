import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GlobalStyles } from '@/styles/globalStyles';
import { Colors } from '@/styles/colors';
import { STORAGE_KEYS, SCREEN_NAMES } from '@/utils/constants';
import { setUser, setToken, setLoading } from '@/store/slices/userSlice';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    dispatch(setLoading(true));
    buttonScale.value = withSpring(0.95, { duration: 150 });
    
    // Simulate login API call
    setTimeout(async () => {
      try {
        // Mock user data - replace with actual API call
        const userData = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4A90E2&color=fff`,
          status: 'online' as const,
        };

        const token = 'mock-jwt-token';

        // Store user data
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userData.id);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

        dispatch(setUser(userData));
        dispatch(setToken(token));
        dispatch(setLoading(false));

        buttonScale.value = withSpring(1);
        navigation.navigate(SCREEN_NAMES.HOME as never);
      } catch (error) {
        dispatch(setLoading(false));
        buttonScale.value = withSpring(1);
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={GlobalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[GlobalStyles.centerContainer, { paddingHorizontal: 32 }]}>
        <View style={{
          width: 80,
          height: 80,
          backgroundColor: Colors.primary,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 32,
        }}>
          <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: Colors.textPrimary,
          }}>C</Text>
        </View>

        <Text style={GlobalStyles.header}>Welcome Back</Text>
        <Text style={[GlobalStyles.subHeader, { marginBottom: 48 }]}>
          Sign in to continue chatting
        </Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Animated.View style={[buttonAnimatedStyle, { width: '100%' }]}>
          <TouchableOpacity style={GlobalStyles.button} onPress={handleLogin}>
            <Text style={GlobalStyles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER as never)}
        >
          <Text style={GlobalStyles.linkText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
