import { floor, random } from 'lodash';
import { avatarColors } from '@services/utils/static.data';
import { addUser, clearUser } from '@redux/reducers/user/user.reducer';

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
    // dispatch clear notification action
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }
}
