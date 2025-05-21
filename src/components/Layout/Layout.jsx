import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { getCookie, deleteCookie, useGetUserQuery } from '../../rtk';

import style from './Layout.module.scss';

const Layout = () => {
  const { data, refetch } = useGetUserQuery();

  const [token, setToken] = useState(getCookie('token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getCookie('token');
      if (currentToken !== token) {
        setToken(currentToken);
        if (currentToken) refetch();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token, refetch, data]);

  return (
    <>
      <header className={style.header}>
        <nav>
          <ul className={style.list}>
            <li>
              <NavLink to={'/'} className={style.logo}>
                Realworld Blog
              </NavLink>
            </li>
          </ul>
          {!token ? (
            <ul className={style.list}>
              <li>
                <NavLink to={'/sign-in'} className={style.signin}>
                  Sign In
                </NavLink>
              </li>
              <li>
                <NavLink to={'/sign-up'} className={style.signup}>
                  Sign Up
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className={style.list}>
              <li>
                <NavLink to={'/new-article'} className={style.create}>
                  Create article
                </NavLink>
              </li>
              <li>
                <NavLink to={'/profile'} className={style.userlogo}>
                  <p className={style.name}>{data ? data.user.username : ''}</p>
                  <img
                    className={style.avatar}
                    src={
                      data && data.user.image
                        ? data.user.image
                        : 'https://cdn-icons-png.flaticon.com/512/8105/8105547.png'
                    }
                    alt={'user avatar'}
                  />
                </NavLink>
              </li>
              <li>
                <button
                  className={style.exit}
                  onClick={() => {
                    deleteCookie('token');
                    setToken('');
                  }}
                >
                  Log Out
                </button>
              </li>
            </ul>
          )}
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Layout;
