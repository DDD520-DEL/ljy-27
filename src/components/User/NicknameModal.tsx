import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

export const NicknameModal: React.FC = () => {
  const { isNicknameModalOpen, closeNicknameModal, createUser, getAvatarOptions } = useUserStore();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [error, setError] = useState('');

  const avatarOptions = getAvatarOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setError('请输入昵称');
      return;
    }

    if (trimmedNickname.length > 12) {
      setError('昵称不能超过 12 个字符');
      return;
    }

    createUser(trimmedNickname, selectedAvatar || undefined);
    setNickname('');
    setSelectedAvatar(null);
    setError('');
  };

  const handleRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
    setSelectedAvatar(avatarOptions[randomIndex]);
  };

  if (!isNicknameModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeNicknameModal}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up transition-colors duration-300">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">欢迎来到遛弯歇脚地图</h2>
          <p className="text-emerald-100 text-sm mt-1">先设置个昵称，开始你的探索之旅吧</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择头像
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 ring-2 ring-emerald-500 dark:ring-emerald-400 scale-110'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleRandomAvatar}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
            >
              🎲 随机选一个
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              昵称
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (error) setError('');
                }}
                placeholder="给自己起个好听的名字..."
                maxLength={12}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border outline-none transition-all text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 ${
                  error
                    ? 'border-red-300 dark:border-red-500 focus:border-red-500 dark:focus:border-red-400 focus:bg-white dark:focus:bg-gray-700'
                    : 'border-transparent focus:border-emerald-300 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700'
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
            )}
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 text-right">
              {nickname.length}/12
            </p>
          </div>

          <button
            type="submit"
            disabled={!nickname.trim()}
            className="w-full py-3 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-medium hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed shadow-md"
          >
            开始探索
          </button>
        </form>
      </div>
    </div>
  );
};
