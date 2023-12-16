import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/routes';
import '@root/App.scss';
import { useEffect } from 'react';
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import { useSelector } from 'react-redux';

const App = () => {
  const { notifications } = useSelector((state) => state);

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      {notifications?.length ? <Toast position="top-right" toastList={notifications} autoDelete={true} /> : null}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};
export default App;

// to create static paths we require jsconfig.paths.json file as our code is in javascript so, we can't do it straight away. Instead we will
// do it using webpack and we can not directly access webpack, for that we will install two libraries i.e. react-app-rewired and
// react-app-alias
// we get all the configurations inside jsconfig.paths.json

// react-app-rewired: Tweak the create-react-app webpack config(s) without using 'eject' and without creating a fork of the
// react-scripts. All the benefits of create-react-app without the limitations of "no config". You can add plugins,
// loaders whatever you need.

// react-app-alias: This will allow us to set some alias.

// CRA uses @testing-library/jest-dom, @testing-library/react and @testing-library/user-event for testing and CRA already did the basic setup.
// msw(mock service worker) library is used to mock the backend apis
// jest configuration are added in package.json instead of a separate file
