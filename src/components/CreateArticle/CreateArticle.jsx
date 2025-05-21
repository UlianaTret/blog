import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Spin } from 'antd';

import { useAddArticleMutation, useUpdateArticleMutation } from '../../rtk';

import style from './CreateArticle.module.scss';

const CreateArticle = ({ article, slug }) => {
  const [addArticle, { isLoading: isLoadingAdd, isError: isErrorAdd, isSuccess: isSuccessAdd }] =
    useAddArticleMutation();
  const [updateArticle, { isLoading: isLoadingUpdate, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] =
    useUpdateArticleMutation(slug);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      text: '',
      tags: ['programming', ''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description,
        text: article.body,
        tags: article.tagList || ['programming', ''],
      });
    }
  }, [article, reset]);

  const onSubmit = async (data) => {
    const articleData = {
      article: {
        title: data.title,
        description: data.description,
        body: data.text,
        tagList: data.tags.filter((tag) => tag.trim() !== ''),
      },
    };

    try {
      if (slug) {
        await updateArticle({ article: articleData.article, slug }).unwrap();
      } else {
        await addArticle(articleData).unwrap();
      }
    } catch (e) {
      setError(
        e.status === 422
          ? `Failed to ${slug ? 'update' : 'create'} article, try again later.`
          : 'The server was unable to process the data, please try again later.'
      );
    }
  };

  if (isLoadingAdd || isLoadingUpdate) {
    const tip = slug ? 'updating' : 'creating';
    const contentStyle = {
      padding: 50,
      background: 'rgba(0, 0, 0, 0.05)',
      borderRadius: 4,
    };
    return (
      <Spin tip={`Please wait, ${tip} article...`}>
        <div style={contentStyle} />
      </Spin>
    );
  }

  return (
    <div className={style.create}>
      <h1>{slug ? 'Edit article' : 'Create new article'}</h1>
      <form
        action="src/components/CreateArticle/CreateArticle"
        method="post"
        className={style.form}
        onSubmit={handleSubmit(onSubmit)}
        id={'create-article'}
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            {...register('title', {
              required: 'Title is required.',
            })}
          />
          {errors.title && <p className={style.error}>{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description">Short description</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Short description"
            {...register('description', {
              required: 'Description is required.',
            })}
          />
          {errors.description && <p className={style.error}>{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="text">Text</label>
          <textarea
            form={'create-article'}
            spellCheck={true}
            name="text"
            id="text"
            placeholder="Text"
            className={style.text}
            {...register('text', {
              required: 'Text is required.',
            })}
          />
          {errors.text && <p className={style.error}>{errors.text.message}</p>}
        </div>

        <div className={style.tags}>
          <label htmlFor="tags">Tags</label>
          {fields.map((field, index) => (
            <div key={field.id} className={style.tag}>
              <input type="text" name={`tags[${index}]`} placeholder="Tag" {...register(`tags.${index}`)} />
              <button
                className={style.delete}
                disabled={fields.length <= 1}
                type="button"
                onClick={() => remove(index)}
              >
                Delete
              </button>
              <button className={style.add} type="button" onClick={() => append('')}>
                Add tag
              </button>
            </div>
          ))}
        </div>

        <input className={style.send} id="quantity" type="submit" value="Send" />
      </form>

      {!isErrorAdd || <p className={style.error}>{error}</p>}
      {!isSuccessAdd || (
        <p className={style.success}>
          The article has been published, after verification it will appear on the website.
        </p>
      )}
      {!isErrorUpdate || <p className={style.error}>{error}</p>}
      {!isSuccessUpdate || (
        <p className={style.success}>The article has been updated, after verification it will appear on the website.</p>
      )}
    </div>
  );
};

export default CreateArticle;
