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

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    dispatch(setLoading(true));
    buttonScale.value = withSpring(0.95, { duration: 150 });
    
    // Simulate register API call
    setTimeout(async () => {
      try {
        const userData = {
          id: Date.now().toString(),
          name,
          email,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=4A90E2&color=fff`,
          status: 'online' as const,
        };

        const token = 'mock-jwt-token';

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
        Alert.alert('Error', 'Registration failed. Please try again.');
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

        <Text style={GlobalStyles.header}>Create Account</Text>
        <Text style={[GlobalStyles.subHeader, { marginBottom: 48 }]}>
          Join ChatLift community
        </Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Full Name"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
        />

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

        <TextInput
          style={GlobalStyles.input}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.textMuted}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Animated.View style={[buttonAnimatedStyle, { width: '100%' }]}>
          <TouchableOpacity style={GlobalStyles.button} onPress={handleRegister}>
            <Text style={GlobalStyles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN as never)}
        >
          <Text style={GlobalStyles.linkText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
