import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/styles/colors';
import { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isOwn }) => {
  return (
    <View style={{
      alignSelf: isOwn ? 'flex-end' : 'flex-start',
      backgroundColor: isOwn ? Colors.primary : Colors.backgroundSecondary,
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginVertical: 2,
      maxWidth: '70%',
    }}>
      <Text style={{
        color: Colors.textPrimary,
        fontSize: 16,
      }}>
        {message.content}
      </Text>
    </View>
  );
};

export default ChatBubble;
