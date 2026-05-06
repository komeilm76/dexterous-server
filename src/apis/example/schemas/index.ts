import { kmApi } from 'km-api';
import z from 'zod';

const apiSchema = kmApi.apiConfig.makeApiConfig({
  method: 'get',
  pathShape: '/example',
  request: {
    body: z.undefined(),
    params: z.object(),
    query: z.object(),
    headers: z.object(),
    cookies: z.object(),
  },
  response: {
    200: z.object({ counter: z.number() }),
    400: z.object(),
  },
});
export default { apiSchema };
