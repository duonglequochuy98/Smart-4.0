
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  LANDING = 'LANDING',
  TRACKING = 'TRACKING',
  SUBMIT = 'SUBMIT',
  BOOKING = 'BOOKING',
  LOGIN = 'LOGIN',
  CHAT = 'CHAT',
  REPORT = 'REPORT',
  NOTIFICATIONS = 'NOTIFICATIONS'
}
