'use client';
import { getAllProducts } from "@/actions/product.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState for managing load more state
import { LoadingSpinner } from "./LoadingSpinner";
import Spline from "@splinetool/react-spline";

const ProjectCard = ({
  name,
  description,
  image,
  price,
  category,
  id
}: any) => {
  const router = useRouter();

  const slugFiedName = name.toLowerCase().replace(/\s+/g, '-');
  const slug = `${id}--${slugFiedName}`;
  const productUrl = `/product/${slug}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-accent transition-all hover:border-primary/50">
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden bg-accent">
        <Image
          onClick={() => router.push(productUrl)}
          src={image || '/product_default2.jpg'}
          alt='Project Image'
          className="object-cover transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
          fill
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 gap-y-2">
        <h3
          onClick={() => router.push(productUrl)}
          className="text-xl font-semibold mb-2 hover:cursor-pointer hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <p className="text-muted-foreground ">
          {description.length > 100 ? `${description.slice(0, 250)}...` : description}
        </p>
        {/* Price Badge */}
        <Badge variant="secondary" className="rounded-full text-[15px] font-bold mt-2">
          {category}
        </Badge>

        {/* Actions */}
        <div className="flex mt-auto justify-between items-center">
          {id && (
            <>
              <Badge variant={'outline'} className="bg-primary text-primary-foreground text-xl">
                {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </Badge>
              <Button variant="default" className="rounded-full" asChild>
                <Button onClick={() => router.push(productUrl)} className="hover:cursor-pointer">
                  <Eye className="mr-1 h-4 w-4" />
                  Detail
                </Button>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCart = () => {
  const [displayCount, setDisplayCount] = useState(6);
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Load thêm products
  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 6);
  };

  const displayedProducts = data?.allProducts.slice(0, displayCount); // dùng slice để lấy số lượng sản phẩm hiển thị

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section id="projects" className="relative py-20 px-6">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            List Product
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
            List of products with details, technologies used, and links to live demos and source code.
          </p>
        </div>

        <div className="relative w-full h-[500px]">
          <Spline
            className="w-full relative rounded-md"
            scene="https://prod.spline.design/aohz741gAfLDRXkc/scene.splinecode"
          />
          <p
            className="absolute right-0 bottom-5 bg-gray-500 p-3 mr-2 rounded-lg font-bold text-pretty text-white dark:tex-white  ">
            Iphone 14 Pro Max
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {displayedProducts?.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Load More Button */}
        {(data?.allProducts?.length ?? 0) > displayCount && (
          <div className="text-center mt-8">
            <Button
              onClick={handleLoadMore}
              variant="default"
              className="rounded-full px-6 py-2"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCart;