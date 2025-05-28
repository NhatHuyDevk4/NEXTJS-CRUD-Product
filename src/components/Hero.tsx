import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay, GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden border-b border-accent">
            <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
                <div className="max-w-xl">
                    <Badge className="rounded-full py-1 border-none text-lg">
                        Full Stack Developer
                    </Badge>
                    <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
                        Design By
                        <br />
                        Lê Nhật Huy / QE180061
                    </h1>
                    <p className="mt-6 max-w-[60ch] xs:text-lg">
                        Cam kết mang đến những thành phần UI chất lượng cao, dễ bảo trì giúp các nhà phát triển làm việc hiệu quả. Tôi kết hợp sự sáng tạo và các thực hành tốt nhất để xây dựng giao diện vừa đẹp mắt vừa dễ sử dụng.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto rounded-full text-base"
                        >
                            Get Started <ArrowUpRight className="!h-5 !w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full text-base shadow-none"
                        >
                            <GithubIcon className="!h-5 !w-5" />
                            <Link href="https://github.com/NhatHuyDevk4">
                                Wath on GitHub
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
                    <Image
                        src="/siudz.svg"
                        alt="Ảnh minh họa"
                        className="object-cover rounded-xl"
                        fill
                    />
                </div>
            </div>
        </div >
    );
};

export default Hero;