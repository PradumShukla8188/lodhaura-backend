const cloudinary = require('cloudinary').v2;
const { config } = require('../config');

cloudinary.config({
    cloud_name: config.env.cloudinary.cloudName,
    api_key: config.env.cloudinary.apiKey,
    api_secret: config.env.cloudinary.apiSecret,
});

module.exports = {
    cloudinary,

    uploadBuffer: (buffer, options = {}) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'lodhaura', ...options },
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });
    },

    deleteResource: async (publicId, resourceType = 'image') => {
        if (!publicId) return null;
        return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    },
};
