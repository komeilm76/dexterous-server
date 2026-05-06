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

const getExactType = (schema: ZodType) => {
  if (
    schema instanceof ZodOptional ||
    schema instanceof ZodNonOptional ||
    schema instanceof ZodNullable
  ) {
    return getExactType(schema.def.innerType as ZodType);
  } else {
    return schema;
  }
};
const stringTemplate = (schema: ZodType) => {
  const exactSchema = getExactType(schema);
  if (exactSchema instanceof ZodString) {
    return exactSchema;
  } else if (
    exactSchema instanceof ZodObject ||
    exactSchema instanceof ZodArray ||
    exactSchema instanceof ZodBoolean ||
    exactSchema instanceof ZodNumber
  ) {
    const stringSchema = z
      .string()
      .check((v) => {
        try {
          const convertedValue = JSON.parse(v.value);
          const parseResult = exactSchema.safeParse(convertedValue);
          if (parseResult.success == false) {
            // @ts-ignore
            v.issues.push(...parseResult.error.issues);
          }
        } catch (error) {
          v.issues.push({
            code: 'custom',
            expected: `string-template-${exactSchema.type}`,
            input: v.value,
            message: `Invalid input: expected ${exactSchema.type} in string template valid example: -> "${exactSchema.type}" <-, received -> ${v.value} <-`,
          });
        }
      })
      .pipe(z.transform((v) => JSON.parse(v)));
    return stringSchema;
  } else {
    return exactSchema;
  }
};
const stringTemplateFromObject = (
  schema: ZodObject,
  mode: 'loose' | 'strict' | 'strip' = 'strict'
) => {
  const modifiedShape: Record<keyof typeof schema.shape, ZodType> = {};
  for (const key in schema.shape) {
    modifiedShape[key] = stringTemplate(schema.shape[key]);
  }
  if (mode == 'loose') {
    return z.looseObject(modifiedShape);
  } else if (mode == 'strict') {
    return z.strictObject(modifiedShape);
  } else {
    return z.object(modifiedShape);
  }
};

export const zodExtended = {
  stringTemplate,
  stringTemplateFromObject,
  getExactType,
};
