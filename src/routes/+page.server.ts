import type { Actions } from './$types';
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
export const actions = {
	chat: async (event) => {
		const data = await event.request.formData();
		console.log(data);
	}
} satisfies Actions;
