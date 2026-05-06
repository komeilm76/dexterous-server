import { password } from 'bun';
import mongoose from 'mongoose';
import z from 'zod';

const ZodSchema = z.object({
  username: z.string().min(2).max(12),
  password: z.string(),
});

const schema = new mongoose.Schema<z.infer<typeof ZodSchema>>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const model = mongoose.model('user', schema);
export default { model, schema, ZodSchema };
