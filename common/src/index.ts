import { z } from "zod";

export const signupInput = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password contains atleast 6 digits" }),
  name: z.string().optional(),
});
export const signinInput = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password contains atleast 6 digits" }),
});
export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});
export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

// FrontEnd
export type SignupType = z.infer<typeof signupInput>;
export type SigninType = z.infer<typeof signinInput>;
export type CreatePostType = z.infer<typeof createPostInput>;
export type UpdatePostType = z.infer<typeof updatePostInput>;
