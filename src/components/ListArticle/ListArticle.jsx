import React, { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';

import Annotation from '../annotation';
import { useGetArticlesQuery } from '../../rtk';

import style from './ListArticle.module.scss';
import './PaginationStyle.css';

const ListArticle = () => {
  const [page, setPage] = useState(() => {
    const savedPage = sessionStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });

  const { data = {}, isError, isLoading } = useGetArticlesQuery(page);

  useEffect(() => {
    sessionStorage.setItem('currentPage', page.toString());
  }, [page]);

  if (isError) return <p className={style.message}>Something went wrong... Try again later.</p>;

  if (isLoading)
    return (
      <div className={style.list}>
        <Spin />
      </div>
    );

  let content = null;
  if (data.articles) {
    content = data.articles.map((article, i) => <Annotation data={[article]} userCRUD={false} key={i} />);
  } else return <p className={style.message}>Articles not found... Try again later.</p>;

  return (
    <div className={style.list}>
      {content}
      <Pagination
        current={page}
        onChange={(page) => setPage(page)}
        total={Math.floor(data.articlesCount / 10) * 10}
        defaultPageSize={20}
        showSizeChanger={false}
      />
    </div>
  );
};

export default ListArticle;
