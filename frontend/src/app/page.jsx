import { RecipesPageClient } from '../components/blocks/RecipesPageClient';
import { ReviewsPageClient } from '@/components/blocks/ReviewsPageClient';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChefHat, CookingPot, Search } from 'lucide-react';
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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

async function getRecipes() {
  try {
    const res = await fetch('http://localhost:8080/recipes', {
      // Garante SSR sempre fresco, sem cache em build.
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    // Em caso de erro no servidor, devolve lista vazia
    // (o hook no client pode lidar com recarregar e mostrar erro)
    return [];
  }
}

async function getReviews() {
  try {
    const res = await fetch('http://localhost:8080/reviews', {
      // Garante SSR sempre fresco, sem cache em build.
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    // Em caso de erro no servidor, devolve lista vazia
    // (o hook no client pode lidar com recarregar e mostrar erro)
    return [];
  }
}


// Componente de página é um Server Component por padrão em app router,
// então aqui já estamos fazendo SSR ao buscar os dados com `await getRecipes()`.
export default async function Home() {
  const recipes = await getRecipes();
  const reviews = await getReviews();

  return (<>
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">

        <Tabs defaultValue="recipes" className="w-full">

          {/* HEADER */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-2 text-orange-600">
                <ChefHat className="text-orange-500" /> Cozinha do Dia
              </h1>

              <p className="mt-2 text-sm text-zinc-600 max-w-md">
                Descubra receitas deliciosas, inspire-se e veja o que outras pessoas estão cozinhando hoje.
              </p>
            </div>

            {/* Tabs estilizadas */}
            <TabsList className="grid w-full grid-cols-2 sm:w-auto bg-orange-100 p-1 rounded-xl">

              <TabsTrigger
                value="recipes"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow"
              >
                <CookingPot className="text-orange-500" /> Receitas
              </TabsTrigger>

              <TabsTrigger
                value="reviews"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow"
              >
                ⭐ Avaliações
              </TabsTrigger>

            </TabsList>
          </div>

          {/* CONTEÚDO */}

          <TabsContent value="recipes" className="mt-0">

            <div className="rounded-2xl shadow-sm border mt-3">
              <RecipesPageClient initialRecipes={recipes} />
            </div>
          </TabsContent>


          <TabsContent value="reviews" className="mt-0">
            <div className="rounded-2xl shadow-sm border">
              <ReviewsPageClient initialReviews={reviews} />
            </div>
          </TabsContent>

        </Tabs>
      </div >
    </div >
  </>);
}

