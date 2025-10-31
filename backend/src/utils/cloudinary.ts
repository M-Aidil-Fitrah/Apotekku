import cloudinary from 'cloudinary';

const v2 = cloudinary.v2;

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export const uploader = v2.uploader;

export const uploadBuffer = (buffer: Buffer, options: cloudinary.UploadApiOptions = {}) => {
  return new Promise<any>((resolve, reject) => {
    const stream = v2.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    stream.end(buffer);
  });
};

export default v2;
