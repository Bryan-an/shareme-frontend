import { IGoogleUserInfo } from '@/types/google';

export const fetchUser = (): IGoogleUserInfo | undefined => {
  const userInfo = localStorage.getItem('user');

  if (userInfo) {
    return JSON.parse(userInfo);
  } else {
    localStorage.clear();
  }
};
