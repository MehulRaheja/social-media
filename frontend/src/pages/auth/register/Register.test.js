// import { server } from '@mocks/server';
import Register from '@pages/auth/register/Register';
import { render, screen, waitFor } from '@root/test.utils';
import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.service';
import userEvent from '@testing-library/user-event';

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

    it('should be enabled with input values', async () => {
      jest.spyOn(Utils, 'generateAvatar').mockReturnValue('avatar image');
      jest.spyOn(authService, 'signUp').mockReturnValue({});
      render(<Register />);
      const buttonElement = screen.getByRole('button');
      const usernameLabel = screen.getByLabelText('Username');
      const emailLabel = screen.getByLabelText('Email');
      const passwordLabel = screen.getByLabelText('Password');

      userEvent.type(usernameLabel, 'manny');
      userEvent.type(emailLabel, 'manny@test.com');
      userEvent.type(passwordLabel, 'qwerty');

      // console.log(prettyDOM(buttonElement));

      // to click the button
      userEvent.click(buttonElement);

      // for asynchronous events we can use waitFor function so that we can wait for the asynchronous events to complete
      await waitFor(() => {
        const newButtonElement = screen.getByRole('button');
        // console.log(prettyDOM(newButtonElement));
        expect(newButtonElement.textContent).toEqual('SIGNUP IN PROGRESS...');
      });
    });
  });
});
