
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getproductById } from "@/actions/product.action";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Shield, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";



type Product = Awaited<ReturnType<typeof getproductById>>; //  Dùng Awaited để lấy kiểu trả về của hàm getproductById

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {

  const { addToCart } = useCartStore();

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1); // Thêm 1 sản phẩm vào giỏ
    toast.success("Add successfully");
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Product not found</p>
      </div>
    )
  }


  console.log("product", product);

  return (
    <Card className="max-w">
      <div className="flex flex-row">
        <div className="basis-2/4">
          <CardHeader>
            {product?.image && (
              <div className="rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src={product.image || '/product_default2.jpg'}
                  alt="Post content"
                  className="object-cover h-[500px] w-[500px] rounded-md"
                  width={400}
                  height={100}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
          </CardHeader>
        </div>
        <div className="basis-2/4 flex flex-col justify-between">
          <CardContent className="mt-8 space-y-3">
            <CardTitle className="text-5xl font-bold">{product.name}</CardTitle>
            <CardTitle className="text-3xl font-bold">
              {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="rounded-full text-2xl">
                {product.category}
              </Badge>
            </div>
            <CardContent className="flex-1 space-y-8 pb-6">
              <CardDescription className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </CardDescription>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Free Shipping</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-700">2 Year Warranty</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
                  <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-700">30 Day Returns</p>
                </div>
              </div>
            </CardContent>

            <Button variant="default" className="rounded-full" asChild>
              <Button onClick={() => handleAddToCart(product.id)} className="hover:cursor-pointer">
                Thêm vào giỏ hàng
                <ShoppingCart />
              </Button>
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}