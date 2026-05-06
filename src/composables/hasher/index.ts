import jwt, {
  JsonWebTokenError,
  type SignOptions,
  type VerifyErrors,
  type JwtPayload,
} from 'jsonwebtoken';
import { stringify, parse } from 'zipson';
import { useLogger } from '../logger';
import _ from 'lodash';
type IConfig = { zip: boolean; secretKey: string };
export const useHasher = (entryConfig?: Partial<IConfig>) => {
  const { log } = useLogger('hash');

  const makeStrongSecretKey = (secretKey: string) => {
    const length = secretKey.length;
    const maxValidLength = 8;
    if (length > maxValidLength) {
      throw log({
        message: `Entry Secret Value Length must equal or smaller than ${maxValidLength}. (Entry must have ${maxValidLength} character) | entry secret:${secretKey} | length:${secretKey.length}`,
        type: 'error',
      }).object;
    } else {
      const validSecret = secretKey.split('');
      return [...validSecret, '@#@', ...validSecret.reverse()].join('');
    }
  };
  const config: IConfig = {
    secretKey: makeStrongSecretKey('alpha'),
    zip: true,
    ...(entryConfig && {
      ...entryConfig,
      secretKey: makeStrongSecretKey(entryConfig.secretKey || 'alpha'),
    }),
  };
  const makehash = (
    data: Buffer | object | string,
    secretKey: string = config.secretKey,
    options?: SignOptions
  ) => {
    const zipData = stringify(data);
    const encoded = jwt.sign({ payload: config.zip == true ? zipData : data }, secretKey, {
      ...options,
    });
    // const verified = jwt.verify(encoded, secretKey, { algorithms: ["PS512", "ES512", "HS512"] });
    return encoded;
  };
  const makeDehash = <PAYLOAD extends any>(hash: string, secretKey: string = config.secretKey) => {
    const result = jwt.verify(hash, secretKey) as JwtPayload & { payload: PAYLOAD };
    const payload = config.zip == true ? parse(result.payload as string) : result.payload;
    return { ...result, payload };
  };

  const addSalt = (hash: string, salt: string) => {
    const droped = _.map(hash, (v) => {
      if (v == '.') {
        return `@${salt}@`;
      } else {
        return v;
      }
    }).join('');
    return `${salt}#${droped}#${salt}`;
  };
  const removeSalt = (saltedValue: string, salt: string) => {
    return saltedValue
      .split(`${salt}#`)
      .join('')
      .split(`#${salt}`)
      .join('')
      .split(`@${salt}@`)
      .join('.')
      .trim();
  };
  const customHash = (
    data: Buffer | object | string,
    entryOptions?: SignOptions & { deep?: number; secretKey?: string }
  ) => {
    const options = { deep: 1, secretKey: config.secretKey, ...(entryOptions && entryOptions) };
    const { deep, secretKey, ...rest } = options;
    const signOptions = rest;
    const maxDeepValue = 6;
    if (deep > maxDeepValue) {
      throw log({ message: `deep value is too large, max deep value was ${maxDeepValue}` }).json;
    }
    const loop = Array.from({ length: deep });
    let hashed = makehash(data, secretKey, signOptions);

    loop.forEach((item, index) => {
      // const isLastWhile = loop.length - 1 == index;
      const saltedValue = addSalt(hashed, secretKey);
      hashed = makehash(saltedValue, secretKey, signOptions);
    });
    return hashed as unknown as string;
  };
  const customDehash = (hashed: string, secretKey: string = config.secretKey) => {
    const dehashed = makeDehash(hashed, secretKey);
    if (typeof dehashed.payload == 'string') {
      const cleanDehashed = removeSalt(dehashed.payload, secretKey);
      try {
        return customDehash(cleanDehashed, secretKey);
      } catch (error) {
        const { message } = error as VerifyErrors;
        if (message == 'invalid token') {
          console.log('hashed', hashed);
          return customDehash(cleanDehashed, secretKey);
        } else {
          return cleanDehashed;
        }
      }
    } else {
      return dehashed;
    }
  };
  return { customHash, customDehash };
};
