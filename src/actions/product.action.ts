
"use server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "./user.action";
import { Prisma } from "@prisma/client";


export async function getProducts(searchTerm?: String) {
    try {
        const currentUserId = await getUserId();

        const whereClause: any = {
            userId: currentUserId
        }
        if (searchTerm) {
            whereClause.name = { // whereClause.name là điều kiện tìm kiếm
                // Tìm kiếm tên sản phẩm chứa searchTerm, không phân biệt chữ hoa chữ thường
                contains: searchTerm,
                mode: 'insensitive'
            }
        }

        const userProducts = await prisma.products.findMany({
            where: whereClause,
        })
        console.log("User Products:", userProducts);

        // revalidatePath("/");
        return {
            success: true,
            userProducts
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}

export async function getproductById(id: string) {
    return await prisma.products.findUnique({
        where: { id }
    })
}

export async function getAllProducts() {
    try {
        const allProducts = await prisma.products.findMany();
        console.log("All Products:", allProducts);
        return {
            success: true,
            allProducts
        }
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw new Error("Failed to fetch all products");
    }
}

export async function createProduct(data: Prisma.ProductsCreateInput) {
    console.log("Creating product with data:", data);

    try {
        const currentUserId = await getUserId();
        console.log("Current User ID:", currentUserId);
        if (!currentUserId) {
            return;
        }
        const newProduct = await prisma.products.create({
            data: {
                ...data,
                userId: currentUserId // Gán userId từ người dùng hiện tại
            }
        })

        return newProduct;

    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }
}

export async function editProduct(id: string, data: Prisma.ProductsUpdateInput) {
    try {
        const currentUserId = await getUserId();
        const updatedProduct = await prisma.products.update({
            where: { id },
            data: {
                ...data,
                userId: currentUserId // Gán userId từ người dùng hiện tại
            }
        });
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        throw new Error("Failed to update product");
    }
}

export async function deleteProduct(id: string) {
    try {
        const currentUserId = await getUserId();
        if (!currentUserId) {
            return;
        }
        const deletedProduct = await prisma.products.delete({
            where: { id }
        });
        return deletedProduct;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }
}