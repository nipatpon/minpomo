import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { appModalState } from '../../store/slices/app-modal/app-modal.slice';


import ConfirmModal from './confirm';
import TaskForm from './taskForm';

const AppModal = () => {

    const appModal: appModalState = useAppSelector(
        state => state.appModal
    )

    const dispatch = useAppDispatch();

    let Component: any;
    let ComponentProps: Object = appModal;

    switch (appModal.type) {
        case 'confirm':
            Component = ConfirmModal; 
            break;
        case 'task_form':
            Component = TaskForm; 
            break;
        default:
            break;
    }


    return (
        (appModal.isVisible) ?
            <Component
                {...ComponentProps}

            /> :
            null
    )
}

export default AppModal;