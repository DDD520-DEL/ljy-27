import { create } from 'zustand';
import type { UserProfile } from '../types/user';
import { loadUser, saveUser, clearUser } from '../utils/storage';
import { generateId } from '../utils/score';

const AVATAR_OPTIONS = [
  '🦊',
  '🐼',
  '🦁',
  '🐨',
  '🐸',
  '🦉',
  '🐱',
  '🐶',
  '🐰',
  '🐻',
  '🦄',
  '🐯',
];

interface UserState {
  user: UserProfile | null;
  isNicknameModalOpen: boolean;

  initUser: () => void;
  setUser: (user: UserProfile) => void;
  updateNickname: (nickname: string) => void;
  updateAvatar: (avatar: string) => void;
  resetUser: () => void;
  openNicknameModal: () => void;
  closeNicknameModal: () => void;
  createUser: (nickname: string, avatar?: string) => void;
  getAvatarOptions: () => string[];
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isNicknameModalOpen: false,

  initUser: () => {
    const user = loadUser();
    set({ user });
    if (!user) {
      set({ isNicknameModalOpen: true });
    }
  },

  setUser: (user) => {
    set({ user });
    saveUser(user);
  },

  updateNickname: (nickname) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, nickname };
      set({ user: updatedUser });
      saveUser(updatedUser);
    }
  },

  updateAvatar: (avatar) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, avatar };
      set({ user: updatedUser });
      saveUser(updatedUser);
    }
  },

  resetUser: () => {
    set({ user: null });
    clearUser();
  },

  openNicknameModal: () => {
    set({ isNicknameModalOpen: true });
  },

  closeNicknameModal: () => {
    set({ isNicknameModalOpen: false });
  },

  createUser: (nickname, avatar) => {
    const randomAvatar = avatar || AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
    const newUser: UserProfile = {
      id: generateId(),
      nickname,
      avatar: randomAvatar,
      createdAt: new Date().toISOString(),
    };
    set({ user: newUser, isNicknameModalOpen: false });
    saveUser(newUser);
  },

  getAvatarOptions: () => AVATAR_OPTIONS,
}));
