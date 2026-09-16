import { array, boolean, object, string, type InferType } from "yup"

export const createReelSchema = object({
	name: string().trim().required("Введите название колеса").max(120, "Название слишком длинное"),
	users: array()
		.of(
			object({
				name: string().trim().required("Введите имя участника").max(120, "Имя слишком длинное"),
				exclude: boolean().default(false).required(),
			}),
		)
		.min(1, "Добавьте хотя бы одного участника")
		.required(),
})

export type CreateReelForm = InferType<typeof createReelSchema>