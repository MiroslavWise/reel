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
        <label className="text-sm font-semibold text-violet-900" htmlFor="reel-name">
          Название колеса
        </label>
        <input
          className="w-full rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
          id="reel-name"
          placeholder="Например, Подарки"
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-3 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-violet-950">Участники</h2>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              className="space-y-3 rounded-2xl border border-violet-100 bg-white/80 p-3 shadow-[0_12px_28px_rgba(120,90,175,0.08)] sm:flex sm:items-end sm:gap-3 sm:space-y-0"
              key={field.id}
            >
              <div className="min-w-0 sm:flex-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-violet-700" htmlFor={`user-${field.id}`}>
                  Имя участника
                </label>
                <input
                  className="w-full rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  id={`user-${field.id}`}
                  placeholder="Имя участника"
                  {...register(`users.${index}.name`)}
                />
                {errors.users?.[index]?.name && <p className="mt-1 text-sm text-rose-600">{errors.users[index]?.name?.message}</p>}
              </div>
              <div className="flex items-center justify-between gap-3 sm:shrink-0">
                <label className="flex items-center gap-2 text-sm font-medium text-violet-800">
                  <input className="h-4 w-4 accent-violet-600" type="checkbox" {...register(`users.${index}.exclude`)} />
                  <span>Исключить</span>
                </label>
                {fields.length > 1 && (
                  <button className="text-sm font-medium text-rose-500 hover:text-rose-700" onClick={() => remove(index)} type="button">
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="secondary-button rounded-xl px-3 py-2 text-sm font-semibold"
            onClick={() => append({ name: "", exclude: false })}
            type="button"
          >
            Добавить участника
          </button>
        </div>
        {errors.users?.message && <p className="text-sm text-rose-600">{errors.users.message}</p>}
      </div>

      {errors.root?.message && <p className="text-sm text-rose-600">{errors.root.message}</p>}
      <button
        className="primary-button w-full rounded-2xl px-4 py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Сохраняем..." : "Сохранить колесо"}
      </button>
    </form>
  )
}
