"use client";

import { useState } from "react";
import Image from "next/image";

const ImagePreview = ({ imageUrl }: { imageUrl: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Ảnh nhỏ dùng next/image */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer w-full h-full relative">
                <Image
                    src={imageUrl}
                    alt="Plant preview"
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    width={150}
                    
                />
            </div>

            {/* Modal toàn màn hình dùng img thường */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
                    onClick={() => setIsOpen(false)}
                >
                    <img
                        src={imageUrl}
                        alt="Full preview"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        onClick={() => setIsOpen(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    );
};

export default ImagePreview;
