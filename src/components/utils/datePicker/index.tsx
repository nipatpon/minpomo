import { ReactNode } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IDatePicker { 
    customInput?: ReactNode;
    handleSetDate?: any;
    dateValue?: Date;
}

export default function CustomDatePicker({
    customInput,
    handleSetDate,
    dateValue = new Date()
}: IDatePicker) { 
    return <DatePicker
        customInput={customInput}
        selected={dateValue}
        onChange={handleSetDate}
    />;
}
