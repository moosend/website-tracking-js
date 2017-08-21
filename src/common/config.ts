let apiUrl = "https://t.stat-track.com";

// check if API_URL is defined as global using webpack define plugin
if (process.env.API_URL) {
    apiUrl = process.env.API_URL;
}

export default {
    apiUrl,
};
