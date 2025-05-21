import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateUserMutation, useGetUserQuery } from '../../rtk';

import style from './EditProfile.module.scss';

const EditProfile = () => {
  const [editUser, { isLoading: isLoadingEdit, isError: isErrorEdit, isSuccess }] = useUpdateUserMutation();
  const { data, isError, isLoading, refetch } = useGetUserQuery();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      reset({
        name: data.user.username || '',
        email: data.user.email || '',
        password: '',
        avatar: '',
      });
    }
  }, [data, reset]);

  const onSubmit = async (data) => {
    const user = {
      user: {
        username: data.name,
        email: data.email,
        password: data.password,
        bio: data.bio ? data.bio : '',
        image: data.avatar,
      },
    };

    try {
      await editUser(user).unwrap();
      refetch();
    } catch (e) {
      setError(e.status === 422 ? 'You entered data incorrectly.' : 'Failed to update user data, try again later.');
    }
  };

  return (
    <div className={style.sign}>
      <h1>Edit Profile</h1>
      <form className={style.signInForm} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Username"
            {...register('name', {
              required: 'Name is required.',
            })}
          />
          {errors.name && <p className={style.error}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email address"
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address.',
              },
            })}
          />
          {errors.email && <p className={style.error}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">New password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your password must be no more than 40 characters long.',
              },
            })}
          />
          {errors.password && <p className={style.error}>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="avatar">Avatar image (url)</label>
          <input
            type="text"
            name="avatar"
            id="avatar"
            placeholder="Avatar image"
            {...register('avatar', {
              pattern: {
                value: /^(https?:\/\/)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+(\.(jpg|jpeg|png|gif|webp))$/,
                message: 'URL is not correct.',
              },
            })}
          />
          {errors.avatar && <p className={style.error}>{errors.avatar.message}</p>}
        </div>
        <input className={style.send} id="quantity" type="submit" value="Save" />
        {isErrorEdit && <p className={style.error}>{error}</p>}
        {isLoadingEdit && <p className={style.loading}>Please wait, updating user data.</p>}
        {isError && <p className={style.error}>Failed to load user data, try again later.</p>}
        {isLoading && <p className={style.loading}>Please wait, loading user data.</p>}
        {isSuccess && <p className={style.success}>Data updated successfully.</p>}
      </form>
    </div>
  );
};

export default EditProfile;
