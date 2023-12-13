import ProtectedRoute from '@pages/ProtectedRoute';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import Error from '@pages/error/Error';
import Social from '@pages/social/Social';
import Chat from '@pages/social/chat/Chat';
import Followers from '@pages/social/followers/Followers';
import Following from '@pages/social/following/Following';
import Notifications from '@pages/social/notifications/Notifications';
import People from '@pages/social/people/People';
import Photos from '@pages/social/photos/Photos';
import Profile from '@pages/social/profile/Profile';
import Streams from '@pages/social/streams/Streams';
import { useRoutes } from 'react-router-dom';

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <AuthTabs />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social',
      // ProtectRoute will protect child routes as well
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'streams',
          element: <Streams />
        },
        {
          path: 'chat/messages',
          element: <Chat />
        },
        {
          path: 'people',
          element: <People />
        },
        {
          path: 'followers',
          element: <Followers />
        },
        {
          path: 'following',
          element: <Following />
        },
        {
          path: 'photos',
          element: <Photos />
        },
        {
          path: 'notifications',
          element: <Notifications />
        },
        {
          path: 'profile/:username',
          element: <Profile />
        }
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ]);

  return elements;
};
