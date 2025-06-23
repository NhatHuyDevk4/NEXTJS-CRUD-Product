
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { HomeIcon, ListPlus, LogIn, LogOut, ShoppingCart, SproutIcon, History } from 'lucide-react'
import ModeToggle from './ModeToggle'
import { stackServerApp } from '@/stack'
import { getUserDetails } from '@/actions/user.action'
import { UserButton } from '@stackframe/stack'
import { Badge } from "@/components/ui/badge"
const Navbar = async () => {

    const user = await stackServerApp.getUser(); // Fetch the user data from StackFrame
    const app = stackServerApp.urls; // Get the app URLs from StackFrame
    const userProfile = await getUserDetails(user?.id);
    return (
        <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'>
            <div className='max-w-7xl mx-auto px-4'>

                <div className='flex items-center justify-between h-16'>
                    {/* LOGO  */}
                    <div className='flex items-center'>
                        <Link href={'/'} className='text-xl font-bold text-primary font-mono tracking-wide'>
                            <span className='text-primary'>Assignment</span> 3
                        </Link>
                    </div>

                    {/* Navbar Component  */}

                    {/* {userProfile?.name && <span className="text-[14px] text-gray-600 dark:text-gray-300">
                        {`Hello, ${userProfile?.name.split(' ')[0]}`}
                    </span>} */}                    <div className='hidden md:flex items-center  space-x-4'>
                        <Button variant="ghost" className='flex items-center gap-2' asChild>
                            <Link href={'/product'}>
                                <ListPlus className='w-4 h-4' />
                                <span className='hidden lg:inline'>Management Product</span>
                            </Link>
                        </Button>

                        {/* Order History Button - Only show when user is logged in */}
                        {user && (
                            <Button variant="ghost" className='flex items-center gap-2' asChild>
                                <Link href={'/order-history'}>
                                    <History className='w-4 h-4' />
                                    <span className='hidden lg:inline'>Order History</span>
                                </Link>
                            </Button>
                        )}

                        {/* Home Button */}
                        <Button variant="ghost" className='flex items-center gap-2' asChild>
                            <Link href={'/'}>
                                <HomeIcon className='w-4 h-4' />
                                <span className='hidden lg:inline'>Home</span>
                            </Link>
                        </Button>

                        <ModeToggle />

                        {user ? (
                            <>
                                {/* logout Button */}
                                <Button variant="secondary" className='flex items-center gap-2' asChild>
                                    <Link href={app.signOut}>
                                        <LogOut className='w-4 h-4' />
                                        <span className='hidden lg:inline'>Sign Out</span>
                                    </Link>
                                </Button>

                                <UserButton />
                            </>
                        ) : (
                            <>
                                {/* SignIn Button */}
                                <Button variant="ghost" className='flex items-center gap-2' asChild>
                                    <Link href={app.signIn}>
                                        <LogIn className='w-4 h-4' />
                                        <span className='hidden lg:inline'>Sign In</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar

// asChild là một prop đặc biệt trong Radix UI,
// cho phép bạn sử dụng bất kỳ thành phần nào làm nút,
//  không chỉ là thẻ button. Khi bạn đặt asChild thành true,
// Radix UI sẽ sử dụng thành phần con đó thay vì tạo một thẻ button mới.
// Điều này hữu ích khi bạn muốn sử dụng các thành phần khác như Link từ Next.js hoặc thẻ a mà vẫn giữ được các tính năng của Radix UI.