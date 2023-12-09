import { signupMockError } from '@mocks/handlers/auth';
import { server } from '@mocks/server';
import Register from '@pages/auth/register/Register';
import { render, screen, waitFor } from '@root/test.utils';
import { Utils } from '@services/utils/utils.service';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

// mock useNavigate hook
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate
}));

// top level describe is the name of the component
describe('Register', () => {
  it('signup form should have its labels', () => {
    render(<Register />); // to render the register component
    // getByLabelText will look for Username for single case, if there are more than one Username label then it will throw an error
    const usernameLabel = screen.getByLabelText('Username');
    const emailLabel = screen.getByLabelText('Email');
    const passwordLabel = screen.getByLabelText('Password');

    expect(usernameLabel).toBeInTheDocumentation();
    expect(emailLabel).toBeInTheDocumentation();
    expect(passwordLabel).toBeInTheDocumentation();
  });

  describe('Button', () => {
    it('should be disabled', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button'); // getByRole('button'): will only work if have only one button
      expect(buttonElement).toBeDisabled();
    });

    it('should be enabled with input values', () => {
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'manny');
      userEvent.type(emailLabel, 'manny@test.com');
      userEvent.type(passwordLabel, 'qwerty');

      expect(buttonElement).toBeEnabled();
    });

    it('should change label when clicked', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'manny');
      userEvent.type(emailLabel, 'manny@test.com');
      userEvent.type(passwordLabel, 'qwerty');

      // to click the button, we used await act() because we want to see changes on the button itself
      await act(() => {
        userEvent.click(buttonElement); // this is an async operation
      });

      // for asynchronous events we can use waitFor function so that we can wait for the asynchronous events to complete
      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        // console.log(prettyDOM(newButtonElement));
        expect(newButtonElement.textContent).toEqual('SIGNUP IN PROGRESS...');
      });
    });
  });

  describe('Success', () => {
    it('should navigate to streams page', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'manny');
      userEvent.type(emailLabel, 'manny@test.com');
      userEvent.type(passwordLabel, 'qwerty');

      userEvent.click(buttonElement);

      await waitFor(() => expect(mockedUseNavigate).toHaveBeenCalledWith('/app/social/streams'));
    });
  });

  describe('Error', () => {
    it('should display error alert and border', async () => {
      server.use(signupMockError);
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameElement = screen.getByLabelText('Username');
      const emailElement = screen.getByLabelText('Email');
      const passwordElement = screen.getByLabelText('Password');

      userEvent.type(usernameElement, 'manny');
      userEvent.type(emailElement, 'manny@test.com');
      userEvent.type(passwordElement, 'qwerty');
      userEvent.click(buttonElement);

      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toEqual('Invalid credentials');

      await waitFor(() => expect(usernameElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(emailElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
      await waitFor(() => expect(passwordElement).toHaveStyle({ border: '1px solid #fa9b8a' }));
    });
  });
});
