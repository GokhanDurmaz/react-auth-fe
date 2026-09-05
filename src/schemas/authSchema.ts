import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: 'Username is not empty.' })
        .min(3, { message: 'Username has at least three characters.' }),
        password: z
            .string()
            .min(1, { message: 'Password is not empty.' })
            .min(6, { message: 'Password has at least six characters.' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;