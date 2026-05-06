import z, {
  ZodArray,
  ZodBoolean,
  ZodNonOptional,
  ZodNullable,
  ZodNumber,
  ZodObject,
  ZodOptional,
  ZodString,
  ZodType,
} from 'zod';
import _ from 'lodash';
import { useLogger } from '../composables/logger';
import { type IApiSchema } from '../types/api';
import { useMiddleware } from '../composables/middleware';
import { zodExtended } from '../utils/zod';

const { log } = useLogger('api-middleware:valid-request');

// const safeConvertValueInStringFormat = (schema: ZodType) => {
//   const baseSchema = z
//     .string()
//     .check((v) => {
//       try {
//         const convertedValue = JSON.parse(v.value);
//         const parseResult = schema.safeParse(convertedValue);
//         if (parseResult.success == false) {
//           // @ts-ignore
//           v.issues.push(...parseResult.error.issues);
//         }
//       } catch (error) {
//         v.issues.push({
//           code: "custom",
//           expected: `string-template-${schema.type}`,
//           input: v.value,
//           message: `Invalid input: expected ${schema.type} in string template valid example: -> "${schema.type}" <-, received -> ${v.value} <-`,
//         });
//       }
//     })
//     .pipe(z.transform((v) => JSON.parse(v)));
//   return baseSchema;
// };

// const requestQueryParamsTransformerItem = (schema: ZodType) => {
//   if (schema instanceof ZodOptional || schema instanceof ZodNonOptional || schema instanceof ZodNullable) {
//     return requestQueryParamsTransformerItem(schema.def.innerType as ZodType);
//   } else if (schema instanceof ZodString) {
//     return schema;
//   } else if (schema instanceof ZodNumber) {
//     return safeConvertValueInStringFormat(schema);
//   } else if (schema instanceof ZodBoolean) {
//     return safeConvertValueInStringFormat(schema);
//   } else if (schema instanceof ZodArray || schema instanceof ZodObject) {
//     return safeConvertValueInStringFormat(schema);
//   } else {
//     return schema;
//   }
// };
// const requestQueryParamsTransformerObject = (schema: ZodObject) => {
//   const modifiedShape: Record<keyof typeof schema.shape, ZodType> = {};
//   for (const key in schema.shape) {
//     modifiedShape[key] = requestQueryParamsTransformerItem(schema.shape[key]);
//   }
//   return z.object(modifiedShape).strict();
// };

const middleware = (apiSchema: IApiSchema) => {
  return useMiddleware(async (req, res, next) => {
    const { body, query, params } = req;

    const parsedBody = await apiSchema.request.body.safeParseAsync(req.body);
    const parsedQuery = await zodExtended
      .stringTemplateFromObject(apiSchema.request.query, 'strict')
      .safeParseAsync(_.toPlainObject(req.query));
    const parsedParams = await zodExtended
      .stringTemplateFromObject(apiSchema.request.params, 'strict')
      .safeParseAsync(_.toPlainObject(req.params));
    if (parsedBody.success && parsedParams.success && parsedQuery.success) {
      req.parsedRequest = {
        body: parsedBody.data,
        params: parsedParams.data,
        query: parsedQuery.data,
      };

      next();
    } else {
      const error = log(
        {
          type: 'error',
          message: 'Some part of request is not valid',
          data: {
            body: parsedBody.error?.issues,
            params: parsedParams.error?.issues,
            query: parsedQuery.error?.issues,
          },
        },
        false
      );
      res.status(400).send(error.object);
    }
  });
};
export default { middleware };
