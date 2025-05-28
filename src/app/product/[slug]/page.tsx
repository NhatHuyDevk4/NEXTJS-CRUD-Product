"use client";
import { getproductById } from '@/actions/product.action';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation'
import React from 'react'
import ProductDetail from './ProductDetail';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const page = () => {
    const { slug } = useParams();
    const slugStr = Array.isArray(slug) ? slug[0] : slug;
    const idProduct = slugStr ? slugStr.split('--')[0] : '';

    const { data, isLoading } = useQuery({
        queryKey: ['product', idProduct],
        queryFn: () => getproductById(idProduct),
    })


    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <ProductDetail product={data ?? null} />
    )
}

export default page