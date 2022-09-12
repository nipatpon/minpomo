
import React from 'react';

interface IFooter {
    children?: React.ReactNode;
}

export default function Footer({ children }: IFooter) {
    return ( 
        <div className={`flex flex-col py-2`}>
            {children}
        </div> 
    )
}