import React from 'react'
import PasskeyModal from '../../components/PasskeyModal';


const Admin = async ({ params }: { params: Promise<{ permission: string }> }) => {
    const {permission}  = await params;
    const isAdmin = permission === 'true';


    return (
        <div className=''>
            {isAdmin && (
                <PasskeyModal />
            )}
            {!isAdmin && (
                <h1>Access Denied. You do not have admin permissions.</h1>
            )}

        </div>
    )
}

export default Admin