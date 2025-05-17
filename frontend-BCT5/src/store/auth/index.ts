// store/auth/index.ts
export { default as loginReducer, login, logout as logoutLogin } from './loginSlice';
export { default as registerReducer, register, login as registerLogin, logout as logoutRegister } from './registerSlice';
