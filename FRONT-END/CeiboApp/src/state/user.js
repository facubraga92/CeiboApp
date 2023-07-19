import { createAction, createReducer } from "@reduxjs/toolkit";

export const setUser = createAction("SET_USER");
export const setGoogleUser = createAction("SET_GOOGLE_USER");

export const userInitialState = {
  id: null,
  name: null,
  lastName: null,
  email: null,
  role: null,
  associatedCustomers: null,
};

export const userReducer = createReducer(userInitialState, (builder) => {
  builder
    .addCase(setUser, (state, action) => action.payload)
    .addCase(setGoogleUser, (state, action) => {
      return {
        id: action.payload.jti,
        name: action.payload.given_name,
        lastName: action.payload.family_name,
        email: action.payload.email,
        role: "socio",
        associatedCustomers: null,
      };
    });
});
