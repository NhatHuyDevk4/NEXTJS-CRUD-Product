'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button'
import { getCartQuantity } from '@/actions/cartActions';
import { HomeIcon, ListPlus, LogIn, LogOut, ShoppingCart, SproutIcon, } from 'lucide-react'
import { UserButton } from '@stackframe/stack';
import ModeToggle from './ModeToggle';
import CartIcon from './CartIcon';

type Props = {
    user: any;
    userProfile: any;
    app: { signIn: string; signOut: string };
};

const ClientNavbar = ({ user, userProfile, app }: Props) => {
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        getCartQuantity().then(setQuantity).catch(() => setQuantity(0));
    }, []);

    return (
        <nav className='sticky top-0 w-full border-b bg-background/95 backdrop-blur z-50'>
            <div className='max-w-7xl mx-auto px-4 flex items-center justify-between h-16'>
                <Link href='/' className='text-xl font-bold text-primary font-mono'>
                    <span className='text-primary'>Assignment</span> 1
                </Link>

                <div className='hidden md:flex items-center space-x-4'>
                    <Button variant="ghost" asChild>
                        <Link href='/product'><ListPlus size={18} /> <span className='hidden lg:inline'>Product</span></Link>
                    </Button>

                    <Button variant="ghost" asChild>
                        <Link href='/'>
                            <HomeIcon size={18} /> <span className='hidden lg:inline'>Home</span>
                        </Link>
                    </Button>

                    <CartIcon />

                    <ModeToggle />

                    {user ? (
                        <>
                            <Button variant="secondary" asChild>
                                <Link href={app.signOut}><LogOut size={16} /> <span className='hidden lg:inline'>Sign Out</span></Link>
                            </Button>
                            <UserButton />
                        </>
                    ) : (
                        <Button variant="ghost" asChild>
                            <Link href={app.signIn}><LogIn size={16} /> <span className='hidden lg:inline'>Sign In</span></Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default ClientNavbar;
