
"use client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Combobox } from "./ui/combo-box";
import { useState, useMemo } from "react";
import { getProducts } from "@/actions/product.action";
import Image from "next/image";
import CreateDialog from "./CreateDialog";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";

type Product = Awaited<ReturnType<typeof getProducts>>;

interface InventoryTableProps {
    products: Product;
}

export default function InventoryTable({ products }: InventoryTableProps) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of products per page

    // Filter products based on search term and category
    const filteredProducts = useMemo(() => {
        return (products.userProducts || []).filter((product: any) => {
            const matchesSearch =
                searchTerm === "" ||
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesCategory =
                selectedCategory === "" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products.userProducts, searchTerm, selectedCategory]);

    // Calculate pagination details
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Generate page numbers for pagination (show limited range, e.g., 5 pages)
    const getPageNumbers = () => {
        const maxPagesToShow = 5;
        const pages: (number | string)[] = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (startPage > 1) {
            pages.unshift(1, "...");
        }
        if (endPage < totalPages) {
            pages.push("...", totalPages);
        }

        return pages;
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <div className="relative max-w-sm w-full">
                    <Input
                        placeholder="Filter plants..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute h-4 w-4 left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <Combobox
                    value={selectedCategory}
                    onChange={(val) => {
                        setSelectedCategory(val);
                        setCurrentPage(1); // Reset to first page on filter change
                    }}
                />
                <CreateDialog />
            </div>
            <div className="w-full border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-4">No</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product: any, index: number) => (
                                <TableRow key={product.id} className="odd:bg-muted/50">
                                    <TableCell className="pl-4">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="max-w-[150px] truncate">
                                        {product.description}
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>
                                        <Image
                                            loading="lazy"
                                            objectFit="cover"
                                            src={product.image || "/product_default2.jpg"}
                                            alt={product.name}
                                            className="w-17 h-17 object-cover"
                                            width={68}
                                            height={68}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-4">
                                            <EditDialog product={product} />
                                            <DeleteDialog product={product} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(page as number);
                                    }}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                            }}
                            className={
                                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
