'use client';
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";



export default function ModeToggle() {
    const { theme, setTheme } = useTheme();


    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <SunIcon className="h-[1.2rem] ww-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 " />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
        </Button>
    )
}