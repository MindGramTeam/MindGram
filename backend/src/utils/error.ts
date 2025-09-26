export class AppError extends Error {
    constructor(public message: string, public statusCode = 400) {
        super( message);
        this.name = 'AppError';
    }
}

export class DuplicateEmailError extends AppError {
    constructor(message = '이미 사용 중인 이메일') {
        super(message, 409);
        this.name = 'DuplicateEmailError';
    }
}

export class UnaturhorizedError extends AppError {
    constructor(message = '자격 증명이 유효하지가 않습니다.') {
        super(message, 401);
        this.name = 'UnaturhorizedError';
    }
}

export class TokenExpiredError extends AppError {
    constructor(message = '토큰이 만료되었습니다.') {
        super(message, 401);
        this.name = 'TokenExpiredError';
    }
}

export class ValidationError extends AppError {
    constructor(message = '입력값이 유효하지 않습니다.') {
        super(message, 422);
        this.name = 'ValidationError';
    }
}

export class EnvValidationError extends AppError {
    constructor(message = '환경 변수 설정이 잘못되었습니다.') {
        super(message, 500); // 서버 자체 문제라서 500으로 처리
        this.name = 'EnvValidationError';
    }
}