import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useLoginUserMutation, isLogin } from '../../rtk';

import style from './SignIn.module.scss';

function SignIn() {
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin('token')) navigate('/');
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    const user = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    try {
      const data = await loginUser(user).unwrap();
      if (data) {
        const token = data.user.token;
        document.cookie = `token=${token};secure;path=/`;
        navigate('/');
      }
    } catch (e) {
      setError(e.status === 422 ? 'Incorrect login or password.' : 'Failed to sign in user, try again later.');
    }
  };

  return (
    <div className={style.sign}>
      <h1>Sign In</h1>
      <form action="src/components/SignIn/SignIn" method="get" onSubmit={handleSubmit(onSubmit)}>
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required.',
            })}
          />
          {errors.password && <p className={style.error}>{errors.password.message}</p>}
        </div>
        <input className={style.send} id="quantity" type="submit" value="Login" />
      </form>
      {!isError || <p className={style.error}>{error}</p>}
      {!isLoading || <p className={style.loading}>Please wait...</p>}
      <p className={style.info}>
        Don’t have an account? <Link to={'/sign-up'}>Sign Up</Link>.
      </p>
    </div>
  );
}

export default SignIn;
