export const validateEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validatePhoneNumber = /^010[0-9]{8}$/;

// 8~14자리의 영문(대소문자 포함) + 숫자 + 특수문자.
export const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!-~])[a-zA-Z\d!-~]{8,14}$/;

export const regexThousandFilter = /\B(?=(\d{3})+(?!\d))/g;
