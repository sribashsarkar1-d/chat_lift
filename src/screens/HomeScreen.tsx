import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Modal, 
  TextInput, 
  Alert,
  Dimensions,
  Pressable,
  FlatList,
  Share,
  Linking
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { RootState } from '@/store';
import { GlobalStyles } from '@/styles/globalStyles';
import { Colors } from '@/styles/colors';
import { SCREEN_NAMES } from '@/utils/constants';
import { RootStackParamList } from '@/types';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
}

interface StatusItem {
  id: string;
  name: string;
  avatar: string;
  isAddButton: boolean;
  hasStory?: boolean;
  statusText?: string;
  timestamp?: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [searchText, setSearchText] = useState('');
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const chatItemsOpacity = useSharedValue(0);

  // Modal states
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [chatOptionsModalVisible, setChatOptionsModalVisible] = useState(false);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  const [settingsQuickModalVisible, setSettingsQuickModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [newStatusText, setNewStatusText] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Animation values for modals
  const searchModalOpacity = useSharedValue(0);
  const statusModalScale = useSharedValue(0);
  const profileModalTranslateY = useSharedValue(height);
  const chatOptionsScale = useSharedValue(0);
  const addContactModalScale = useSharedValue(0);
  const settingsQuickModalOpacity = useSharedValue(0);

  // Mock data with more features
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: '1',
      name: 'Al Linderson',
      avatar: 'https://ui-avatars.com/api/?name=Alex+Linderson&background=FFB74D&color=fff&size=128',
      lastMessage: 'How are you today?',
      time: '2 min ago',
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
    },
    {
      id: '2',
      name: 'Team Align',
      avatar: 'https://ui-avatars.com/api/?name=Team+Align&background=EC407A&color=fff&size=128',
      lastMessage: "Don't miss to attend the meeting.",
      time: '5 min ago',
      unreadCount: 0,
      isOnline: false,
      isMuted: true,
    },
    {
      id: '3',
      name: 'John Abraham',
      avatar: 'https://ui-avatars.com/api/?name=John+Abraham&background=42A5F5&color=fff&size=128',
      lastMessage: 'Can you join the meeting?',
      time: '10 min ago',
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
    },
    {
      id: '4',
      name: 'Sabila Sayma',
      avatar: 'https://ui-avatars.com/api/?name=Sabila+Sayma&background=AB47BC&color=fff&size=128',
      lastMessage: 'How are you today?',
      time: '1 hour ago',
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: '5',
      name: 'John Borino',
      avatar: 'https://ui-avatars.com/api/?name=John+Borino&background=66BB6A&color=fff&size=128',
      lastMessage: 'Have a good day 🌸',
      time: '2 hours ago',
      unreadCount: 0,
      isOnline: true,
    },
  ]);

  const [statusItems, setStatusItems] = useState<StatusItem[]>([
    {
      id: 'my-status',
      name: 'My status',
      avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Me&background=4A90E2&color=fff&size=128',
      isAddButton: true,
      hasStory: false,
    },
    {
      id: 'alex',
      name: 'Alex',
      avatar: 'https://ui-avatars.com/api/?name=Alex&background=FFB74D&color=fff&size=128',
      isAddButton: false,
      hasStory: true,
      statusText: 'Working from home today!',
      timestamp: '2 min ago',
    },
    {
      id: 'marina',
      name: 'Marina',
      avatar: 'https://ui-avatars.com/api/?name=Marina&background=EC407A&color=fff&size=128',
      isAddButton: false,
      hasStory: true,
      statusText: 'Coffee time ☕',
      timestamp: '1 hour ago',
    },
    {
      id: 'dean',
      name: 'Dean',
      avatar: 'https://ui-avatars.com/api/?name=Dean&background=42A5F5&color=fff&size=128',
      isAddButton: false,
      hasStory: false,
    },
    {
      id: 'max',
      name: 'Max',
      avatar: 'https://ui-avatars.com/api/?name=Max&background=AB47BC&color=fff&size=128',
      isAddButton: false,
      hasStory: true,
      statusText: 'At the gym 💪',
      timestamp: '3 hours ago',
    },
  ]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const chatItemsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: chatItemsOpacity.value,
  }));

  const searchModalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchModalOpacity.value,
  }));

  const statusModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statusModalScale.value }],
  }));

  const profileModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: profileModalTranslateY.value }],
  }));

  const chatOptionsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chatOptionsScale.value }],
  }));

  const addContactModalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: addContactModalScale.value }],
  }));

  const settingsQuickModalAnimatedStyle = useAnimatedStyle(() => ({
    opacity: settingsQuickModalOpacity.value,
  }));

  useEffect(() => {
    headerOpacity.value = withSpring(1, { duration: 800 });
    chatItemsOpacity.value = withDelay(200, withSpring(1, { duration: 600 }));
    setFilteredChats(chats);
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchText.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchText, chats]);

  // Modal animation handlers
  const openSearchModal = () => {
    setSearchModalVisible(true);
    searchModalOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeSearchModal = () => {
    searchModalOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => {
      setSearchModalVisible(false);
      setSearchText('');
    }, 300);
  };

  const openStatusModal = () => {
    setStatusModalVisible(true);
    statusModalScale.value = withSpring(1, { duration: 500 });
  };

  const closeStatusModal = () => {
    statusModalScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => {
      setStatusModalVisible(false);
      setNewStatusText('');
    }, 300);
  };

  const openProfileModal = () => {
    setProfileModalVisible(true);
    profileModalTranslateY.value = withSpring(0, { duration: 500 });
  };

  const closeProfileModal = () => {
    profileModalTranslateY.value = withSpring(height, { duration: 400 });
    setTimeout(() => setProfileModalVisible(false), 400);
  };

  const openChatOptions = (chat: ChatItem) => {
    setSelectedChat(chat);
    setChatOptionsModalVisible(true);
    chatOptionsScale.value = withSpring(1, { duration: 400 });
  };

  const closeChatOptions = () => {
    chatOptionsScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => {
      setChatOptionsModalVisible(false);
      setSelectedChat(null);
    }, 300);
  };

  const openAddContactModal = () => {
    setAddContactModalVisible(true);
    addContactModalScale.value = withSpring(1, { duration: 400 });
  };

  const closeAddContactModal = () => {
    addContactModalScale.value = withSpring(0, { duration: 300 });
    setTimeout(() => {
      setAddContactModalVisible(false);
      setNewContactName('');
      setNewContactPhone('');
    }, 300);
  };

  const openSettingsQuickModal = () => {
    setSettingsQuickModalVisible(true);
    settingsQuickModalOpacity.value = withTiming(1, { duration: 300 });
  };

  const closeSettingsQuickModal = () => {
    settingsQuickModalOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => setSettingsQuickModalVisible(false), 300);
  };

  // Action handlers
  const handleChatPress = (chatId: string) => {
    navigation.navigate(SCREEN_NAMES.CHAT, { chatId });
  };

  const handleChatLongPress = (chat: ChatItem) => {
    openChatOptions(chat);
  };

  const handleSettingsPress = () => {
    navigation.navigate(SCREEN_NAMES.SETTINGS);
  };

  const handleStatusSubmit = () => {
    if (newStatusText.trim()) {
      const newStatus = {
        id: 'my-status',
        name: 'My status',
        avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Me&background=4A90E2&color=fff&size=128',
        isAddButton: true,
        hasStory: true,
        statusText: newStatusText.trim(),
        timestamp: 'now',
      };
      
      setStatusItems(prev => prev.map(item => 
        item.id === 'my-status' ? newStatus : item
      ));
      
      Alert.alert('Status Updated', `Your status: "${newStatusText}" has been updated!`);
      closeStatusModal();
    }
  };

  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      Alert.alert(
        'Contact Added', 
        `${newContactName} (${newContactPhone}) has been added to your contacts!`
      );
      closeAddContactModal();
    } else {
      Alert.alert('Error', 'Please fill in both name and phone number');
    }
  };

  const handleMuteChat = (chat: ChatItem) => {
    setChats(prev => prev.map(item => 
      item.id === chat.id ? { ...item, isMuted: !item.isMuted } : item
    ));
    Alert.alert(
      chat.isMuted ? 'Unmuted' : 'Muted', 
      `${chat.name} has been ${chat.isMuted ? 'unmuted' : 'muted'}`
    );
    closeChatOptions();
  };

  const handlePinChat = (chat: ChatItem) => {
    setChats(prev => prev.map(item => 
      item.id === chat.id ? { ...item, isPinned: !item.isPinned } : item
    ));
    Alert.alert(
      chat.isPinned ? 'Unpinned' : 'Pinned', 
      `${chat.name} has been ${chat.isPinned ? 'unpinned' : 'pinned'}`
    );
    closeChatOptions();
  };

  const handleDeleteChat = (chat: ChatItem) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete your chat with ${chat.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(item => item.id !== chat.id));
            closeChatOptions();
          },
        },
      ]
    );
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${user?.name || 'my'} profile on ChatLift!`,
      });
      closeProfileModal();
    } catch (error) {
      Alert.alert('Error', 'Unable to share profile');
    }
  };

  const handleCall = (chat: ChatItem) => {
    Alert.alert(
      'Call',
      `Do you want to call ${chat.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, you would initiate a call here
            Alert.alert('Calling', `Calling ${chat.name}...`);
            closeChatOptions();
          },
        },
      ]
    );
  };

  const renderChatItem = (item: ChatItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: item.isPinned ? Colors.backgroundSecondary : Colors.background,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border,
        borderLeftWidth: item.isPinned ? 3 : 0,
        borderLeftColor: Colors.primary,
      }}
      onPress={() => handleChatPress(item.id)}
      onLongPress={() => handleChatLongPress(item)}
    >
      {/* Avatar with online status */}
      <View style={{ position: 'relative', marginRight: 16 }}>
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
          }}
        />
        {item.isOnline && (
          <View style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: Colors.online,
            borderWidth: 3,
            borderColor: Colors.background,
          }} />
        )}
        {item.isPinned && (
          <View style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Ionicons name="pin" size={10} color={Colors.textPrimary} />
          </View>
        )}
      </View>

      {/* Chat content */}
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: item.unreadCount > 0 ? '700' : '600',
              color: Colors.textPrimary,
              marginRight: 8,
            }}>
              {item.name}
            </Text>
            {item.isMuted && (
              <Ionicons name="volume-mute" size={16} color={Colors.textMuted} />
            )}
          </View>
          <Text style={{
            fontSize: 12,
            color: Colors.textMuted,
            fontWeight: item.unreadCount > 0 ? '600' : '400',
          }}>
            {item.time}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text
            style={{
              fontSize: 14,
              color: item.isTyping ? Colors.typing : 
                    item.unreadCount > 0 ? Colors.textPrimary : Colors.textSecondary,
              fontStyle: item.isTyping ? 'italic' : 'normal',
              fontWeight: item.unreadCount > 0 ? '500' : '400',
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.isTyping ? 'typing...' : item.lastMessage}
          </Text>

          {item.unreadCount > 0 && (
            <View style={{
              backgroundColor: Colors.unreadBadge,
              borderRadius: 12,
              minWidth: 24,
              height: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
            }}>
              <Text style={{
                color: Colors.textPrimary,
                fontSize: 12,
                fontWeight: 'bold',
              }}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatusItem = (item: StatusItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={{
        alignItems: 'center',
        marginRight: 20,
        marginLeft: index === 0 ? 20 : 0,
      }}
      onPress={item.isAddButton ? openStatusModal : undefined}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: item.hasStory ? 3 : (item.isAddButton ? 0 : 2),
            borderColor: item.hasStory ? Colors.success : 
                        item.isAddButton ? 'transparent' : Colors.border,
          }}
        />
        {item.isAddButton && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: Colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: Colors.background,
          }}>
            <Ionicons name="add" size={14} color={Colors.textPrimary} />
          </View>
        )}
      </View>
      <Text style={{
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
        fontWeight: item.hasStory ? '600' : '400',
      }}>
        {item.name}
      </Text>
      {item.hasStory && item.timestamp && (
        <Text style={{
          color: Colors.textMuted,
          fontSize: 10,
          textAlign: 'center',
        }}>
          {item.timestamp}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <Animated.View style={[headerAnimatedStyle, {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight || 44,
        paddingBottom: 16,
        backgroundColor: Colors.background,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border,
      }]}>
        <TouchableOpacity 
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={openSearchModal}
        >
          <Ionicons name="search" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: Colors.textPrimary,
          letterSpacing: 0.5,
        }}>
          Home
        </Text>
        
        <TouchableOpacity onPress={openProfileModal}>
          <Image 
            source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff&size=128' }} 
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 20,
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Status Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ 
          maxHeight: 120,
          backgroundColor: Colors.backgroundSecondary,
        }}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingRight: 20,
        }}
      >
        {statusItems.map((item, index) => renderStatusItem(item, index))}
      </ScrollView>

      {/* Chat List */}
      <Animated.View style={[chatItemsAnimatedStyle, { flex: 1 }]}>
        <FlatList
          data={filteredChats}
          renderItem={({ item, index }) => renderChatItem(item, index)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={{
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: Colors.backgroundElevated,
        borderTopWidth: 0.5,
        borderTopColor: Colors.border,
        paddingBottom: 34,
      }}>
        <TouchableOpacity style={{ 
          flex: 1, 
          alignItems: 'center',
          paddingVertical: 8,
        }}>
          <Ionicons name="chatbubble" size={26} color={Colors.tabBarActive} />
          <Text style={{ 
            color: Colors.tabBarActive, 
            fontSize: 11, 
            marginTop: 4,
            fontWeight: '600',
          }}>
            Message
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ 
          flex: 1, 
          alignItems: 'center',
          paddingVertical: 8,
        }}>
          <Ionicons name="call" size={26} color={Colors.tabBarInactive} />
          <Text style={{ 
            color: Colors.tabBarInactive, 
            fontSize: 11, 
            marginTop: 4,
            fontWeight: '500',
          }}>
            Calls
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            alignItems: 'center',
            paddingVertical: 8,
          }}
          onPress={openAddContactModal}
        >
          <Ionicons name="people" size={26} color={Colors.tabBarInactive} />
          <Text style={{ 
            color: Colors.tabBarInactive, 
            fontSize: 11, 
            marginTop: 4,
            fontWeight: '500',
          }}>
            Contacts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            alignItems: 'center',
            paddingVertical: 8,
          }}
          onPress={openSettingsQuickModal}
        >
          <Ionicons name="settings" size={26} color={Colors.tabBarInactive} />
          <Text style={{ 
            color: Colors.tabBarInactive, 
            fontSize: 11, 
            marginTop: 4,
            fontWeight: '500',
          }}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        transparent
        visible={searchModalVisible}
        onRequestClose={closeSearchModal}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'flex-start',
            paddingTop: (StatusBar.currentHeight || 44) + 60,
          }}
          onPress={closeSearchModal}
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
              }}>
                Search Chats
              </Text>
              <TouchableOpacity 
                onPress={closeSearchModal}
                style={{ marginLeft: 'auto' }}
              >
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[GlobalStyles.input, {
                backgroundColor: Colors.inputBackground,
                borderColor: Colors.border,
                marginBottom: 16,
              }]}
              placeholder="Search for messages, people..."
              placeholderTextColor={Colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
            
            <ScrollView style={{ maxHeight: 300 }}>
              {filteredChats.length > 0 ? (
                filteredChats.map((chat, index) => (
                  <TouchableOpacity
                    key={chat.id}
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
                      closeSearchModal();
                      handleChatPress(chat.id);
                    }}
                  >
                    <Image
                      source={{ uri: chat.avatar }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 12,
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.textPrimary,
                        marginBottom: 2,
                      }}>
                        {chat.name}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: Colors.textSecondary,
                      }} numberOfLines={1}>
                        {chat.lastMessage}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                  <Ionicons name="search" size={48} color={Colors.textMuted} />
                  <Text style={{
                    fontSize: 16,
                    color: Colors.textMuted,
                    marginTop: 16,
                    textAlign: 'center',
                  }}>
                    {searchText ? 'No results found' : 'Start typing to search...'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Status Modal */}
      <Modal
        transparent
        visible={statusModalVisible}
        onRequestClose={closeStatusModal}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={closeStatusModal}
        >
          <Animated.View style={[statusModalAnimatedStyle, GlobalStyles.modal, {
            width: '100%',
            maxWidth: 350,
          }]}>
            <View style={GlobalStyles.modalHeader}>
              <Text style={GlobalStyles.modalTitle}>Add Status</Text>
              <TouchableOpacity onPress={closeStatusModal}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Ionicons name="add" size={40} color={Colors.textPrimary} />
              </View>
              <Text style={{
                fontSize: 16,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                Share what's on your mind with your contacts
              </Text>
            </View>
            
            <TextInput
              style={[GlobalStyles.input, GlobalStyles.inputMultiline, {
                backgroundColor: Colors.inputBackground,
                borderColor: Colors.border,
                marginBottom: 20,
                minHeight: 100,
              }]}
              placeholder="What's on your mind?"
              placeholderTextColor={Colors.textMuted}
              value={newStatusText}
              onChangeText={setNewStatusText}
              multiline
              maxLength={150}
            />
            
            <View style={GlobalStyles.modalActions}>
              <TouchableOpacity
                style={[GlobalStyles.secondaryButton, GlobalStyles.smallButton]}
                onPress={closeStatusModal}
              >
                <Text style={GlobalStyles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[GlobalStyles.button, GlobalStyles.smallButton]}
                onPress={handleStatusSubmit}
              >
                <Text style={GlobalStyles.buttonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        transparent
        visible={profileModalVisible}
        onRequestClose={closeProfileModal}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'flex-end',
          }}
          onPress={closeProfileModal}
        >
          <Animated.View style={[profileModalAnimatedStyle, GlobalStyles.bottomSheet]}>
            <View style={GlobalStyles.bottomSheetHandle} />
            
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Image
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff&size=128' }}
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
                {user?.name || 'User Name'}
              </Text>
              <Text style={{
                fontSize: 16,
                color: Colors.textSecondary,
              }}>
                {user?.email || 'user@example.com'}
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
            
            <View style={{ gap: 16 }}>
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  closeProfileModal();
                  navigation.navigate(SCREEN_NAMES.PROFILE, { userId: user?.id });
                }}
              >
                <Ionicons name="person" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>View Profile</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={handleShareProfile}
              >
                <Ionicons name="share" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>Share Profile</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  closeProfileModal();
                  handleSettingsPress();
                }}
              >
                <Ionicons name="settings" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>Settings</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Chat Options Modal */}
      <Modal
        transparent
        visible={chatOptionsModalVisible}
        onRequestClose={closeChatOptions}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={closeChatOptions}
        >
          <Animated.View style={[chatOptionsAnimatedStyle, GlobalStyles.modal, {
            width: '100%',
            maxWidth: 300,
          }]}>
            {selectedChat && (
              <>
                <View style={{
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <Image
                    source={{ uri: selectedChat.avatar }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginBottom: 12,
                    }}
                  />
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: Colors.textPrimary,
                  }}>
                    {selectedChat.name}
                  </Text>
                </View>
                
                <View style={{ gap: 12 }}>
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={() => {
                      closeChatOptions();
                      handleChatPress(selectedChat.id);
                    }}
                  >
                    <Ionicons name="chatbubble" size={20} color={Colors.primary} />
                    <Text style={GlobalStyles.listItemTitle}>Open Chat</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={() => handleCall(selectedChat)}
                  >
                    <Ionicons name="call" size={20} color={Colors.primary} />
                    <Text style={GlobalStyles.listItemTitle}>Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={() => handlePinChat(selectedChat)}
                  >
                    <Ionicons 
                      name={selectedChat.isPinned ? "pin" : "pin-outline"} 
                      size={20} 
                      color={Colors.primary} 
                    />
                    <Text style={GlobalStyles.listItemTitle}>
                      {selectedChat.isPinned ? 'Unpin' : 'Pin'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={() => handleMuteChat(selectedChat)}
                  >
                    <Ionicons 
                      name={selectedChat.isMuted ? "volume-high" : "volume-mute"} 
                      size={20} 
                      color={Colors.warning} 
                    />
                    <Text style={[GlobalStyles.listItemTitle, { color: Colors.warning }]}>
                      {selectedChat.isMuted ? 'Unmute' : 'Mute'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={GlobalStyles.listItem}
                    onPress={() => handleDeleteChat(selectedChat)}
                  >
                    <Ionicons name="trash" size={20} color={Colors.error} />
                    <Text style={[GlobalStyles.listItemTitle, { color: Colors.error }]}>
                      Delete Chat
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        transparent
        visible={addContactModalVisible}
        onRequestClose={closeAddContactModal}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          onPress={closeAddContactModal}
        >
          <Animated.View style={[addContactModalAnimatedStyle, GlobalStyles.modal, {
            width: '100%',
            maxWidth: 350,
          }]}>
            <View style={GlobalStyles.modalHeader}>
              <Text style={GlobalStyles.modalTitle}>Add Contact</Text>
              <TouchableOpacity onPress={closeAddContactModal}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={{
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}>
                <Ionicons name="person-add" size={40} color={Colors.textPrimary} />
              </View>
              <Text style={{
                fontSize: 16,
                color: Colors.textSecondary,
                textAlign: 'center',
              }}>
                Add a new contact to start chatting
              </Text>
            </View>
            
            <TextInput
              style={[GlobalStyles.input, {
                backgroundColor: Colors.inputBackground,
                borderColor: Colors.border,
              }]}
              placeholder="Contact Name"
              placeholderTextColor={Colors.textMuted}
              value={newContactName}
              onChangeText={setNewContactName}
            />
            
            <TextInput
              style={[GlobalStyles.input, {
                backgroundColor: Colors.inputBackground,
                borderColor: Colors.border,
              }]}
              placeholder="Phone Number"
              placeholderTextColor={Colors.textMuted}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />
            
            <View style={GlobalStyles.modalActions}>
              <TouchableOpacity
                style={[GlobalStyles.secondaryButton, GlobalStyles.smallButton]}
                onPress={closeAddContactModal}
              >
                <Text style={GlobalStyles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[GlobalStyles.button, GlobalStyles.smallButton]}
                onPress={handleAddContact}
              >
                <Text style={GlobalStyles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Settings Quick Modal */}
      <Modal
        transparent
        visible={settingsQuickModalVisible}
        onRequestClose={closeSettingsQuickModal}
        animationType="none"
      >
        <Pressable 
          style={{
            flex: 1,
            backgroundColor: Colors.modalBackdrop,
            justifyContent: 'flex-end',
            paddingBottom: 100,
            paddingHorizontal: 20,
          }}
          onPress={closeSettingsQuickModal}
        >
          <Animated.View style={[settingsQuickModalAnimatedStyle, {
            backgroundColor: Colors.modalBackground,
            borderRadius: 16,
            padding: 20,
          }]}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: Colors.textPrimary,
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Quick Settings
            </Text>
            
            <View style={{ gap: 16 }}>
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  closeSettingsQuickModal();
                  handleSettingsPress();
                }}
              >
                <Ionicons name="settings" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>All Settings</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  Alert.alert('Dark Mode', 'Dark mode is already enabled');
                  closeSettingsQuickModal();
                }}
              >
                <Ionicons name="moon" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>Dark Mode</Text>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: Colors.success,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="checkmark" size={14} color={Colors.textPrimary} />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={GlobalStyles.listItem}
                onPress={() => {
                  Alert.alert('Notifications', 'Notifications are enabled');
                  closeSettingsQuickModal();
                }}
              >
                <Ionicons name="notifications" size={24} color={Colors.primary} />
                <Text style={GlobalStyles.listItemTitle}>Notifications</Text>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: Colors.success,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="checkmark" size={14} color={Colors.textPrimary} />
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default HomeScreen;
