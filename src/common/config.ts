let apiUrl = "https://t.stat-track.com";
let apiUrlStaging = "https://t.stat-track-staging.com";

// check if API_URL is defined as global using webpack define plugin
if (process.env.API_URL) {
    apiUrl = process.env.API_URL;
}
if (process.env.NODE_ENV === "production") {
    apiUrl = "https://t.stat-track.com";
} else if (process.env.NODE_ENV === "stage") {
    apiUrl = "https://t.stat-track-staging.com";
}

export default {
    apiUrl,
    apiUrlStaging,
};
