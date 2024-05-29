import http from '../../utils/http-common';

const controller = 'file';

const uploadFileAsync = data => {
  return http.post(`/${controller}/upload`, data);
};

const getBase64Image = url => {
  return http.get(`/${controller}/get-base64-image?url=${url}`);
};

const fileDataService = {
  uploadFileAsync,
  getBase64Image
};

export default fileDataService;
