import {z} from 'zod';

export const signInschema=z.object({
    identifier:z.string(), // This can be either email or username
    password:z.string()
})