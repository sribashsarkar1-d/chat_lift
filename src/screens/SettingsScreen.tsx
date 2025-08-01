import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/styles/colors';
import { GlobalStyles } from '@/styles/globalStyles';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  
  const settingsOpacity = useSharedValue(0);
  const aboutModalScale = useSharedValue(0);
  const feedbackModalScale = useSharedValue(0);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    readReceipts: true,
    onlineStatus: true,
    darkMode: true,
    autoDownload: false,
    dataUsage: false,
  });

  useEffect(() => {
    settingsOpacity.value = withSpring(1, { duration: 800 });
  }, []);

  const settingsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: settingsOpacity.value,
  }));

  const aboutModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: aboutModalScale.value }],
  }));

  const feedbackModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackModalScale.value }],
  }));

  const openAboutModal = () => {
    setAboutModalVisible(true);
    aboutModalScale.value = withSpring(1, { duration: 500 });
  };

  const closeAboutModal = () => {
    aboutModalScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => setAboutModalVisible(false), 300);
  };

  const openFeedbackModal = () => {
    setFeedbackModalVisible(true);
    feedbackModalScale.value = withSpring(1, { duration: 500 });
  };

  const closeFeedbackModal = () => {
    feedbackModalScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => setFeedbackModalVisible(false), 300);
  };

  const handleToggleSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    Alert.alert('Settings Updated', `${key} is now ${value ? 'enabled' : 'disabled'}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'You have been logged out');
            // Handle logout logic here
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted');
            // Handle account deletion logic here
          },
        },
      ]
    );
  };

  const submitFeedback = () => {
    if (feedbackText.trim()) {
      Alert.alert('Thank You!', 'Your feedback has been submitted successfully');
      setFeedbackText('');
      closeFeedbackModal();
    } else {
      Alert.alert('Error', 'Please enter your feedback');
    }
  };

  const settingsData: SettingsItem[] = [
    // Notifications Section
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Receive notifications for new messages',
      icon: 'notifications',
      type: 'toggle',
      value: settings.notifications,
      onToggle: (value) => handleToggleSetting('notifications', value),
    },
    {
      id: 'sound',
      title: 'Sound',
      subtitle: 'Play sound for notifications',
      icon: 'volume-high',
      type: 'toggle',
      value: settings.soundEnabled,
      onToggle: (value) => handleToggleSetting('soundEnabled', value),
    },
    {
      id: 'vibration',
      title: 'Vibration',
      subtitle: 'Vibrate for notifications',
      icon: 'phone-portrait',
      type: 'toggle',
      value: settings.vibrationEnabled,
      onToggle: (value) => handleToggleSetting('vibrationEnabled', value),
    },

    // Privacy Section
    {
      id: 'readReceipts',
      title: 'Read Receipts',
      subtitle: 'Let others know when you read their messages',
      icon: 'checkmark-done',
      type: 'toggle',
      value: settings.readReceipts,
      onToggle: (value) => handleToggleSetting('readReceipts', value),
    },
    {
      id: 'onlineStatus',
      title: 'Online Status',
      subtitle: 'Show when you\'re online',
      icon: 'radio-button-on',
      type: 'toggle',
      value: settings.onlineStatus,
      onToggle: (value) => handleToggleSetting('onlineStatus', value),
    },

    // Appearance Section
    {
      id: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Use dark theme',
      icon: 'moon',
      type: 'toggle',
      value: settings.darkMode,
      onToggle: (value) => handleToggleSetting('darkMode', value),
    },

    // Storage Section
    {
      id: 'autoDownload',
      title: 'Auto-download Media',
      subtitle: 'Automatically download photos and videos',
      icon: 'download',
      type: 'toggle',
      value: settings.autoDownload,
      onToggle: (value) => handleToggleSetting('autoDownload', value),
    },
    {
      id: 'dataUsage',
      title: 'Low Data Usage',
      subtitle: 'Reduce data consumption',
      icon: 'cellular',
      type: 'toggle',
      value: settings.dataUsage,
      onToggle: (value) => handleToggleSetting('dataUsage', value),
    },
  ];

  const actionItems: SettingsItem[] = [
    {
      id: 'backup',
      title: 'Backup & Restore',
      subtitle: 'Backup your chat history',
      icon: 'cloud-upload',
      type: 'action',
      onPress: () => Alert.alert('Backup', 'Backup feature will be available soon'),
      color: Colors.primary,
    },
    {
      id: 'storage',
      title: 'Storage Usage',
      subtitle: 'Manage storage and cache',
      icon: 'archive',
      type: 'action',
      onPress: () => Alert.alert('Storage', 'Current usage: 2.5 GB'),
      color: Colors.warning,
    },
    {
      id: 'blocked',
      title: 'Blocked Contacts',
      subtitle: 'Manage blocked users',
      icon: 'ban',
      type: 'action',
      onPress: () => Alert.alert('Blocked', 'No blocked contacts'),
      color: Colors.error,
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle',
      type: 'action',
      onPress: openAboutModal,
      color: Colors.info,
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      icon: 'chatbubble-ellipses',
      type: 'action',
      onPress: openFeedbackModal,
      color: Colors.success,
    },
    {
      id: 'logout',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: 'log-out',
      type: 'action',
      onPress: handleLogout,
      color: Colors.warning,
    },
    {
      id: 'delete',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      icon: 'trash',
      type: 'action',
      onPress: handleDeleteAccount,
      color: Colors.error,
    },
  ];

  const renderSettingsSection = (title: string, items: SettingsItem[]) => (
    <View
      style={{
        backgroundColor: Colors.backgroundSecondary,
        marginTop: 20,
        paddingVertical: 16,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: Colors.textPrimary,
          marginBottom: 16,
          paddingHorizontal: 20,
        }}
      >
        {title}
      </Text>
      
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: index < items.length - 1 ? 0.5 : 0,
            borderBottomColor: Colors.border,
          }}
          onPress={item.onPress}
          disabled={item.type === 'toggle'}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${item.color || Colors.primary}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}
          >
            <Ionicons 
              name={item.icon as any} 
              size={20} 
              color={item.color || Colors.primary} 
            />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: Colors.textPrimary,
                marginBottom: 2,
              }}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textSecondary,
                }}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
          
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{
                false: Colors.textMuted,
                true: Colors.primary,
              }}
              thumbColor={Colors.textPrimary}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: StatusBar.currentHeight || 44,
          paddingBottom: 16,
          backgroundColor: Colors.backgroundSecondary,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: Colors.textPrimary,
            flex: 1,
          }}
        >
          Settings
        </Text>
      </View>

      <Animated.ScrollView
        style={[settingsAnimatedStyle, { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {renderSettingsSection('Notifications', settingsData.slice(0, 3))}
        {renderSettingsSection('Privacy', settingsData.slice(3, 5))}
        {renderSettingsSection('Appearance', settingsData.slice(5, 6))}
        {renderSettingsSection('Storage & Data', settingsData.slice(6))}
        {renderSettingsSection('General', actionItems)}
      </Animated.ScrollView>

      {/* About Modal */}
      <Modal
        transparent
        visible={aboutModalVisible}
        onRequestClose={closeAboutModal}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={closeAboutModal}
        >
          <Animated.View
            style={[
              aboutModalAnimatedStyle,
              {
                backgroundColor: Colors.modalBackground,
                borderRadius: 20,
                padding: 24,
                width: '100%',
                maxWidth: 400,
              },
            ]}
          >
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: Colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="chatbubbles" size={40} color={Colors.textPrimary} />
              </View>
              
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: Colors.textPrimary,
                  marginBottom: 8,
                }}
              >
                ChatApp
              </Text>
              
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Version 1.0.0
              </Text>
              
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textMuted,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                A modern messaging app built with React Native. Connect with friends and family through beautiful conversations.
              </Text>
            </View>
            
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 18,
                }}
              >
                © 2024 ChatApp. All rights reserved.{'\n'}
                Built with ❤️ for better communication.
              </Text>
            </View>
            
            <TouchableOpacity
              style={[GlobalStyles.button]}
              onPress={closeAboutModal}
            >
              <Text style={[GlobalStyles.buttonText]}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        transparent
        visible={feedbackModalVisible}
        onRequestClose={closeFeedbackModal}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={closeFeedbackModal}
        >
          <Animated.View
            style={[
              feedbackModalAnimatedStyle,
              {
                backgroundColor: Colors.modalBackground,
                borderRadius: 20,
                padding: 24,
                width: '100%',
                maxWidth: 400,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: Colors.textPrimary,
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Send Feedback
            </Text>
            
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Help us improve ChatApp by sharing your thoughts and suggestions.
            </Text>
            
            <View style={{ marginBottom: 24 }}>
              <Text style={[GlobalStyles.inputLabel]}>Your Feedback</Text>
              <TextInput
                style={[GlobalStyles.input, GlobalStyles.inputMultiline]}
                value={feedbackText}
                onChangeText={setFeedbackText}
                placeholder="Share your thoughts..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={500}
              />
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[GlobalStyles.button, GlobalStyles.secondaryButton, { flex: 1 }]}
                onPress={closeFeedbackModal}
              >
                <Text style={[GlobalStyles.buttonText, GlobalStyles.secondaryButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[GlobalStyles.button, { flex: 1 }]}
                onPress={submitFeedback}
              >
                <Text style={[GlobalStyles.buttonText]}>Send</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SettingsScreen;