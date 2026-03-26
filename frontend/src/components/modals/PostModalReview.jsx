'use client';
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FieldGroup, Field } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InputGroup, InputGroupTextarea } from "../ui/input-group";

export default function PostModalReview({
    idreceita = 1,
    updateFunction
}) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className={'bg-orange-600 text-white p-4'}>Adicionar nova receita</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);

                        try {
                            const atualizarDados = {
                                author: e.target.teste.value,
                                rating: Number(e.target.avaliacao.value),
                                comment: e.target.comentario.value,
                            };

                            console.log("Enviando:", atualizarDados);

                            await updateFunction(idreceita,atualizarDados);

                            setOpen(false);
                        } catch (err) {
                            console.error("Erro ao postar:", err);
                            alert("Erro ao postar receita!");
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Nova Review</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova review e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="teste">Nome</Label>
                            <Input
                                id="teste"
                                name="teste"
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
                            />
                        </Field>

                        <Label htmlFor="comentario">Comentário</Label>
                        <InputGroup>
                            <InputGroupTextarea
                                id="comentario"
                                name="comentario"
                            />
                        </InputGroup>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="submit" className="w-full bg-orange-600" disabled={saving}>
                            {saving ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}