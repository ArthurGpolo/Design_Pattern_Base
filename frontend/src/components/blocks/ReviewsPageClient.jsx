'use client';

import { useReviews } from '@/hooks/useReviews';
import { RotateCw, Search, Star, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InputGroup, InputGroupInput, InputGroupButton, InputGroupAddon, InputGroupText, InputGroupTextarea } from '../ui/input-group';
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function ReviewsPageClient({ initialReviews }) {
  const { reviews, loading, error, refetch, editReview } = useReviews({
    initialReviews,
    fetchOnMount: initialReviews.length === 0,
  });

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-orange-50 to-white px-4 py-10">
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


              <div className='flex justify-end gap-1'>
                <Dialog>
                  {/* Formulário de edição de review */}
                  <form className='flex justify-end mt-2'
                    onSubmit={async (e) => {

                      // Pega os valores dos inputs do form
                      const atualizarDados = {
                        author: e.target.name,
                        rating: e.target.avaliacao,
                        comment: e.target.comentario,
                      };
                      console.log(atualizarDados);
                      
                      // Chama o hook editReview que faz PUT na API
                      await editReview(review.id, atualizarDados);

                      // Fecha o dialog automaticamente após salvar
                      e.target.closest('form')?.querySelector('button[type="button"]')?.click(atualizarDados);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline"><Search /></Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Editar Review</DialogTitle>
                        <DialogDescription>
                          Faça alterações do seu review aqui. Clique em salvar quando finalizar.
                        </DialogDescription>
                      </DialogHeader>

                      <FieldGroup>
                        {/* Campo Nome */}
                        <Field>
                          <Label htmlFor={`name`}>Nome</Label>
                          <Input
                            id={`name`}
                            name="name"
                            defaultValue={review.author} // preenche com o autor atual
                          />
                        </Field>

                        {/* Campo Avaliação */}
                        <Field>
                          <Label htmlFor={`avaliacao`}>Avaliação</Label>
                          <Input
                            id={`avaliacao}`}
                            name="avaliacao"
                            type="number"
                            min={1}
                            max={5}
                            defaultValue={review.rating} // preenche com a avaliação atual
                          />
                        </Field>

                        {/* Campo Comentário */}
                        <Label htmlFor={`comentario`}>Comentário</Label>
                        <InputGroup>
                          <InputGroupTextarea
                            id={`comentario`}
                            name="comentario"
                            placeholder="Digite o comentário"
                            className={'h-20'}
                            defaultValue={review.comment} // preenche com o comentário atual
                          />
                        </InputGroup>
                      </FieldGroup>

                      <DialogFooter>
                        {/* Botão de salvar que fecha o dialog ao submeter */}
                        <DialogClose asChild>
                          <Button type="submit" className={'w-full bg-orange-600'}>
                            Salvar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>

                <Dialog>
                  <form className='flex justify-end mt-2'>
                    <DialogTrigger asChild>
                      <Button variant="outline"><Trash /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Deletar Review</DialogTitle>
                        <DialogDescription>
                          Aqui você pode apagar suas reviews. Click em deletar para apagar.
                        </DialogDescription>
                      </DialogHeader>
                      <FieldGroup>
                        <Field>
                          <Label htmlFor="name-1">Nome</Label>
                          <Input id="name-1" name="name" defaultValue="Puxar o nome" />
                        </Field>
                        <Field>
                          <Label htmlFor="comentario-1">Avaliação</Label>
                          <Input id="comentario-1" name="avaliacao" defaultValue="Puxar a avalação" />
                        </Field>
                        <Label htmlFor="comentario-1">Comentário</Label>
                        <InputGroup>
                          <InputGroupTextarea
                            id="block-end-textarea"
                            placeholder="Puxar comentário"
                            className={'h-20'}
                          />
                        </InputGroup>
                      </FieldGroup>
                      <DialogFooter>
                        <Button type="submit" className={'w-full bg-orange-600'}>Deletar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </form>
                </Dialog>
              </div>

              {/* Hover glow */}
              < div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-linear-to-r from-transparent via-orange-100/40 to-transparent rounded-2xl" />
            </li>
          ))}
        </ul>

      </main>
    </div>
  );
}