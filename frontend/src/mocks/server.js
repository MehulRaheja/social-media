import { setupServer } from 'msw/node';
import { authHandlers } from '@mocks/handlers/auth';
import { notificationHandlers } from '@mocks/handlers/notification';
import { userHandlers } from '@mocks/handlers/user';

export const server = setupServer(...authHandlers, ...notificationHandlers, ...userHandlers);
