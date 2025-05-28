
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SquarePlus, X } from "lucide-react";
import { Combobox } from "./ui/combo-box";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "@/actions/product.action";
import { UploadButton } from "@/lib/uploadthing";

export default function CreateDialog() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        stock: 1,
        price: 1,
        category: "",
        userId: "",
        image: "",
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (field: string, value: string | number) => {
        setFormData({ ...formData, [field]: value });
    };

    const { mutate } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            console.log("Plant created successfully");
            toast.success("Plant created successfully");
        },
        onError: (error) => {
            console.error("Error creating plant:", error);
            toast.error("Failed to create plant");
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!formData.image) {
                toast.error("Please upload an image for the plant");
                return;
            }
            mutate(formData);
            setFormData({
                name: "",
                description: "",
                stock: 1,
                price: 1,
                category: "",
                userId: "",
                image: "",
            })
        } catch (error) {
            console.error("Error creating plant:", error);
            toast.error("Failed to create plant");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="default"
                    className="ml-auto font-bold flex items-center gap-2"
                    asChild
                >
                    <span>
                        <SquarePlus className="w-4 h-4" />
                        Add Product
                    </span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Add a Plant</AlertDialogTitle>
                    <AlertDialogDescription>
                        Fill out the form below to add a new plant to your inventory.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                className="mt-2"
                                id="name"
                                type="text"
                                placeholder="Enter name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="category">Category</Label>
                            <Combobox
                                value={formData.category}
                                onChange={(val) => handleChange("category", val)}
                            />
                        </div>
                    </div>
                    <Label htmlFor="description" className="mt-2 mb-2">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Type your message here."
                        rows={8}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="max-h-[300px] overflow-y-auto h-[290px]"
                    />
                    <div className="grid grid-cols-2 gap-4 gap-y-2 mt-2">
                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                className="mt-2"
                                id="stock"
                                type="number"
                                placeholder="Enter stock quantity"
                                value={formData.stock}
                                onChange={(e) => handleChange("stock", Number(e.target.value))}
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                className="mt-2"
                                id="price"
                                type="number"
                                placeholder="Enter price"
                                value={formData.price}
                                onChange={(e) => handleChange("price", Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            Product Photo *
                        </h3>

                        <div className="space-y-3">
                            {formData.image ? (
                                <div className="relative group">
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={formData.image}
                                            alt="Plant preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => handleChange("image", "")}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                                type="button"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 text-center mt-2">
                                        Hover over image and click X to remove
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div
                                        className={`relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                            }`}
                                    >
                                        <UploadButton
                                            endpoint="postImage"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]?.url) {
                                                    handleChange("image", res[0].url);
                                                    console.log("Files: ", res[0].url);
                                                    toast.success("Image uploaded successfully");
                                                }
                                                setIsUploading(false);
                                            }}
                                            onUploadError={(error) => {
                                                console.error("Upload error:", error);
                                                toast.error(`Upload failed: ${error.message}`);
                                                setIsUploading(false);
                                            }}
                                            onUploadBegin={() => {
                                                setIsUploading(true);
                                            }}
                                            className="opacity-0 absolute inset-0 w-full h-full" // Hide default button but keep it functional
                                        />
                                        <div className="text-center">
                                            <p className="text-sm text-blue-600 font-semibold">
                                                {isUploading ? "Uploading..." : "Chọn file"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Supports JPG, PNG, up to 4MB
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        Upload a clear, high-quality photo of your plant
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={isUploading}>
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
