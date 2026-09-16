"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useFieldArray, useForm } from "react-hook-form"

import { createReelSchema, type CreateReelForm } from "@/schemas/create"

export function CreateReelForm() {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateReelForm>({
    defaultValues: { name: "", users: [{ name: "", exclude: false }] },
    resolver: yupResolver(createReelSchema),
  })
  const { append, fields, remove } = useFieldArray({ control, name: "users" })

  const onSubmit = handleSubmit(async (values) => {
    const response = await fetch("/api/reels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      setError("root", { message: data?.error ?? "Не удалось сохранить колесо" })
      return
    }

    window.location.assign("/")
  })

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2 text-left">
        <label className="text-sm font-medium" htmlFor="reel-name">
          Название колеса
        </label>
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-950"
          id="reel-name"
          placeholder="Например, Подарки"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Участники</h2>
            <p className="text-sm text-zinc-500">Добавьте имена и исключите тех, кто не должен выпадать.</p>
          </div>
          <button
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            onClick={() => append({ name: "", exclude: false })}
            type="button"
          >
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div className="flex items-start gap-3" key={field.id}>
              <div className="min-w-0 flex-1">
                <label className="mb-1 block text-xs font-medium text-zinc-600" htmlFor={`user-${field.id}`}>
                  name — имя участника
                </label>
                <input
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-950"
                  id={`user-${field.id}`}
                  placeholder="Имя участника"
                  {...register(`users.${index}.name`)}
                />
                {errors.users?.[index]?.name && <p className="mt-1 text-sm text-red-600">{errors.users[index]?.name?.message}</p>}
              </div>
              <label className="flex shrink-0 items-center gap-2 pt-6 text-sm text-zinc-700">
                <input type="checkbox" {...register(`users.${index}.exclude`)} />
                exclude — исключить при прокрутке
              </label>
              {fields.length > 1 && (
                <button className="pt-2 text-sm text-red-600 hover:text-red-800" onClick={() => remove(index)} type="button">
                  Удалить
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.users?.message && <p className="text-sm text-red-600">{errors.users.message}</p>}
      </div>

      {errors.root?.message && <p className="text-sm text-red-600">{errors.root.message}</p>}
      <button
        className="w-full rounded-lg bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Сохраняем..." : "Сохранить"}
      </button>
    </form>
  )
}
