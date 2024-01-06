import CardSkeleton from '@components/card-element/CardSkeleton';
import ProtectedRoute from '@pages/ProtectedRoute';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import Error from '@pages/error/Error';
import NotificationSkeleton from '@pages/social/notifications/NotificationSkeleton';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notifications = lazy(() => import('@pages/social/notifications/Notification'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));

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
          element: (
            // till the component is not rendered.
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          )
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
