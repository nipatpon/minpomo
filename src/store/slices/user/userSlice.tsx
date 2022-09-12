import { 
    createSlice, 
    Draft, 
    PayloadAction 
} from '@reduxjs/toolkit';

export interface UserState {
  firstName: string;
  lastName: string;
  aka?: string;
}

/**
 * Default state with initial values.
 */
const initialState: UserState = {
  firstName: 'Nipatpon', 
  lastName: 'C', 
  aka: 'NC'
} as const;

/**
 * Create a slice as a reducer containing actions.
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFirstName: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.firstName>
    ) => {
      state.firstName = action.payload;
    },
    setLastName: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.lastName>
    ) => {
      state.lastName = action.payload;
    },
    setAka: (
      state: Draft<typeof initialState>,
      action: PayloadAction<typeof initialState.aka>
    ) => {
      state.aka = action.payload;
    },
  },
});

// A small helper of user state for `useSelector` function.
export const getUserState = (state: { user: UserState }) => state.user;

// Exports all actions
export const { 
  setFirstName, 
  setLastName, 
  setAka 
} = userSlice.actions;

export default userSlice.reducer;