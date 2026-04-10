function normalizeYoutubeUrl(url) {
    // Handle shorts
    if (url.includes('/shorts/')) {
        const parts = url.split('/shorts/');
        const idPart = parts[1].split(/[?&]/)[0];
        return `https://www.youtube.com/watch?v=${idPart}`;
    }
    return url;
}

const url = "https://youtube.com/shorts/I29peidTQxU?si=dKDYfoPNEbenKhY5";
console.log("Normalized:", normalizeYoutubeUrl(url));
