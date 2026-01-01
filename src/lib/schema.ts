import z from 'zod';

export const chatSchema = z.object({
	title: z.string().min(5).max(200),
	description: z.string().min(10, {
		error: 'Required!!'
	})
});
