const cloudinary = require('../config/cloudinaryConfig');

const getBase64 = (fileBuffer, mimeType) => {
  return `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const uploaded = await cloudinary.uploader.upload(getBase64(req.file.buffer, req.file.mimetype), {
      folder: 'holly-zolly',
    });

    return res.status(201).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      data: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      },
    });
  } catch (error) {
    console.error('CLOUDINARY UPLOAD ERROR:', error);
    return res.status(500).json({ success: false, message: 'Cloudinary upload failed', error: error.message });
  }
};
