// let PFPhone = "http://192.168.43.115:3000/";
export const PF =
  import.meta.env.VITE_PUBLIC_FOLDER || "http://localhost:3000/";

export const API_URL = import.meta.env.VITE_API_URL;

const CLOUDINARY_API_URL = import.meta.env.VITE_CLOUDINARY_API;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_API = {
  upload: `${CLOUDINARY_API_URL}/${CLOUDINARY_CLOUD_NAME}/upload`,
};

export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;
