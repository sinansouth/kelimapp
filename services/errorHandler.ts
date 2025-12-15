// Error handler service - kullanıcıya hata göstermek için
// App.tsx'teki showAlert fonksiyonunu kullanman gerekir

export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTHENTICATION = 'AUTHENTICATION',
    VALIDATION = 'VALIDATION',
    DATABASE = 'DATABASE',
    UNKNOWN = 'UNKNOWN'
}

export class AppError extends Error {
    constructor(
        message: string,
        public type: ErrorType = ErrorType.UNKNOWN,
        public originalError?: Error,
        public context?: Record<string, any>
    ) {
        super(message);
        this.name = 'AppError';
        
        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export const handleError = (error: any, userMessage?: string, context?: Record<string, any>): AppError => {
    let errorType: ErrorType = ErrorType.UNKNOWN;
    let errorMessage: string;
    let originalError: Error | undefined;

    // Determine error type and message
    if (error instanceof AppError) {
        // Already an AppError, just return it
        return error;
    } else if (error instanceof Error) {
        originalError = error;
        
        // Try to determine error type from message
        if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('timeout')) {
            errorType = ErrorType.NETWORK;
        } else if (error.message.includes('auth') || error.message.includes('login') || error.message.includes('token')) {
            errorType = ErrorType.AUTHENTICATION;
        } else if (error.message.includes('validation') || error.message.includes('invalid')) {
            errorType = ErrorType.VALIDATION;
        } else if (error.message.includes('database') || error.message.includes('supabase') || error.message.includes('table')) {
            errorType = ErrorType.DATABASE;
        }
        
        errorMessage = error.message;
    } else {
        errorMessage = typeof error === 'string' ? error : 'Unknown error occurred';
    }

    // Use user-provided message if available
    const finalMessage = userMessage || errorMessage || 'Bir hata oluştu. Lütfen tekrar deneyin.';

    // Log the error
    console.error(`[${ErrorType[errorType]}] ${finalMessage}`, {
        originalError,
        context,
        timestamp: new Date().toISOString()
    });

    // Opsiyonel: Sentry/LogRocket gibi servise gönder
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: context });
    // }

    return new AppError(finalMessage, errorType, originalError, context);
};

/**
 * Creates a standardized error handler for async operations
 * @param operationName Name of the operation for logging
 * @param showAlert Function to show user alerts
 */
export const createErrorHandler = (operationName: string, showAlert?: (title: string, message: string, type: 'error' | 'warning' | 'info') => void) => {
    return (error: any) => {
        const appError = handleError(error, undefined, { operation: operationName });
        
        // Show user-friendly message
        if (showAlert) {
            let title = 'Hata';
            let alertType: 'error' | 'warning' | 'info' = 'error';
            
            switch (appError.type) {
                case ErrorType.NETWORK:
                    title = 'Bağlantı Hatası';
                    break;
                case ErrorType.AUTHENTICATION:
                    title = 'Kimlik Doğrulama Hatası';
                    break;
                case ErrorType.VALIDATION:
                    title = 'Geçersiz Veri';
                    alertType = 'warning';
                    break;
                case ErrorType.DATABASE:
                    title = 'Veri Hatası';
                    break;
            }
            
            showAlert(title, appError.message, alertType);
        }
        
        return appError;
    };
};