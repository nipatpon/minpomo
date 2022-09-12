import React, { ReactNode } from 'react';

interface ITimePicker {
    customInput?: ReactNode | undefined;
    handleSetTime?: any;
    value?: string;
}

function getCurrentTime(){
    let d = new Date(); // for now  
    return `${d.getHours()}:${d.getMinutes()}`;
}

export default function CustomTimePicker({
    customInput,
    handleSetTime,
    value = getCurrentTime()
}: ITimePicker) { 
    const _handleChangeTime = (time: string) => {  
        handleSetTime(time); 
    }

    return (<>
        <input
            className={`
                shadow appearance-none border text-sm
                rounded w-full py-2 px-3 text-center
                cursor-pointer bg-white
            `} 
            type="time" id="appt" name="appt"
            defaultValue={value} 
            onChange={(e)=>{_handleChangeTime(e.target.value)}}
        />
    </>)
 
}
