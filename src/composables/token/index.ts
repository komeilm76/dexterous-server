import jwt, { JwtPayload } from 'jsonwebtoken';
import { useLogger } from '../logger';

type IRole = 'admin' | 'operator' | 'guest';
type IMeta = {
  profile: {
    role: IRole;
  };
};
export const useToken = () => {
  const parse = (hash: string | `Bearer ${string}` | undefined) => {
    if (hash) {
      let cleanHash = '';
      if (hash.startsWith('Bearer')) {
        cleanHash = hash.split('Bearer').join('').trim();
      } else {
        cleanHash = hash.trim();
      }
      const payload = jwt.decode(cleanHash);
      if (payload instanceof Object) {
        const { exp, profile } = payload as JwtPayload & IMeta;
        return {
          valid: true,
          isExpired: exp ? (exp > Date.now() ? false : true) : false,
          payload,
          role: profile.role,
        };
      } else {
        return { valid: false, isExpired: true, role: 'guest' };
      }
    } else {
      return { valid: false, isExpired: true, role: 'guest' };
    }
  };
  const make = (meta: IMeta) => {
    return jwt.sign(meta, 'token-secret', { expiresIn: Date.now() + 60 * 60 * 1000 });
  };

  return { make, parse };
};
