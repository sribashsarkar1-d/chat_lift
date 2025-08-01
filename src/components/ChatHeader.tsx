import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/styles/colors';

interface ChatHeaderProps {
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  isTyping?: boolean;
  onBackPress: () => void;
  onProfilePress?: () => void;
  onCallPress?: () => void;
  onVideoCallPress?: () => void;
  onMenuPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  isOnline,
  lastSeen,
  isTyping,
  onBackPress,
  onProfilePress,
  onCallPress,
  onVideoCallPress,
  onMenuPress,
}) => {
  const headerOpacity = useSharedValue(0);
  const avatarScale = useSharedValue(1);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  React.useEffect(() => {
    headerOpacity.value = withSpring(1, { duration: 800 });
  }, []);

  const handleAvatarPress = () => {
    avatarScale.value = withSpring(0.95, { duration: 150 }, () => {
      avatarScale.value = withSpring(1, { duration: 150 });
    });
    onProfilePress?.();
  };

  const getStatusText = () => {
    if (isTyping) return 'typing...';
    if (isOnline) return 'Online';
    return lastSeen || 'Offline';
  };

  const getStatusColor = () => {
    if (isTyping) return Colors.primary;
    if (isOnline) return Colors.online;
    return Colors.textMuted;
  };

  return (
    <Animated.View style={[headerAnimatedStyle, {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: Colors.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      elevation: 4,
      shadowColor: Colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    }]}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Profile Section */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
        onPress={handleAvatarPress}
      >
        <Animated.View style={[avatarAnimatedStyle, { position: 'relative' }]}>
          <Image
            source={{ uri: avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
            }}
          />
          {isOnline && (
            <View style={{
              position: 'absolute',
              bottom: 0,
              right: 8,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: Colors.online,
              borderWidth: 2,
              borderColor: Colors.background,
            }} />
          )}
        </Animated.View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: Colors.textPrimary,
            marginBottom: 2,
          }}>
            {name}
          </Text>
          <Text style={{
            fontSize: 12,
            color: getStatusColor(),
            fontStyle: isTyping ? 'italic' : 'normal',
          }}>
            {getStatusText()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {onCallPress && (
          <TouchableOpacity
            onPress={onCallPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons name="call" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}
        
        {onVideoCallPress && (
          <TouchableOpacity
            onPress={onVideoCallPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons name="videocam" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {onMenuPress && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default ChatHeader;
