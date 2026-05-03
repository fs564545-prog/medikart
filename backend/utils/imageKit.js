import { ApiError } from './ApiError.js';

// Mock implementation of ImageKit upload
const uploadImage = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            if (!fileBuffer) {
                return reject(new ApiError(400, "No file provided for upload"));
            }
            
            // Return a mock ImageKit response
            resolve({
                fileId: `mock_id_${Date.now()}`,
                name: fileName,
                url: `https://mock.imagekit.io/medico/${fileName}`,
                thumbnailUrl: `https://mock.imagekit.io/medico/tr:w-200/${fileName}`
            });
        }, 1000);
    });
};

export { uploadImage };
