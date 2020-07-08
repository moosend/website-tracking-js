let apiUrl = "https://t.stat-track.com";
let apiUrlStaging = "https://t.stat-track-staging.com/";
let formsUrlStaging = "https://forms.moooo.co/api/forms/";
let formUrlStaging = "https://forms.moooo.co/api/form/";

// check if API_URL is defined as global using webpack define plugin
if (process.env.API_URL) {
    apiUrl = process.env.API_URL;
}

export default {
    apiUrl,
    apiUrlStaging,
    formsUrlStaging,
    formUrlStaging
};
