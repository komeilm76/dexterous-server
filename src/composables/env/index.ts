import dotenv from 'dotenv';

import z from 'zod';
import { zodExtended } from '../../utils/zod';
import { useLogger } from '../logger';

const envSchema = z.object({
  APP_PORT: z.number(),
  APP_MONGO_DB: z.string(),
});

const { log } = useLogger('environments');

export const useEnvs = () => {
  const defaultEnvs: z.infer<typeof envSchema> = {
    APP_PORT: 3000,
    APP_MONGO_DB: 'mongodb://localhost:27017/',
  };
  const register = () => {
    const mode = process.env.NODE_ENV;
    let output: string[] = [];
    if (typeof mode == 'string') {
      if (mode == 'main') {
        output = ['.env.local', '.env'];
      } else {
        output = ['.env', '.env.local', `.env.${mode}`];
      }
    } else {
      output = ['.env', '.env.local'];
    }
    dotenv.config({ path: output, override: true, quiet: true });
    log({ type: 'info', message: 'Environments Ready to Use' });
  };
  const parsedEnvs = () => {
    const parsed = zodExtended.stringTemplateFromObject(envSchema, 'loose').safeParse(process.env);
    if (parsed.success) {
      return { ...defaultEnvs, ...parsed.data } as z.infer<typeof envSchema>;
    } else {
      throw log({ type: 'error', message: 'error on parse envs', data: parsed.error.issues })
        .object;
    }
  };
  return { register, parsedEnvs, rawEnvs: process.env };
};
