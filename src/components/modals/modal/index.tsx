
import React from 'react';

import Header from './header';
import Body from './body';
import Footer from './footer';

interface IModal {
    children?: React.ReactNode;
}

function Modal({ children }: IModal) {
    return (
        <>
            <div className={`bg-zinc-500 opacity-30 fixed left-0 top-0 z-10 w-full h-[100vh]`} />
            <div className={`fixed -translate-x-1/2 -translate-y-1/2 z-20 top-[50%] left-[50%]`} >

                <div className={`bg-white flex flex-col p-4 rounded-md min-w-[240px]`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export { Modal, Header, Body, Footer }