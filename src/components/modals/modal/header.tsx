
import React from 'react';

interface IHeader {
    children?: React.ReactNode;
}

export default function Header({ children }: IHeader) {
    return (
        <div className={`flex flex-col py-4`}>
            {children}
        </div>
    )
}