import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react";
import { FieldGroup, Field } from "../ui/field";
import { Label } from "../ui/label";
import { Input} from "../ui/input";
import { InputGroup, InputGroupTextarea } from "../ui/input-group";


export default function UpdateModal({
    review,          // 👈 recebe o review completo
    updateFunction   // 👈 função editReview
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><Search /></Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Editar Review</DialogTitle>
                    <DialogDescription>
                        Faça alterações do seu review aqui.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();

                        const atualizarDados = {
                            author: e.target.teste.value,
                            rating: Number(e.target.avaliacao.value),
                            comment: e.target.comentario.value,
                        };

                        await updateFunction(review.id, atualizarDados);

                        setOpen(false);
                    }}
                >
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="teste">Nome</Label>
                            <Input
                                id="teste"
                                name="teste"
                                defaultValue={review.author}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="avaliacao">Avaliação</Label>
                            <Input
                                id="avaliacao"
                                name="avaliacao"
                                type="number"
                                min={1}
                                max={5}
                                defaultValue={review.rating}
                            />
                        </Field>

                        <Label htmlFor="comentario">Comentário</Label>
                        <InputGroup>
                            <InputGroupTextarea
                                id="comentario"
                                name="comentario"
                                defaultValue={review.comment}
                            />
                        </InputGroup>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="submit" className="w-full bg-orange-600">
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}