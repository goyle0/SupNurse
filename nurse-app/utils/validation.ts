export const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
        errors.push('パスワードは8文字以上である必要があります');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('パスワードには少なくとも1つの大文字を含める必要があります');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('パスワードには少なくとも1つの小文字を含める必要があります');
    }
    if (!/\d/.test(password)) {
        errors.push('パスワードには少なくとも1つの数字を含める必要があります');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('パスワードには少なくとも1つの特殊文字を含める必要があります');
    }

    return errors;
};

export const validateEmail = (email: string): string[] => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
        errors.push('メールアドレスは必須です');
    } else if (!emailRegex.test(email)) {
        errors.push('有効なメールアドレスを入力してください');
    }

    return errors;
};

export const validateUsername = (username: string): string[] => {
    const errors: string[] = [];
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;

    if (!username) {
        errors.push('ユーザー名は必須です');
    } else {
        if (username.length < 3) {
            errors.push('ユーザー名は3文字以上である必要があります');
        }
        if (username.length > 50) {
            errors.push('ユーザー名は50文字以下である必要があります');
        }
        if (!usernameRegex.test(username)) {
            errors.push('ユーザー名には英数字、アンダースコア、ハイフンのみ使用できます');
        }
    }

    return errors;
};