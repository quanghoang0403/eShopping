import http from '../../utils/http-common';

const controller = 'file';

const uploadFileAsync = data => {
  return http.post(`/${controller}/upload`, data);
};

const uploadMultipleFileAsync = data => {
  return http.post(`/${controller}/upload-multiple`, data);
};

const getBase64Image = url => {
  return http.get(`/${controller}/get-base64-image?url=${url}`);
};

const fileDataService = {
  uploadFileAsync,
  uploadMultipleFileAsync,
  getBase64Image
};

export default fileDataService;
