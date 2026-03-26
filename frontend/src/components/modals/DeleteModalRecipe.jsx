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
import { Trash } from "lucide-react";
import { FieldGroup, Field } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { InputGroup, InputGroupTextarea } from "../ui/input-group";

export default function DeleteModalRecipe({
    recipe,
    updateFunction
}) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Trash />
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
                            };

                            console.log("Enviando:", atualizarDados);

                            await updateFunction(recipe.id, atualizarDados);

                            setOpen(false);
                        } catch (err) {
                            console.error("Erro ao deletar:", err);
                            alert("Erro ao deletar receita!");
                        } finally {
                            setSaving(false);
                        }
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Deletar Receita</DialogTitle>
                        <DialogDescription>
                            Tem certea que deseja deletar essa receita?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-4">
        
                        <Button
                            type="submit"
                            className="w-full bg-orange-600"
                            disabled={saving}
                        >
                            {saving ? "Deletando..." : "Deletar"}
                        </Button>
                        <Button
                            type="button"
                            className="w-full bg-orange-withe text-orange-600 border-orange-600"
                            onClick={() => setOpen(false)}
                            disabled={saving}
                        >
                           Cancelar
                        </Button>
                   
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}