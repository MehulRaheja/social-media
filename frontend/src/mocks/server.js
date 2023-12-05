import { setupServer } from 'msw/node';
import { authHandlers } from '@mocks/handlers/auth';

// Setup requests interception using the given handlers
// setupServer takes a list of api functions
export const server = setupServer(...authHandlers);
