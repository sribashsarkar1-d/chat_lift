import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const ChatStyles = StyleSheet.create({
  // CONTAINER STYLES
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // HEADER STYLES
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  // AVATAR & STATUS STYLES
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.online,
    borderWidth: 3,
    borderColor: Colors.background,
  },

  // CHAT ITEM / MESSAGE BUBBLE STYLES
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  chatItemActive: {
    backgroundColor: Colors.chatItemActive,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  chatItemPinned: {
    backgroundColor: Colors.backgroundSecondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  chatItemPressed: {
    backgroundColor: Colors.chatItemHover,
  },

  // PIN INDICATOR
  pinnedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinnedIcon: {
    color: Colors.textPrimary,
    fontSize: 10,
  },

  // CHAT CONTENT
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  chatNameUnread: {
    fontWeight: '700',
  },

  // MUTE INDICATOR
  muteIcon: {
    marginLeft: 8,
    color: Colors.textMuted,
  },

  // MESSAGE PREVIEW
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  chatMessageUnread: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  chatMessageTyping: {
    color: Colors.typing,
    fontStyle: 'italic',
  },

  // TIME STAMP
  chatTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chatTimeUnread: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // UNREAD BADGE
  unreadBadge: {
    backgroundColor: Colors.unreadBadge,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },

  // MESSAGE BUBBLE STYLES
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: '70%',
    marginVertical: 2,
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
  },
  messageBubbleSent: {
    backgroundColor: Colors.messageSent,
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: Colors.messageReceived,
    borderBottomLeftRadius: 4,
  },

  // MESSAGE TEXT
  messageText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  messageStatus: {
    fontSize: 12,
  },

  // REACTION STYLES
  reactionContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  reaction: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionText: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    color: Colors.textMuted,
    marginLeft: 2,
  },

  // INPUT AREA STYLES
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    minHeight: 40,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    color: Colors.textPrimary,
    maxHeight: 80,
    textAlignVertical: 'center',
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
  sendButtonInactive: {
    backgroundColor: Colors.backgroundSecondary,
  },

  // REPLY BOX STYLES
  replyBox: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  replyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  replyIndicator: {
    width: 3,
    height: 40,
    backgroundColor: Colors.primary,
    marginRight: 12,
    borderRadius: 2,
  },
  replyInfo: {
    flex: 1,
  },
  replyName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  replyMessage: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // RECORDING INDICATOR
  recordingIndicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: Colors.error,
    paddingVertical: 8,
    alignItems: 'center',
  },
  recordingText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
