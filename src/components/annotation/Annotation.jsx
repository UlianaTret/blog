import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Popconfirm, message } from 'antd';

import { isLogin, useDeleteArticleMutation, useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../rtk';

import style from './Annotation.module.scss';

function formatDate(strDate) {
  const date = new Date(strDate);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleString('en-US', options);
}

const Annotation = ({ data: article, userCRUD = false }) => {
  const isDisable = isLogin('token');
  const { title, author, tagList, description, favoritesCount, favorited, createdAt, slug } = article[0]; //.data[0];
  const [favCount, setFavCount] = useState(favoritesCount);
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [deleteArticle, { isError }] = useDeleteArticleMutation(slug);
  const [favoriteArticle] = useFavoriteArticleMutation(slug);
  const [unfavoriteArticle] = useUnfavoriteArticleMutation(slug);
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  let tags = null;
  if (tagList) {
    tags = tagList.map((item, i) => (
      <p className={style.tag} key={i}>
        {item}
      </p>
    ));
  }

  const setLike = async (e) => {
    e.preventDefault();
    try {
      if (isFavorited) {
        await unfavoriteArticle(slug).unwrap();
        setFavCount(favCount - 1);
        setIsFavorited(false);
      } else {
        await favoriteArticle(slug).unwrap();
        setFavCount(favCount + 1);
        setIsFavorited(true);
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'The server was unable to process the data, please try again later.',
      });
    }
  };

  const confirm = async () => {
    try {
      await deleteArticle(slug).unwrap();
      if (!isError) {
        messageApi.open({
          type: 'success',
          content: 'Article deleted successfully.',
        });
        navigate('/');
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Failed to delete article. Please try again later.',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className={style.annotation}>
        <div className={style.header}>
          <div>
            <div>
              <p className={style.title}>
                <Link to={`/articles/${slug}`}>{title}</Link>
              </p>
              <button
                className={`${isFavorited ? style.fav : style.likes}`}
                disabled={!isDisable}
                onClick={(e) => setLike(e)}
              >
                {favCount}
              </button>
            </div>
            <div className={style.tags}>{tags}</div>
          </div>

          <div>
            <div className={style.owner}>
              <div>
                <p className={style.name}>{author.username}</p>
                <p className={style.date}>{formatDate(createdAt)}</p>
              </div>
              <img className={style.avatar} src={author.image} alt={'user avatar'} />
            </div>

            {userCRUD && (
              <div>
                <Popconfirm
                  description="Are you sure to delete this article?"
                  onConfirm={confirm}
                  okText="Yes"
                  cancelText="No"
                  placement={'right'}
                  className={style.delete}
                >
                  <Button danger>Delete</Button>
                </Popconfirm>
                <Link to={`/articles/${slug}/edit`} className={style.edit}>
                  Edit
                </Link>
              </div>
            )}
          </div>
        </div>

        <p className={style.article}>{description}</p>
      </div>
    </>
  );
};

export default Annotation;
