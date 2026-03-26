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

export default function PostModalRecipe({
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
                                title: e.target.nome.value,
                                prepTime: Number(e.target.prepTime.value),
                                description: e.target.descricao.value,
                                ingredients: [e.target.ingredientes.value],
                                steps: [e.target.steps.value],
                            };

                            console.log("Enviando:", atualizarDados);

                            await updateFunction(atualizarDados);

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
                        <DialogTitle>Nova Receita</DialogTitle>
                        <DialogDescription>
                            Adicione uma nova receita e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="nome">Nome</Label>
                            <Input
                                id="nome"
                                name="nome"
                                
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="prepTime">Tempo de preparo</Label>
                            <Input
                                id="prepTime"
                                name="prepTime"
                                type="number"
                                
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="ingredientes">
                                Ingredientes (separados por vírgula)
                            </Label>
                            <Input
                                id="ingredientes"
                                name="ingredientes"
                                
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="steps">
                                Passos (separados por vírgula)
                            </Label>
                            <Input
                                id="steps"
                                name="steps"
                               
                            />
                        </Field>

                        <Label htmlFor="descricao">Descrição</Label>
                        <InputGroup>
                            <InputGroupTextarea
                                id="descricao"
                                name="descricao"
                                className="h-20"
                               
                            />
                        </InputGroup>
                    </FieldGroup>

                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-orange-600"
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}