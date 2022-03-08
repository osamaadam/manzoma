import { createSlice } from "@reduxjs/toolkit";

interface GlobalStateType {
  marhla: number;
  weaponId: number;
}

const initialState: GlobalStateType = {
  marhla: 20221,
  weaponId: 16,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    selectMarhla: (state, action: { payload: number }) => {
      state.marhla = action.payload;
    },
    selectWeaponId: (state, action: { payload: number }) => {
      state.weaponId = action.payload;
    },
  },
});

export const { selectMarhla } = globalSlice.actions;

export default globalSlice.reducer;
