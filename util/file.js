// const path = require("path");
const fs = require("fs");
exports.clearImage = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw err;
        }
    });
};