import { Routes, Route } from 'react-router-dom';

import { PageProvider } from '../../rtk';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import Layout from '../Layout';
import ListArticle from '../ListArticle';
import Article from '../Article';
import EditProfile from '../EditProfile';
import NotFoundPage from '../NotFoundPage';
import CreateArticle from '../CreateArticle';
import EditArticle from '../EditArticle';
import PrivateRoute from '../PrivateRoute';

import './App.module.scss';

function App() {
  return (
    <PageProvider>
      <div className="App">
        <Routes>
          <Route path={'/'} element={<Layout />}>
            <Route index element={<ListArticle />} />
            <Route path={'articles'} element={<ListArticle />} />

            <Route element={<PrivateRoute />}>
              <Route path="new-article" element={<CreateArticle />} />
            </Route>
            <Route path={'articles/:slug'} element={<Article />} />
            <Route element={<PrivateRoute />}>
              <Route path="/articles/:slug/edit" element={<EditArticle />} />
            </Route>
            <Route path={'sign-in'} element={<SignIn />} />
            <Route path={'sign-up'} element={<SignUp />} />
            <Route element={<PrivateRoute />}>
              <Route path={'profile'} element={<EditProfile />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </PageProvider>
  );
}

export default App;
