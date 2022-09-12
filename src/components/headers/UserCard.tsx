import React, { memo } from 'react'; 

import {
  useDispatch, useSelector
} from 'react-redux'; 
import { 
  getUserState, setFirstName, setLastName, setAka
} from '../../store/slices/user/userSlice';
/**
 * A simple User card that pulls user info from redux-toolkit and displays it.
 * @constructor
 */
function UserCard() {
  const dispatch = useDispatch();
  const { firstName, lastName, aka } = useSelector(getUserState);

  const onClick = () => {
    dispatch(setAka('Young MiiN!')); 
  };
 
  return (
    <>
        <h1 className="text-3xl font-bold underline text-[violet]"> AKA : 
          <b>{aka}</b> ---- 
          <button type='button' onClick={onClick}>Change AKA Here!</button>
        </h1> 
        
    </>
  );
}

export default memo(UserCard);