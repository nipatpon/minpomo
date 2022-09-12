interface ILoading {
    isShow?: boolean;
}

function Loading(props: ILoading) {
    const { isShow = false } = props;

    return (
        <div className={`${isShow ? 'block' : 'hidden'}`}>
            <div className={`absolute z-20 top-0 bottom-0 left-0 right-0 bg-[#000]/[0.2]`}>
                <div className="z-30 grid h-screen place-items-center text-zinc-900">
                    Pending...
                </div>
            </div>
        </div>
    )
}

export default Loading;