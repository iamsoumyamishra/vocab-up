import Sidebar from '@/components/Sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const MainLayout = async ({ children }: LayoutProps<"/">) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in")
    }

    return (
        <div className='flex h-full overflow-hidden'>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="main flex-1 p-3 overflow-x-auto">
                {children}
            </div>
        </div>
    )
}

export default MainLayout
