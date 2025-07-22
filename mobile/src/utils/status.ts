const STATUS_COLOR_MAP: Record<string, string> = {
    draft: '#fef9c3',
    sent: '#E8F5E9',
    approved: 'green',
    rejected: 'red',
};

export const getStatusColor = (status: string): string =>
    STATUS_COLOR_MAP[status.toLowerCase()] ?? 'black';