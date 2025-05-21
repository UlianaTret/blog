import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import { useGetArticleQuery, useGetUserQuery } from '../../rtk';
import CreateArticle from '../CreateArticle';

import style from './EditArticle.module.scss';

const EditArticle = () => {
  const { slug } = useParams();
  const { data, isError, isLoading } = useGetArticleQuery(slug);
  const { data: userData, isError: isUserError, isLoading: isUserLoading } = useGetUserQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData || userData.user.username !== data.article.author.username) {
      navigate(`/articles/${slug}`);
    }
  }, [userData]);

  if (isLoading || isUserLoading)
    return (
      <div className={style.spin}>
        <Spin />
      </div>
    );
  if (isError || isUserError) return <p className={style.error}>Failed to load article... Try again later.</p>;
  return <CreateArticle article={data.article} slug={slug} />;
};

export default EditArticle;
