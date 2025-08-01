export const SCREEN_NAMES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  CHAT: 'Chat',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
} as const;

export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const STORAGE_KEYS = {
  USER_ID: '@chatlift_user_id',
  USER_DATA: '@chatlift_user_data',
  AUTH_TOKEN: '@chatlift_auth_token',
} as const;
