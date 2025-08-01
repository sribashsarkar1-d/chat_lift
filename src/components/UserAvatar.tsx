import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '@/styles/colors';

interface UserAvatarProps {
  uri?: string;
  name: string;
  size?: number;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  showAddButton?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
  onPress?: () => void;
  onAddPress?: () => void;
  style?: any;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  uri,
  name,
  size = 50,
  showOnlineStatus = false,
  isOnline = false,
  showAddButton = false,
  showBadge = false,
  badgeCount = 0,
  onPress,
  onAddPress,
  style,
}) => {
  const scale = useSharedValue(1);
  const borderRadius = size / 2;
  const statusSize = Math.max(size * 0.2, 10);
  const addButtonSize = Math.max(size * 0.3, 16);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (onPress) {
      scale.value = withSpring(0.95, { duration: 150 }, () => {
        scale.value = withSpring(1, { duration: 150 });
      });
      onPress();
    }
  };

  const generateInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const generateAvatarUrl = (fullName: string) => {
    const initials = generateInitials(fullName);
    return `https://ui-avatars.com/api/?name=${initials}&background=4A90E2&color=fff&size=${size * 2}`;
  };

  const avatarSource = uri || generateAvatarUrl(name);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!onPress}
      style={[{ position: 'relative' }, style]}
    >
      <Animated.View style={animatedStyle}>
        {/* Main Avatar */}
        <View style={{
          width: size,
          height: size,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: Colors.backgroundSecondary,
        }}>
          {uri || name ? (
            <Image
              source={{ uri: avatarSource }}
              style={{
                width: size,
                height: size,
                borderRadius,
              }}
              defaultSource={{
                uri: generateAvatarUrl(name || 'User'),
              }}
            />
          ) : (
            <View style={{
              width: size,
              height: size,
              borderRadius,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: Colors.textPrimary,
                fontSize: size * 0.4,
                fontWeight: 'bold',
              }}>
                {generateInitials(name || 'U')}
              </Text>
            </View>
          )}
        </View>

        {/* Online Status Indicator */}
        {showOnlineStatus && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusSize,
            height: statusSize,
            borderRadius: statusSize / 2,
            backgroundColor: isOnline ? Colors.online : Colors.offline,
            borderWidth: 2,
            borderColor: Colors.background,
          }} />
        )}

        {/* Add Button */}
        {showAddButton && (
          <TouchableOpacity
            onPress={onAddPress}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: addButtonSize,
              height: addButtonSize,
              borderRadius: addButtonSize / 2,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: Colors.background,
            }}
          >
            <Ionicons 
              name="add" 
              size={addButtonSize * 0.6} 
              color={Colors.textPrimary} 
            />
          </TouchableOpacity>
        )}

        {/* Badge for unread count */}
        {showBadge && badgeCount > 0 && (
          <View style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: Colors.background,
          }}>
            <Text style={{
              color: Colors.textPrimary,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default UserAvatar;
