"use client";


import { deleteProduct } from "@/actions/product.action";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteDialogProps {
    product: {
        id: string;
    };
}

export default function DeleteDialog({ product }: DeleteDialogProps) {

    const { mutate } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        },
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            mutate(product.id);
        } catch (error) {
            console.error("Error deleting plant:", error);
            toast.error("Failed to delete plant");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    className="ml-auto flex items-center gap-2"
                    asChild
                >
                    <span>
                        <Trash2 className="w-4 h-4" />
                    </span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-[15px]">
                        This action cannot be undone. This will permanently delete the plant
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit}>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit">Confirm Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}