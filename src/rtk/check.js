/* eslint-disable no-undef */
export const getCookie = (name) => {
  let cookie = document.cookie.split(';').find((row) => row.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;secure;path=/;max-age=-1;`;
};

export const isLogin = (name) => {
  return !!getCookie(name);
};
