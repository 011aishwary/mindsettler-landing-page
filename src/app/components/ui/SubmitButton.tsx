import React from 'react'
import { Button } from './Button'
import Image from 'next/image'

interface buttonProps {
    isLoading: boolean,
    className?: string,
    children?: React.ReactNode,
}

const SubmitButton = ( {isLoading , className , children} : buttonProps ) => {
  return (
    <Button
      type="submit"
      className={className ?? 'bg-purple2 w-full text-white hover:bg-purple2/80 hover:scale-98'}
        disabled={isLoading}
    
    >
        {isLoading ? (
            <div className="flex items-center gap-4 ">
                <Image
                    src="/assets/loader.svg"
                    alt="loader"
                    width={20}
                    height={20}
                    // className="animate-spin"
                />
                Loading...
            </div>
        ) : children}
        

    </Button>
  )
}

export default SubmitButton
