import { Provider } from '@nestjs/common';
import Expo from 'expo-server-sdk';
import { EXPO_SDK } from '../provide';

export const ExpoProvider: Provider = {
  provide: EXPO_SDK,
  useFactory: () => {
    return new Expo();
  },
};
