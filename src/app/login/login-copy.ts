import type { Locale } from '@/lib/i18n/config'

export type LoginCopy = {
  homeAria: string
  welcome: string
  welcomeSupporting: string
  signup: string
  signupSupporting: string
  google: string
  divider: string
  email: string
  password: string
  signIn: string
  createAccount: string
  forgotPassword: string
  newAccount: string
  existingAccount: string
  back: string
  pathwayAria: string
  savePathway: string
  notices: {
    enterEmailFirst: string
    resetEmailSent: string
    signupConfirmation: string
  }
  errors: {
    generic: string
    invalidCredentials: string
    emailNotConfirmed: string
    userAlreadyExists: string
    weakPassword: string
    rateLimited: string
    invalidEmail: string
    signupDisabled: string
  }
}

export const LOGIN_COPY = {
  en: {
    homeAria: 'CampCareer home',
    welcome: 'Welcome back',
    welcomeSupporting: 'Sign in to save your pathway',
    signup: 'Create account',
    signupSupporting: 'Start exploring for free',
    google: 'Continue with Google',
    divider: 'or continue with email',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    createAccount: 'Create an account',
    forgotPassword: 'Forgot password?',
    newAccount: 'New to CampCareer?',
    existingAccount: 'Already have an account?',
    back: 'Back to your pathway',
    pathwayAria: 'Pathway to save',
    savePathway: 'Save this pathway',
    notices: {
      enterEmailFirst: 'Enter your email first',
      resetEmailSent: 'Password reset email sent!',
      signupConfirmation: 'Check your email to confirm your account!',
    },
    errors: {
      generic: 'Something went wrong. Please try again.',
      invalidCredentials: 'The email or password is incorrect.',
      emailNotConfirmed: 'Confirm your email before signing in.',
      userAlreadyExists: 'An account with this email already exists. Sign in or reset your password.',
      weakPassword: 'Please use a stronger password and try again.',
      rateLimited: 'Too many requests. Please wait a moment and try again.',
      invalidEmail: 'Enter a valid email address.',
      signupDisabled: 'New account creation is currently unavailable.',
    },
  },
  ko: {
    homeAria: 'CampCareer 홈',
    welcome: '다시 오신 것을 환영해요',
    welcomeSupporting: '로그인하고 내 커리어 경로를 저장하세요',
    signup: '계정 만들기',
    signupSupporting: '무료로 커리어 탐색을 시작하세요',
    google: 'Google로 계속하기',
    divider: '또는 이메일로 계속하기',
    email: '이메일',
    password: '비밀번호',
    signIn: '로그인',
    createAccount: '계정 만들기',
    forgotPassword: '비밀번호를 잊으셨나요?',
    newAccount: 'CampCareer가 처음이신가요?',
    existingAccount: '이미 계정이 있으신가요?',
    back: '내 경로로 돌아가기',
    pathwayAria: '저장할 커리어 경로',
    savePathway: '이 경로 저장하기',
    notices: {
      enterEmailFirst: '먼저 이메일을 입력해 주세요.',
      resetEmailSent: '비밀번호 재설정 이메일을 보냈습니다.',
      signupConfirmation: '계정 확인을 위해 이메일을 확인해 주세요.',
    },
    errors: {
      generic: '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
      emailNotConfirmed: '이메일 인증을 완료한 뒤 다시 로그인해 주세요.',
      userAlreadyExists: '이미 등록된 이메일입니다. 로그인하거나 비밀번호를 재설정해 주세요.',
      weakPassword: '더 안전한 비밀번호를 사용해 주세요.',
      rateLimited: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
      invalidEmail: '올바른 이메일 주소를 입력해 주세요.',
      signupDisabled: '현재 새 계정을 만들 수 없습니다.',
    },
  },
} satisfies Record<Locale, LoginCopy>
