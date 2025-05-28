import { getProducts } from '@/actions/product.action';
import InventoryTable from '@/components/InventoryTable';
import { stackServerApp } from '@/stack'
import { SignUp } from '@stackframe/stack';


const page = async () => {
    
    const user = await stackServerApp.getUser();
    const app = stackServerApp.urls; // Get the app URLs from StackFrame


    const products = await getProducts();

    return (
        <>
            {user ? (
                <div className='mt-7 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-10 gap-6'>
                    <div className='lg:col-span-full'>
                        <InventoryTable products={products} />
                    </div>
                </div>
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    <SignUp />
                </div>
            )}
        </>
    )
}

export default page