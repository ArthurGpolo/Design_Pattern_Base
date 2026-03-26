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

export default function UpdateModalRecipe({
    recipe,
    updateFunction
}) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Search />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving(true);

                        try {
                            const atualizarDados = {
                                id: recipe.id,
                                title: e.target.nome.value,
                                prepTime: Number(e.target.prepTime.value),
                                description: e.target.descricao.value,
                                ingredients: e.target.ingredientes.value
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                                steps: e.target.steps.value
                                    .split(',')
                                    .map((step) => step.trim())
                                    .filter(Boolean),
                            };

                            console.log("Enviando:", atualizarDados);

                            await updateFunction(recipe.id, atualizarDados);

                            setOpen(false);
                        } catch (err) {
                            console.error("Erro ao atualizar:", err);
                            alert("Erro ao atualizar receita!");
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Editar Receita</DialogTitle>
                        <DialogDescription>
                            Faça alterações na sua receita e clique em salvar.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="nome">Nome</Label>
                            <Input
                                id="nome"
                                name="nome"
                                defaultValue={recipe.title}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="prepTime">Tempo de preparo</Label>
                            <Input
                                id="prepTime"
                                name="prepTime"
                                type="number"
                                defaultValue={recipe.prepTime}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="ingredientes">
                                Ingredientes (separados por vírgula)
                            </Label>
                            <Input
                                id="ingredientes"
                                name="ingredientes"
                                defaultValue={Array.isArray(recipe.ingredients)
                                    ? recipe.ingredients.join(", ")
                                    : ""}
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="steps">
                                Passos (separados por vírgula)
                            </Label>
                            <Input
                                id="steps"
                                name="steps"
                                defaultValue={Array.isArray(recipe.steps)
                                    ? recipe.steps.join(", ")
                                    : ""}
                            />
                        </Field>

                        <Label htmlFor="descricao">Descrição</Label>
                        <InputGroup>
                            <InputGroupTextarea
                                id="descricao"
                                name="descricao"
                                className="h-20"
                                defaultValue={recipe.description}
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