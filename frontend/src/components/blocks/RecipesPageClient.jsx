'use client';

import { useRecipes } from '@/hooks/useRecipes';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CookingPot, RotateCw } from 'lucide-react';

export function RecipesPageClient({ initialRecipes }) {
  const { recipes, loading, error, refetch } = useRecipes({
    initialRecipes,
    fetchOnMount: initialRecipes.length === 0,
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white px-4 py-10">
      <div className="mx-auto mt-10 w-full max-w-5xl">

        <Card className="border border-orange-100 bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl">

          {/* Header */}
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight text-orange-600 flex gap-2 items-center">
                  <CookingPot className="text-orange-500" /> Receitas
                </CardTitle>

                <CardDescription className="mt-1 text-zinc-600">
                  Descubra pratos incríveis para preparar hoje
                </CardDescription>
              </div>

              <button
                onClick={refetch}
                className="group flex items-center rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:bg-orange-600 active:scale-95"
              >
                <span className="transition-transform group-hover:rotate-180">
                  <RotateCw className='h-3.5'/>
                </span>
                Recarregar
              </button>
            </div>
          </CardHeader>

          <CardContent>

            {/* Loading */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-orange-100 bg-white/70 p-5"
                  >
                    <div className="mb-4 h-5 w-2/3 rounded bg-orange-200" />
                    <div className="mb-2 h-3 w-full rounded bg-orange-200" />
                    <div className="mb-4 h-3 w-3/4 rounded bg-orange-200" />
                    <div className="h-6 w-16 rounded-full bg-orange-300" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600">
                Erro ao carregar receitas: {error}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && recipes.length === 0 && (
              <div className="rounded-xl border border-dashed border-orange-200 p-8 text-center text-sm text-zinc-500">
                Nenhuma receita cadastrada ainda.
              </div>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Glow hover */}
                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-transparent via-orange-100/40 to-transparent" />

                  <div className='flex items-center justify-between'>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-zinc-900">
                      {recipe.title}
                    </h2>

                    <span className="text-xs text-zinc-400">
                      #{recipe.id}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-sm text-zinc-600 line-clamp-3">
                    {recipe.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">

                    {/* Time badge */}
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white shadow">
                      ⏱ {recipe.prepTime} min
                    </span>

                  </div>

                  {/* Ingredients */}
                  {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-400">
                        Ingredientes
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {recipe.ingredients.slice(0, 4).map((item, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-orange-200 bg-orange-100 px-3 py-1 text-xs text-orange-700 transition hover:bg-orange-200"
                          >
                            {item}
                          </span>
                        ))}

                        {recipe.ingredients.length > 4 && (
                          <span className="text-xs text-zinc-400">
                            +{recipe.ingredients.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}