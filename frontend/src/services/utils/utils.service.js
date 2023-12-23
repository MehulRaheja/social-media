import { floor, random, some } from 'lodash';
import { avatarColors } from '@services/utils/static.data';
import { addUser, clearUser } from '@redux/reducers/user/user.reducer';
import { addNotification, clearNotification } from '@redux/reducers/notifications/notification.reducer';

export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  static generateAvatar(text, backgroundColor, forgroundColor = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text on the canvas
    context.font = 'normal 80px sans-serif';
    context.fillStyle = forgroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png'); // toDataURL: to convert canvas into base64 string
  }

  static dispatchUser(result, pageReload, dispatch, setUser) {
    pageReload(true); // coming from session storage
    dispatch(addUser({ token: result.data.token, profile: result.data.user })); // adding to redux
    setUser(result.data.user); // setting user to local state
  }

  static clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn }) {
    dispatch(clearUser());
    dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }

  static dispatchNotification(message, type, dispatch) {
    dispatch(addNotification({ message, type }));
  }

  static dispatchClearNotification(dispatch) {
    dispatch(clearNotification());
  }

  static appEnvironment() {
    const env = process.env.REACT_APP_ENVIRONMENT;
    if (env === 'development') {
      return 'DEV';
    } else if (env === 'staging') {
      return 'STG';
    }
  }

  static mapSettingsDropdownItems(setSettings) {
    const items = [];
    const item = {
      topText: 'My Profile',
      subText: 'View personal profile'
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  static appImageUrl(version, id) {
    if (typeof version === 'string' && typeof id === 'string') {
      version = version.replace(/['"]+/g, '');
      id = id.replace(/['"]+/g, '');
    }
    return `https://res.cloudinary.com/dlft3yfad/image/upload/v${version}/${id}`;
  }

  static generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static checkIfUserIsBlocked(blocked, userId) {
    return some(blocked, (id) => id === userId);
  }

  static checkIfUserIsFollowed(userFollowers, postCreatorId, userId) {
    return some(userFollowers, (user) => user === postCreatorId || postCreatorId === userId);
  }
}
