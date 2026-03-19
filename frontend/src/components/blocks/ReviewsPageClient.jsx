'use client';

import { useReviews } from '@/hooks/useReviews';
import { RotateCw, Star } from 'lucide-react';

export function ReviewsPageClient({ initialReviews }) {
  const { reviews, loading, error, refetch } = useReviews({
    initialReviews,
    fetchOnMount: initialReviews.length === 0,
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white px-4 py-10">
      <main className="mx-auto mt-10 w-full max-w-5xl">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-orange-600 flex gap-2 items-center">
              <Star className='text-shadow-yellow-400' /> Avaliações
            </h1>

            <p className="mt-1 text-sm text-zinc-600">
              Veja o que as pessoas estão achando das receitas
            </p>
          </div>

          <button
            onClick={refetch}
            className="flex items-center rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.05] hover:bg-orange-600 active:scale-95"
          >
            <span className="transition-transform group-hover:rotate-180">
              <RotateCw className='h-3.5' />
            </span>
            Recarregar
          </button>
        </header>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-orange-100 bg-white p-4"
              >
                <div className="mb-2 h-4 w-20 rounded bg-orange-200" />
                <div className="mb-2 h-3 w-full rounded bg-orange-200" />
                <div className="h-3 w-1/2 rounded bg-orange-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
            Erro ao carregar reviews: {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-lg border border-dashed border-orange-200 p-6 text-center text-sm text-zinc-500">
            Nenhuma avaliação ainda.
          </div>
        )}

        {/* Lista */}
        <ul className="space-y-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">

                {/* Rating */}
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow">
                  ⭐ {review.rating}
                </span>

                <span className="text-xs text-zinc-400">
                  #{review.id}
                </span>
              </div>

              {/* Comment */}
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {review.comment}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">

                <span className="text-xs text-zinc-400">
                  Avaliado por
                </span>

                <span className="text-sm font-medium text-orange-600">
                  {review.author}
                </span>
              </div>

              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-r from-transparent via-orange-100/40 to-transparent rounded-2xl" />
            </li>
          ))}
        </ul>

      </main>
    </div>
  );
}