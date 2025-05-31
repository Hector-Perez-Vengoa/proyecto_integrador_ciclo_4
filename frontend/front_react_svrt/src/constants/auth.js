// src/constants/auth.js
export const AUTH_CONFIG = {
  BACKEND_URL: 'http://127.0.0.1:8080/api',
  TECSUP_DOMAIN: '@tecsup.edu.pe',
  TOKEN_KEY: 'authToken',
  USER_KEY: 'user',
  GOOGLE_CREDENTIAL_KEY: 'googleCredential'
};

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  GOOGLE: '/auth/google',
  PASSWORD: '/auth/password',
  TEST: '/auth/test'
};

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  REQUIRED_DOMAIN: '@tecsup.edu.pe'
};