import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin } from 'antd';
import Markdown from 'markdown-to-jsx';

import { useGetArticleQuery, useGetUserQuery } from '../../rtk';
import Annotation from '../annotation';

import style from './Article.module.scss';

const Article = () => {
  const { slug } = useParams();
  const { data, isError, isLoading } = useGetArticleQuery(slug);
  const { data: userData } = useGetUserQuery();
  const [userCRUD, setUserCRUD] = useState(false);

  useEffect(() => {
    if (data && userData) setUserCRUD(userData.user.username === data.article.author.username);
  }, [data, userData]);

  if (isError) return <p className={style.article + ' ' + style.message}>Failed to load article... Try again later.</p>;
  if (isLoading)
    return (
      <div className={style.message}>
        <Spin />
      </div>
    );

  if (!data.article)
    return <p className={style.article + ' ' + style.message}>Failed to load article... Try again later.</p>;

  return (
    <div className={style.article}>
      <Annotation data={[data.article]} userCRUD={userCRUD} />
      <p>{userCRUD}</p>
      <Markdown options={{ wrapper: 'article', forceWrapper: true }} className={style.articleText}>
        {data.article.body}
      </Markdown>
    </div>
  );
};

export default Article;
