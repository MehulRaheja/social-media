import { setupServer } from 'msw/node';
import { authHandlers } from '@mocks/handlers/auth';
import { notificationHandlers } from '@mocks/handlers/notification';
import { userHandlers } from '@mocks/handlers/user';

// Setup requests interception using the given handlers
// setupServer takes a list of api functions
export const server = setupServer(...authHandlers, ...notificationHandlers, ...userHandlers);
