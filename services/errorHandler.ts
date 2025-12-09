// Error handler service - kullanıcıya hata göstermek için
// App.tsx'teki showAlert fonksiyonunu kullanman gerekir

export const handleError = (error: any, userMessage?: string): string => {
    console.error('Error:', error);

    // Error message'ı döndür, çağıran yer showAlert yapabilir
    const message = userMessage ||
        error.message ||
        'Bir hata oluştu. Lütfen tekrar deneyin.';

    // Opsiyonel: Sentry/LogRocket gibi servise gönder
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error);
    // }

    return message;
};