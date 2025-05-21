import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getCookie } from './check';

export const blogAPI = createApi({
  reducerPath: 'blogAPI',
  tagTypes: ['Articles', 'Article', 'User'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers) => {
      const token = getCookie('token');
      if (!token) return headers;
      return headers.set('Authorization', `Token ${token}`);
    },
  }),
  endpoints: (build) => ({
    getArticles: build.query({
      query: (page) => `/articles?offset=${page * 20}`,
      providesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),

    getArticle: build.query({
      query: (slug) => `/articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),

    addArticle: build.mutation({
      query: (body) => ({
        url: '/articles',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }),
      invalidatesTags: ['Article', 'Articles'],
    }),

    updateArticle: build.mutation({
      query: ({ article, slug }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { article },
      }),
      invalidatesTags: ['Article', 'Articles'],
    }),

    favoriteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Article'],
    }),

    unfavoriteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Article'],
    }),

    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Article', 'Articles'],
    }),

    getUser: build.query({
      query: () => '/user',
      providesTags: ['User'],
    }),

    addUser: build.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }),
      invalidatesTags: ['User'],
    }),

    loginUser: build.mutation({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: build.mutation({
      query: (body) => ({
        url: '/user',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetUserQuery,
  useAddUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} = blogAPI;
