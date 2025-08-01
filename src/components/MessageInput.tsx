import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/styles/colors';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onAttachmentPress?: () => void;
  onMicPress?: () => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onAttachmentPress,
  onMicPress,
  placeholder = "Type a message...",
  multiline = true,
  maxLength = 1000,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const textInputRef = useRef<TextInput>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;
  const attachButtonScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    // Animate send button
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onSendMessage(message.trim());
    setMessage('');
    setInputHeight(40);
  };

  const handleAttachment = () => {
    if (disabled) return;

    // Animate attachment button
    Animated.sequence([
      Animated.timing(attachButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(attachButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onAttachmentPress?.();
  };

  const handleContentSizeChange = (event: any) => {
    if (multiline) {
      const { height } = event.nativeEvent.contentSize;
      const newHeight = Math.min(Math.max(height, 40), 120); // Min 40, Max 120
      setInputHeight(newHeight);
    }
  };

  const handleTextChange = (text: string) => {
    if (text.length <= maxLength) {
      setMessage(text);
    } else {
      Alert.alert('Message too long', `Maximum ${maxLength} characters allowed`);
    }
  };

  const isMessageEmpty = !message.trim();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: Colors.background,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      minHeight: 64,
    }}>
      {/* Attachment Button */}
      <Animated.View style={{ transform: [{ scale: attachButtonScale }] }}>
        <TouchableOpacity
          onPress={handleAttachment}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Message Input Container */}
      <View style={{
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        minHeight: 40,
        maxHeight: 120,
        justifyContent: 'center',
      }}>
        <TextInput
          ref={textInputRef}
          style={{
            fontSize: 16,
            color: Colors.textPrimary,
            height: inputHeight,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={message}
          onChangeText={handleTextChange}
          onContentSizeChange={handleContentSizeChange}
          multiline={multiline}
          textBreakStrategy="simple"
          editable={!disabled}
          maxLength={maxLength}
        />
      </View>

      {/* Send/Mic Button */}
      <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
        <TouchableOpacity
          onPress={isMessageEmpty ? onMicPress : handleSend}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isMessageEmpty ? Colors.backgroundSecondary : Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Ionicons
            name={isMessageEmpty ? "mic" : "send"}
            size={20}
            color={isMessageEmpty ? Colors.primary : Colors.textPrimary}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Character count indicator (optional) */}
      {message.length > maxLength * 0.8 && (
        <View style={{
          position: 'absolute',
          bottom: 16,
          right: 70,
          backgroundColor: Colors.backgroundTertiary,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 12,
        }}>
          <Ionicons
            name="information-circle"
            size={12}
            color={message.length > maxLength * 0.9 ? Colors.warning : Colors.textMuted}
          />
        </View>
      )}
    </View>
  );
};

export default MessageInput;
