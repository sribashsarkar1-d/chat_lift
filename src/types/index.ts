// Export message types first since chat depends on them
export * from './message';
export * from './user';
export * from './chat';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Chat: { chatId: string };
  Profile: { userId?: string };
  Settings: undefined;
};
