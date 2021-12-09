requirejs.config({
    baseUrl: "js",
    paths: {
        "cannon": "https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min",
        "gl-matrix": "https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/gl-matrix-min"
    }
});

requirejs(["main"], () => { });
