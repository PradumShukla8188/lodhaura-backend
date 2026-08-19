module.exports = {
    slugify: (text) => {
        return String(text || '')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    },

    estimateReadingTime: (content) => {
        const words = String(content || '').split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    },
};
