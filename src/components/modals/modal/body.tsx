
import React from 'react';

interface IBody {
    children?: React.ReactNode;
}

export default function Body({ children }: IBody) {
    return (
        <div className={`flex flex-col py-1`}>
            {children}
        </div>
    )
}