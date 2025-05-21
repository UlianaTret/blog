import React from 'react';
import { Link } from 'react-router-dom';

import style from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className={style.container}>
      <img src={'https://static.thenounproject.com/png/1469633-200.png'} alt={'robot could not find the page'} />
      <div>
        <h1>404. Page not found</h1>
        <p>It may have been moved, or you may have simply misspelled the page address.</p>
        <Link to={'/'}>Go to home page</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
