export const convertToDate = (date) => {
    const d = new Date(date);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
};

export const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);
    const months = Math.floor(diffInSeconds / 2592000); // Approx.
    const years = Math.floor(diffInSeconds / 31536000); // Approx.

    if (diffInSeconds < 60) return `${diffInSeconds}s `;
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    if (weeks < 4) return `${weeks}w`;
    if (months < 12) return `${months}mo`;
    return `${years}y`;
};
