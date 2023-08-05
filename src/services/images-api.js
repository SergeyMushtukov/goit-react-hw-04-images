import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '37443859-819820d616605921c7289dca4';

async function fetchImages({ whatToSearch, pageNumber, perPage }) {
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: whatToSearch,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: perPage,
    page: pageNumber,
  });

  const response = await axios.get(`${URL}?${searchParams}`);
  if (response.data.totalHits > 0) {
    return response.data;
  }
  return Promise.reject(
    new Error(`
  There are no images for this request: ${whatToSearch}`)
  );
}

const api = {
  fetchImages,
};

export default api;
