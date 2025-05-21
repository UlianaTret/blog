import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { isLogin, useAddUserMutation } from '../../rtk';

import style from './SignUp.module.scss';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  });

  const [signUp, { isLoading, isError }] = useAddUserMutation();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin('token')) navigate('/');
  }, [navigate]);

  const onSubmit = async (data) => {
    const user = {
      user: {
        username: data.name,
        email: data.email,
        password: data.password,
      },
    };

    try {
      const data = await signUp(user).unwrap();
      if (data) {
        const token = data.user.token;
        document.cookie = `token=${token};secure;path=/`;
        navigate('/');
      }
    } catch (e) {
      setError(e.status === 422 ? 'You entered data incorrectly.' : 'Failed to register user, try again later.');
    }
  };

  return (
    <div className={style.sign}>
      <h1>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Username"
            {...register('name', {
              required: 'Username is required.',
              minLength: {
                value: 3,
                message: 'Your name needs to be at least 3 characters.',
              },
              maxLength: {
                value: 20,
                message: 'Your password must be no more than 20 characters long.',
              },
              pattern: {
                value: /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/,
                message: 'Invalid user name.',
              },
            })}
          />
          {errors.name && <p className={style.error}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="Email">Email address</label>
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
          <label htmlFor="password">Password</label>
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
          <label htmlFor="confirm-password">Repeat Password</label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="Password"
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) => value === watch('password') || 'Passwords must match',
            })}
          />
          {errors.confirmPassword && <p className={style.error}>{errors.confirmPassword.message}</p>}
        </div>
        <fieldset>
          <input type="checkbox" id="agree" name="agree" {...register('agree', { required: true })} />
          <label htmlFor="agree">I agree to the processing of my personal information</label>
        </fieldset>
        {errors.agree && <p className={style.error}>Please agree to the processing of personal data.</p>}
        <input className={style.send} id="quantity" type="submit" value="Create" />
      </form>
      {!isError || <p className={style.error}>{error}</p>}
      {!isLoading || <p className={style.loading}>Please wait...</p>}
      <p className={style.info}>
        Already have an account? <Link to={'/sign-in'}>Sign In</Link>.
      </p>
    </div>
  );
};

export default SignUp;
