// redirect.js

document.addEventListener("DOMContentLoaded", function() {
    var path = window.location.pathname;
    var fileName = path.split("/").pop(); // Get the last part of the path

    // Check if the requested file exists with a .html extension
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', fileName + '.html', false);
    xhr.send();

    if (xhr.status == 200) {
        // If the file exists, redirect to it
        window.location.href = fileName + '.html';
    }
});
