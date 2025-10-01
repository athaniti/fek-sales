// Currency formatting
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '€0.00';
    return new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Date formatting
export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('el-GR');
};

// DateTime formatting
export const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('el-GR');
};

// Format time only
export const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('el-GR');
};

// Check if date is today
export const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return today.toDateString() === compareDate.toDateString();
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Generate receipt number
export const generateReceiptNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime();
    return `REC-${year}-${timestamp.toString().slice(-6)}`;
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Truncate text
export const truncateText = (text, length = 50) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
};
