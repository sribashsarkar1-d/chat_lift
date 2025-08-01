import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Pressable,
  ScrollView,
  Dimensions,
  Share,
  Vibration,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { RootState } from '@/store';
import { GlobalStyles } from '@/styles/globalStyles';
import { ChatStyles } from '@/styles/chatStyles';
import { Colors } from '@/styles/colors';
import { UserAvatar } from '@/components';
import { Message, RootStackParamList } from '@/types';
import { SCREEN_NAMES } from '@/utils/constants';
import type { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface ChatMessage extends Message {
  isOwn: boolean;
  user: {
    name: string;
    avatar: string;
  };
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  isForwarded?: boolean;
  forwardedFrom?: string;
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  isEdited?: boolean;
  editedAt?: Date;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isTyping: boolean;
  lastSeen?: Date;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute();
  const dispatch = useDispatch();
  const { chatId } = route.params as { chatId: string };
  const user = useSelector((state: RootState) => state.user.user);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [replyMessage, setReplyMessage] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // Modal states
  const [messageOptionsVisible, setMessageOptionsVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [participantsModalVisible, setParticipantsModalVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [forwardModalVisible, setForwardModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewingImage, setViewingImage] = useState<string>('');
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingAnimation = useSharedValue(1);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const messageOptionsScale = useSharedValue(0);
  const searchModalOpacity = useSharedValue(0);
  const participantsModalSlide = useSharedValue(height);
  const replyBoxHeight = useSharedValue(0);
  const emojiPickerSlide = useSharedValue(height);
  
  // Mock chat data
  const chatInfo = {
    id: chatId,
    name: 'Alex Linderson',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
    isOnline: true,
    lastSeen: 'Online',
    isGroup: false,
    participantsCount: 2,
  };

  // Available emojis for reactions
  const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥'];
  
  // Available contacts for forwarding
  const availableContacts = [
    { id: '1', name: 'John Abraham', avatar: 'https://ui-avatars.com/api/?name=John+Abraham&background=42A5F5&color=fff&size=128' },
    { id: '2', name: 'Team Align', avatar: 'https://ui-avatars.com/api/?name=Team+Align&background=EC407A&color=fff&size=128' },
    { id: '3', name: 'Sabila Sayma', avatar: 'https://ui-avatars.com/api/?name=Sabila+Sayma&background=AB47BC&color=fff&size=128' },
  ];

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const messageOptionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: messageOptionsScale.value }],
  }));

  const searchModalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchModalOpacity.value,
  }));

  const participantsModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: participantsModalSlide.value }],
  }));

  const replyBoxAnimatedStyle = useAnimatedStyle(() => ({
    height: replyBoxHeight.value,
  }));

  const recordingAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordingAnimation.value }],
  }));

  const emojiPickerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: emojiPickerSlide.value }],
  }));

  useEffect(() => {
    headerOpacity.value = withSpring(1, { duration: 800 });
    loadMockMessages();
    loadParticipants();
  }, []);

  useEffect(() => {
    if (replyMessage) {
      replyBoxHeight.value = withSpring(60);
    } else {
      replyBoxHeight.value = withSpring(0);
    }
  }, [replyMessage]);

  useEffect(() => {
    if (isRecording) {
      recordingAnimation.value = withSequence(
        withTiming(1.2, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
    }
  }, [isRecording]);

  const loadMockMessages = () => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        chatId,
        senderId: 'other',
        content: 'Hello! How are you doing today? 👋',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'read',
        isOwn: false,
        user: {
          name: 'Alex Linderson',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
        },
        reactions: [
          { emoji: '👍', users: [user?.id || 'me'] },
        ],
      },
      {
        id: '2',
        chatId,
        senderId: user?.id || 'me',
        content: 'Hey Alex! I\'m doing great, thanks for asking. How about you?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        status: 'read',
        isOwn: true,
        user: {
          name: user?.name || 'You',
          avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
        },
      },
      {
        id: '3',
        chatId,
        senderId: 'other',
        content: 'I\'m doing well too! Are you free for a quick call later?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: 'read',
        isOwn: false,
        user: {
          name: 'Alex Linderson',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
        },
        replyTo: {
          id: '2',
          content: 'Hey Alex! I\'m doing great, thanks for asking. How about you?',
          sender: 'You',
        },
      },
      {
        id: '4',
        chatId,
        senderId: user?.id || 'me',
        content: 'Sure! What time works best for you?',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: 'delivered',
        isOwn: true,
        user: {
          name: user?.name || 'You',
          avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
        },
      },
      {
        id: '5',
        chatId,
        senderId: 'other',
        content: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400',
        type: 'image',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'read',
        isOwn: false,
        user: {
          name: 'Alex Linderson',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
        },
      },
      {
        id: '6',
        chatId,
        senderId: user?.id || 'me',
        content: 'Great photo! 📸',
        type: 'text',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'sent',
        isOwn: true,
        user: {
          name: user?.name || 'You',
          avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
        },
        isEdited: true,
        editedAt: new Date(Date.now() - 1000 * 60 * 4),
      },
    ];
    setMessages(mockMessages.reverse());
  };

  const loadParticipants = () => {
    const mockParticipants: Participant[] = [
      {
        id: user?.id || 'me',
        name: user?.name || 'You',
        avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
        isOnline: true,
        isTyping: false,
      },
      {
        id: 'other',
        name: 'Alex Linderson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
        isOnline: true,
        isTyping: false,
      },
    ];
    setParticipants(mockParticipants);
  };

  // Message actions
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId,
      senderId: user?.id || 'me',
      content: editingMessage ? message.trim() : message.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
      isOwn: true,
      user: {
        name: user?.name || 'You',
        avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
      },
      replyTo: replyMessage ? {
        id: replyMessage.id,
        content: replyMessage.content,
        sender: replyMessage.user.name,
      } : undefined,
      isEdited: editingMessage ? true : false,
      editedAt: editingMessage ? new Date() : undefined,
    };

    if (editingMessage) {
      // Update existing message
      setMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, content: message.trim(), isEdited: true, editedAt: new Date() }
          : msg
      ));
      setEditingMessage(null);
    } else {
      // Add new message
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate message sent
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id
              ? { ...msg, status: 'sent' }
              : msg
          )
        );
      }, 1000);
    }

    setMessage('');
    setReplyMessage(null);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleLongPress = (messageItem: ChatMessage) => {
    if (isSelectionMode) return;
    
    Vibration.vibrate(50);
    setSelectedMessage(messageItem);
    setMessageOptionsVisible(true);
    messageOptionsScale.value = withSpring(1, { duration: 400 });
  };

  const closeMessageOptions = () => {
    messageOptionsScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => {
      setMessageOptionsVisible(false);
      setSelectedMessage(null);
    }, 300);
  };

  const handleReply = () => {
    if (selectedMessage) {
      setReplyMessage(selectedMessage);
      closeMessageOptions();
    }
  };

  const handleEdit = () => {
    if (selectedMessage && selectedMessage.isOwn) {
      setEditingMessage(selectedMessage);
      setMessage(selectedMessage.content);
      closeMessageOptions();
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      Alert.alert(
        'Delete Message',
        'Are you sure you want to delete this message?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
              closeMessageOptions();
            },
          },
        ]
      );
    }
  };

  const handleForward = () => {
    if (selectedMessage) {
      setForwardModalVisible(true);
      closeMessageOptions();
    }
  };

  const handleCopy = () => {
    if (selectedMessage) {
      Alert.alert('Copied', 'Message copied to clipboard');
      closeMessageOptions();
    }
  };

  const handleReaction = (emoji: string) => {
    if (selectedMessage) {
      setMessages(prev => prev.map(msg => {
        if (msg.id === selectedMessage.id) {
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            const userId = user?.id || 'me';
            if (existingReaction.users.includes(userId)) {
              // Remove reaction
              existingReaction.users = existingReaction.users.filter(u => u !== userId);
              if (existingReaction.users.length === 0) {
                return { ...msg, reactions: reactions.filter(r => r.emoji !== emoji) };
              }
            } else {
              // Add reaction
              existingReaction.users.push(userId);
            }
          } else {
            // Add new reaction
            reactions.push({ emoji, users: [user?.id || 'me'] });
          }
          
          return { ...msg, reactions };
        }
        return msg;
      }));
      setEmojiPickerVisible(false);
      emojiPickerSlide.value = withSpring(height);
      closeMessageOptions();
    }
  };

  const handleImagePress = (imageUrl: string) => {
    setViewingImage(imageUrl);
    setImageViewerVisible(true);
  };

  const handleCall = (isVideo: boolean = false) => {
    setCallModalVisible(true);
  };

  const handleAttachment = () => {
    setAttachmentModalVisible(true);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    
    // Simulate recording timer
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (isRecording) {
        stopVoiceRecording();
      }
    }, 30000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    
    if (recordingDuration > 1) {
      // Send voice message
      const voiceMessage: ChatMessage = {
        id: Date.now().toString(),
        chatId,
        senderId: user?.id || 'me',
        content: `Voice message (${recordingDuration}s)`,
        type: 'audio',
        timestamp: new Date(),
        status: 'sending',
        isOwn: true,
        user: {
          name: user?.name || 'You',
          avatar: user?.avatar || 'https://ui-avatars.com/api/?name=You&background=4A90E2&color=fff&size=128',
        },
      };
      
      setMessages(prev => [...prev, voiceMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    
    setRecordingDuration(0);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openSearch = () => {
    setSearchModalVisible(true);
    searchModalOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeSearch = () => {
    searchModalOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setSearchModalVisible(false);
      setSearchText('');
      setSearchResults([]);
    }, 300);
  };

  const performSearch = (text: string) => {
    setSearchText(text);
    if (text.trim()) {
      const results = messages.filter(msg =>
        msg.content.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const openEmojiPicker = () => {
    setEmojiPickerVisible(true);
    emojiPickerSlide.value = withSpring(0, { duration: 400 });
  };

  const closeEmojiPicker = () => {
    emojiPickerSlide.value = withSpring(height, { duration: 300 });
    setTimeout(() => setEmojiPickerVisible(false), 300);
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isSelected = selectedMessages.includes(item.id);
    const showAvatar = !item.isOwn && (index === messages.length - 1 || messages[index + 1].isOwn || messages[index + 1].senderId !== item.senderId);
    
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginVertical: 2,
          marginHorizontal: 16,
          justifyContent: item.isOwn ? 'flex-end' : 'flex-start',
          backgroundColor: isSelected ? Colors.primaryLight + '30' : 'transparent',
          borderRadius: 8,
          padding: isSelected ? 4 : 0,
        }}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={200}
        activeOpacity={0.7}
      >
        {!item.isOwn && (
          <View style={{ width: 32, marginRight: 8, alignItems: 'center' }}>
            {showAvatar && (
              <UserAvatar
                uri={item.user.avatar}
                name={item.user.name}
                size={32}
              />
            )}
          </View>
        )}
        
        <View style={{
          maxWidth: '70%',
          alignItems: item.isOwn ? 'flex-end' : 'flex-start',
        }}>
          {/* Reply indicator */}
          {item.replyTo && (
            <View style={{
              backgroundColor: Colors.backgroundTertiary,
              borderRadius: 8,
              padding: 8,
              marginBottom: 4,
              borderLeftWidth: 3,
              borderLeftColor: Colors.primary,
              maxWidth: '100%',
            }}>
              <Text style={{
                fontSize: 12,
                color: Colors.primary,
                fontWeight: '600',
                marginBottom: 2,
              }}>
                {item.replyTo.sender}
              </Text>
              <Text style={{
                fontSize: 12,
                color: Colors.textSecondary,
              }} numberOfLines={1}>
                {item.replyTo.content}
              </Text>
            </View>
          )}
          
          {/* Message bubble */}
          <View style={{
            backgroundColor: item.isOwn ? Colors.messageSent : Colors.messageReceived,
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderBottomRightRadius: item.isOwn ? 4 : 16,
            borderBottomLeftRadius: item.isOwn ? 16 : 4,
            ...Platform.select({
              ios: {
                shadowColor: Colors.shadow,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              },
              android: {
                elevation: 2,
              },
            }),
          }}>
            {/* Forward indicator */}
            {item.isForwarded && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <Ionicons name="arrow-forward" size={12} color={Colors.textMuted} />
                <Text style={{
                  fontSize: 11,
                  color: Colors.textMuted,
                  fontStyle: 'italic',
                  marginLeft: 4,
                }}>
                  Forwarded from {item.forwardedFrom}
                </Text>
              </View>
            )}
            
            {/* Message content */}
            {item.type === 'text' && (
              <Text style={{
                fontSize: 16,
                color: Colors.textPrimary,
                lineHeight: 20,
              }}>
                {item.content}
              </Text>
            )}
            
            {item.type === 'image' && (
              <TouchableOpacity onPress={() => handleImagePress(item.content)}>
                <Image
                  source={{ uri: item.content }}
                  style={{
                    width: 200,
                    height: 150,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            
            {item.type === 'audio' && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                minWidth: 150,
              }}>
                <TouchableOpacity style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                  <Ionicons name="play" size={16} color={Colors.textPrimary} />
                </TouchableOpacity>
                <View style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: Colors.textMuted,
                  borderRadius: 1,
                }} />
                <Text style={{
                  fontSize: 12,
                  color: Colors.textMuted,
                  marginLeft: 8,
                }}>
                  0:15
                </Text>
              </View>
            )}
            
            {/* Message info */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 4,
            }}>
              {item.isEdited && (
                <Text style={{
                  fontSize: 11,
                  color: Colors.textMuted,
                  marginRight: 4,
                  fontStyle: 'italic',
                }}>
                  edited
                </Text>
              )}
              
              <Text style={{
                fontSize: 11,
                color: item.isOwn ? Colors.textSecondary : Colors.textMuted,
                marginRight: item.isOwn ? 4 : 0,
              }}>
                {formatTime(item.timestamp)}
              </Text>
              
              {item.isOwn && (
                <Ionicons
                  name={
                    item.status === 'read' ? 'checkmark-done' :
                    item.status === 'delivered' ? 'checkmark-done' :
                    item.status === 'sent' ? 'checkmark' : 'time'
                  }
                  size={12}
                  color={
                    item.status === 'read' ? Colors.success :
                    item.status === 'delivered' ? Colors.textSecondary :
                    Colors.textMuted
                  }
                />
              )}
            </View>
          </View>
          
          {/* Reactions */}
          {item.reactions && item.reactions.length > 0 && (
            <View style={{
              flexDirection: 'row',
              marginTop: 4,
              alignItems: 'center',
            }}>
              {item.reactions.map((reaction, index) => (
                <TouchableOpacity
                  key={`${reaction.emoji}-${index}`}
                  style={{
                    backgroundColor: Colors.backgroundSecondary,
                    borderRadius: 12,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    marginRight: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => handleReaction(reaction.emoji)}
                >
                  <Text style={{ fontSize: 12 }}>{reaction.emoji}</Text>
                  {reaction.users.length > 1 && (
                    <Text style={{
                      fontSize: 10,
                      color: Colors.textMuted,
                      marginLeft: 2,
                    }}>
                      {reaction.users.length}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={GlobalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <Animated.View style={[headerAnimatedStyle, ChatStyles.headerContainer]}>
        <TouchableOpacity 
          style={ChatStyles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            marginLeft: 16,
          }}
          onPress={() => setProfileModalVisible(true)}
        >
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: chatInfo.avatar }}
              style={ChatStyles.headerAvatar}
            />
            {chatInfo.isOnline && (
              <View style={ChatStyles.onlineStatus} />
            )}
          </View>
          
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={ChatStyles.headerTitle}>
              {chatInfo.name}
            </Text>
            <Text style={{
              fontSize: 12,
              color: Colors.textSecondary,
            }}>
              {isTyping ? 'typing...' : chatInfo.lastSeen}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={ChatStyles.headerButton}
          onPress={openSearch}
        >
          <Ionicons name="search" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={ChatStyles.headerButton}
          onPress={() => handleCall(false)}
        >
          <Ionicons name="call" size={22} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={ChatStyles.headerButton}
          onPress={() => handleCall(true)}
        >
          <Ionicons name="videocam" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Reply Box */}
      <Animated.View style={[replyBoxAnimatedStyle, {
        backgroundColor: Colors.backgroundSecondary,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        overflow: 'hidden',
      }]}>
        {replyMessage && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}>
            <View style={{
              width: 3,
              height: 40,
              backgroundColor: Colors.primary,
              marginRight: 12,
              borderRadius: 2,
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.primary,
                marginBottom: 2,
              }}>
                Replying to {replyMessage.user.name}
              </Text>
              <Text style={{
                fontSize: 12,
                color: Colors.textSecondary,
              }} numberOfLines={1}>
                {replyMessage.content}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyMessage(null)}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8 }}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      {/* Message Input */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
      }}>
        <TouchableOpacity 
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
          onPress={handleAttachment}
        >
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{
          flex: 1,
          backgroundColor: Colors.backgroundSecondary,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginRight: 12,
          maxHeight: 100,
          minHeight: 40,
          justifyContent: 'center',
        }}>
          <TextInput
            style={{
              fontSize: 16,
              color: Colors.textPrimary,
              maxHeight: 80,
              textAlignVertical: 'center',
            }}
            placeholder={editingMessage ? "Edit message..." : "Type a message..."}
            placeholderTextColor={Colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
        </View>

        {isRecording ? (
          <Animated.View style={[recordingAnimatedStyle, {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.error,
            justifyContent: 'center',
            alignItems: 'center',
          }]}>
            <TouchableOpacity onPress={stopVoiceRecording}>
              <Ionicons name="stop" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: message.trim() ? Colors.primary : Colors.backgroundSecondary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={message.trim() ? sendMessage : startVoiceRecording}
            onLongPress={!message.trim() ? startVoiceRecording : undefined}
          >
            <Ionicons
              name={message.trim() ? "send" : "mic"}
              size={20}
              color={message.trim() ? Colors.textPrimary : Colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Recording Indicator */}
      {isRecording && (
        <View style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          backgroundColor: Colors.error,
          paddingVertical: 8,
          alignItems: 'center',
        }}>
          <Text style={{
            color: Colors.textPrimary,
            fontSize: 14,
            fontWeight: '600',
          }}>
            Recording... {formatDuration(recordingDuration)}
          </Text>
        </View>
      )}

      {/* Message Options Modal */}
      <Modal
        transparent
        visible={messageOptionsVisible}
        onRequestClose={closeMessageOptions}
        animationType="none"
      >
        <Pressable 
          style={GlobalStyles.modalBackdrop}
          onPress={closeMessageOptions}
        >
          <Animated.View style={[messageOptionsAnimatedStyle, {
            backgroundColor: Colors.modalBackground,
            borderRadius: 16,
            padding: 16,
            margin: 20,
            maxWidth: 280,
          }]}>
            {selectedMessage && (
              <>
                <View style={{
                  alignItems: 'center',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.textPrimary,
                  }}>
                    Message Options
                  </Text>
                </View>

                {/* Quick Reactions */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                }}>
                  {availableEmojis.slice(0, 6).map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: Colors.backgroundTertiary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 4,
                      }}
                      onPress={() => handleReaction(emoji)}
                    >
                      <Text style={{ fontSize: 20 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={handleReply}
                  >
                    <Ionicons name="arrow-undo" size={20} color={Colors.primary} />
                    <Text style={GlobalStyles.listItemTitle}>Reply</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={handleForward}
                  >
                    <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
                    <Text style={GlobalStyles.listItemTitle}>Forward</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={handleCopy}
                  >
                    <Ionicons name="copy" size={20} color={Colors.primary} />
                    <Text style={GlobalStyles.listItemTitle}>Copy</Text>
                  </TouchableOpacity>
                  
                  {selectedMessage.isOwn && (
                    <TouchableOpacity
                      style={GlobalStyles.listItem}
                      onPress={handleEdit}
                    >
                      <Ionicons name="pencil" size={20} color={Colors.primary} />
                      <Text style={GlobalStyles.listItemTitle}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={handleDelete}
                  >
                    <Ionicons name="trash" size={20} color={Colors.error} />
                    <Text style={[GlobalStyles.listItemTitle, { color: Colors.error }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Search Modal */}
      <Modal
        transparent
        visible={searchModalVisible}
        onRequestClose={closeSearch}
        animationType="none"
      >
        <Pressable 
          style={GlobalStyles.modalBackdrop}
          onPress={closeSearch}
        >
          <Animated.View style={[searchModalAnimatedStyle, {
            backgroundColor: Colors.modalBackground,
            margin: 20,
            borderRadius: 16,
            padding: 20,
            maxHeight: height * 0.7,
          }]}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Ionicons name="search" size={24} color={Colors.primary} />
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors.textPrimary,
                marginLeft: 12,
                flex: 1,
              }}>
                Search Messages
              </Text>
              <TouchableOpacity onPress={closeSearch}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[GlobalStyles.input, {
                backgroundColor: Colors.inputBackground,
                borderColor: Colors.border,
                marginBottom: 16,
              }]}
              placeholder="Search in chat..."
              placeholderTextColor={Colors.textMuted}
              value={searchText}
              onChangeText={performSearch}
              autoFocus
            />
            
            <ScrollView style={{ maxHeight: 300 }}>
              {searchResults.length > 0 ? (
                searchResults.map((msg, index) => (
                  <TouchableOpacity
                    key={msg.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: Colors.background,
                      borderRadius: 12,
                      marginBottom: 8,
                    }}
                    onPress={() => {
                      // In a real app, scroll to message
                      closeSearch();
                    }}
                  >
                    <UserAvatar
                      uri={msg.user.avatar}
                      name={msg.user.name}
                      size={36}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: Colors.textPrimary,
                        marginBottom: 2,
                      }}>
                        {msg.user.name}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: Colors.textSecondary,
                      }} numberOfLines={2}>
                        {msg.content}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: Colors.textMuted,
                    }}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : searchText ? (
                <View style={GlobalStyles.emptyContainer}>
                  <Ionicons name="search" size={48} color={Colors.textMuted} />
                  <Text style={GlobalStyles.emptyDescription}>
                    No messages found for "{searchText}"
                  </Text>
                </View>
              ) : (
                <View style={GlobalStyles.emptyContainer}>
                  <Text style={GlobalStyles.emptyDescription}>
                    Start typing to search messages
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        transparent
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
        animationType="slide"
      >
        <View style={GlobalStyles.modalBackdrop}>
          <View style={[GlobalStyles.bottomSheet, { paddingTop: 40 }]}>
            <View style={GlobalStyles.bottomSheetHandle} />
            
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <Image
                source={{ uri: chatInfo.avatar }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginBottom: 16,
                  borderWidth: 3,
                  borderColor: Colors.primary,
                }}
              />
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: Colors.textPrimary,
                marginBottom: 4,
              }}>
                {chatInfo.name}
              </Text>
              <Text style={{
                fontSize: 16,
                color: Colors.textSecondary,
              }}>
                {chatInfo.lastSeen}
              </Text>
            </View>
            
            <View style={{ gap: 16 }}>
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  setProfileModalVisible(false);
                  // Navigate to contact profile
                }}
              >
                <Ionicons name="person" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>View Profile</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  setProfileModalVisible(false);
                  Alert.alert('Block', `Block ${chatInfo.name}?`);
                }}
              >
                <Ionicons name="ban" size={24} color={Colors.error} />
                <Text style={[GlobalStyles.listItemTitle, { color: Colors.error }]}>
                  Block Contact
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  setProfileModalVisible(false);
                  Alert.alert('Report', `Report ${chatInfo.name}?`);
                }}
              >
                <Ionicons name="flag" size={24} color={Colors.warning} />
                <Text style={[GlobalStyles.listItemTitle, { color: Colors.warning }]}>
                  Report Contact
                </Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Attachment Modal */}
      <Modal
        transparent
        visible={attachmentModalVisible}
        onRequestClose={() => setAttachmentModalVisible(false)}
        animationType="slide"
      >
        <Pressable 
          style={GlobalStyles.modalBackdrop}
          onPress={() => setAttachmentModalVisible(false)}
        >
          <View style={[GlobalStyles.bottomSheet, { paddingTop: 20 }]}>
            <View style={GlobalStyles.bottomSheetHandle} />
            
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: Colors.textPrimary,
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Send Attachment
            </Text>
            
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
            }}>
              {[
                { icon: 'camera', label: 'Camera', color: Colors.primary },
                { icon: 'images', label: 'Gallery', color: Colors.success },
                { icon: 'document', label: 'Document', color: Colors.warning },
                { icon: 'musical-notes', label: 'Audio', color: Colors.error },
                { icon: 'location', label: 'Location', color: Colors.info },
                { icon: 'person', label: 'Contact', color: Colors.secondary },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    alignItems: 'center',
                    width: '30%',
                    paddingVertical: 16,
                  }}
                  onPress={() => {
                    setAttachmentModalVisible(false);
                    Alert.alert('Feature', `${item.label} attachment selected`);
                  }}
                >
                  <View style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: item.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <Ionicons name={item.icon as any} size={24} color={Colors.textPrimary} />
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: Colors.textSecondary,
                    textAlign: 'center',
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        transparent
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        animationType="fade"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setImageViewerVisible(false)}
        >
          <View style={{
            position: 'absolute',
            top: 60,
            right: 20,
            zIndex: 1,
          }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setImageViewerVisible(false)}
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <Image
            source={{ uri: viewingImage }}
            style={{
              width: width - 40,
              height: height * 0.7,
              borderRadius: 12,
            }}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>

      {/* Call Modal */}
      <Modal
        transparent
        visible={callModalVisible}
        onRequestClose={() => setCallModalVisible(false)}
        animationType="slide"
      >
        <View style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{ alignItems: 'center', marginBottom: 60 }}>
            <Image
              source={{ uri: chatInfo.avatar }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                marginBottom: 20,
              }}
            />
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: Colors.textPrimary,
              marginBottom: 8,
            }}>
              {chatInfo.name}
            </Text>
            <Text style={{
              fontSize: 18,
              color: Colors.textSecondary,
            }}>
              Calling...
            </Text>
          </View>
          
          <View style={{
            flexDirection: 'row',
            gap: 40,
          }}>
            <TouchableOpacity
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: Colors.error,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setCallModalVisible(false)}
            >
              <Ionicons name="call" size={30} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: Colors.success,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                setCallModalVisible(false);
                Alert.alert('Call Started', 'Call feature would start here');
              }}
            >
              <Ionicons name="call" size={30} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
