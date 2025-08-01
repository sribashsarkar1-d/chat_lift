import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
  // CONTAINER STYLES
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },

  // TYPOGRAPHY STYLES
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subHeader: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  bodyText: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  captionText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 8,
  },

  // INPUT STYLES
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    fontSize: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },

  // BUTTON STYLES
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonPressed: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.98 }],
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonPressed: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.1,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 16,
    minWidth: 80,
    width: 'auto',
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 0,
  },

  // MODAL STYLES
  modal: {
    backgroundColor: Colors.modalBackground,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.modalBackdrop,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  bottomSheet: {
    backgroundColor: Colors.modalBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.textMuted,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  // LIST STYLES
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 2,
  },
  listItemPressed: {
    backgroundColor: Colors.chatItemHover,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // BADGE STYLES
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSmall: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
  badgeSuccess: {
    backgroundColor: Colors.success,
  },
  badgeWarning: {
    backgroundColor: Colors.warning,
  },
  badgeError: {
    backgroundColor: Colors.error,
  },

  // AVATAR STYLES
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarBorder: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  // SEPARATOR STYLES
  separator: {
    height: 0.5,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  separatorFull: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  separatorThick: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },

  // UTILITY STYLES
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  absolute: { position: 'absolute' },
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  selfCenter: { alignSelf: 'center' },
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },

  // SPACING UTILITIES
  marginTop8: { marginTop: 8 },
  marginTop16: { marginTop: 16 },
  marginTop24: { marginTop: 24 },
  marginBottom8: { marginBottom: 8 },
  marginBottom16: { marginBottom: 16 },
  marginBottom24: { marginBottom: 24 },
  marginHorizontal16: { marginHorizontal: 16 },
  marginHorizontal20: { marginHorizontal: 20 },
  paddingHorizontal16: { paddingHorizontal: 16 },
  paddingHorizontal20: { paddingHorizontal: 20 },
  paddingVertical8: { paddingVertical: 8 },
  paddingVertical16: { paddingVertical: 16 },

  // LAYOUT STYLES
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  column: { flexDirection: 'column' },
  flex1: { flex: 1 },
  flexGrow: { flexGrow: 1 },

  // CARD STYLES
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardContent: { flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
});

// Helper function to combine styles
export const combineStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles);
};

// Common style combinations
export const CommonStyles = {
  screenContainer: [GlobalStyles.container, GlobalStyles.paddingHorizontal20],
  modalContainer: [GlobalStyles.modal, GlobalStyles.centered],
  cardWithShadow: [GlobalStyles.card],
  buttonPrimary: [GlobalStyles.button],
  buttonSecondary: [GlobalStyles.button, GlobalStyles.secondaryButton],
  inputDefault: [GlobalStyles.input],
  headerText: [GlobalStyles.header],
  bodyText: [GlobalStyles.bodyText],
};
