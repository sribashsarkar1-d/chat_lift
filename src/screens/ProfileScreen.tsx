import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { RootState } from '@/store';
import { setUser } from '@/store/slices/userSlice';
import { GlobalStyles } from '@/styles/globalStyles';
import { Colors } from '@/styles/colors';
import { STORAGE_KEYS } from '@/utils/constants';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const headerOpacity = useSharedValue(0);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [about, setAbout] = useState('Hey there! I am using ChatLift.');

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  React.useEffect(() => {
    headerOpacity.value = withSpring(1, { duration: 800 });
  }, []);

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      const updatedUser = {
        ...user!,
        name: editedName,
        email: editedEmail,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      dispatch(setUser(updatedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const profileItems = [
    {
      id: '1',
      title: 'Name',
      value: user?.name || '',
      icon: 'person-outline',
      editable: true,
    },
    {
      id: '2',
      title: 'Email',
      value: user?.email || '',
      icon: 'mail-outline',
      editable: true,
    },
    {
      id: '3',
      title: 'About',
      value: about,
      icon: 'information-circle-outline',
      editable: true,
    },
    {
      id: '4',
      title: 'Phone',
      value: '+1 234 567 8900',
      icon: 'call-outline',
      editable: false,
    },
  ];

  const renderProfileItem = (item: any) => (
    <View key={item.id} style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
      }}>
        <Ionicons name={item.icon} size={20} color={Colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 14,
          color: Colors.textSecondary,
          marginBottom: 4,
        }}>
          {item.title}
        </Text>
        
        {isEditing && item.editable ? (
          <TextInput
            style={{
              fontSize: 16,
              color: Colors.textPrimary,
              padding: 8,
              backgroundColor: Colors.backgroundSecondary,
              borderRadius: 8,
            }}
            value={
              item.title === 'Name' ? editedName :
              item.title === 'Email' ? editedEmail :
              item.title === 'About' ? about : item.value
            }
            onChangeText={(text) => {
              if (item.title === 'Name') setEditedName(text);
              else if (item.title === 'Email') setEditedEmail(text);
              else if (item.title === 'About') setAbout(text);
            }}
            multiline={item.title === 'About'}
          />
        ) : (
          <Text style={{
            fontSize: 16,
            color: Colors.textPrimary,
            fontWeight: '500',
          }}>
            {item.value}
          </Text>
        )}
      </View>

      {item.editable && !isEditing && (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Ionicons name="pencil" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <Animated.View style={[headerAnimatedStyle, {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: Colors.background,
      }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: Colors.textPrimary,
        }}>
          Profile
        </Text>

        {isEditing ? (
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={{
              fontSize: 16,
              color: Colors.primary,
              fontWeight: '600',
            }}>
              Save
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      <ScrollView style={{ flex: 1 }}>
        {/* Profile Picture Section */}
        <View style={{
          alignItems: 'center',
          paddingVertical: 40,
          backgroundColor: Colors.backgroundSecondary,
        }}>
          <TouchableOpacity style={{ position: 'relative' }}>
            <Image
              source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff' }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: Colors.primary,
              }}
            />
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: Colors.backgroundSecondary,
            }}>
              <Ionicons name="camera" size={16} color={Colors.textPrimary} />
            </View>
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors.textPrimary,
            marginTop: 16,
          }}>
            {user?.name || 'User Name'}
          </Text>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.online,
              marginRight: 8,
            }} />
            <Text style={{
              fontSize: 14,
              color: Colors.textSecondary,
            }}>
              Online
            </Text>
          </View>
        </View>

        {/* Profile Details */}
        <View style={{ marginTop: 20 }}>
          {profileItems.map(renderProfileItem)}
        </View>

        {/* Action Buttons */}
        <View style={{ padding: 20, marginTop: 40 }}>
          <TouchableOpacity style={{
            backgroundColor: Colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              color: Colors.textPrimary,
              fontSize: 16,
              fontWeight: '600',
            }}>
              Share Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: Colors.backgroundSecondary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
            <Text style={{
              color: Colors.textPrimary,
              fontSize: 16,
              fontWeight: '600',
            }}>
              QR Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
