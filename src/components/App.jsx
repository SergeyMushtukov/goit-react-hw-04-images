import { useState, useEffect, useRef } from 'react';
import css from './App.module.css';
import imageAPI from '../services/images-api';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

let page = 1;
const pageLimit = 12;

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largePicture, setLargePicture] = useState('');

  const handleFormSubmit = searchQuery => {
    setSearchQuery(searchQuery);
  };

  const handleQuery = useRef(async searchQuery => {
    try {
      const data = await imageAPI.fetchImages({
        whatToSearch: searchQuery,
        pageNumber: page,
        perPage: pageLimit,
      });
      const itemsForRender = data.hits;
      const totalItems = data.totalHits;
      const totalPage = Math.ceil(totalItems / pageLimit);

      setImages(state => [...state, ...itemsForRender]);
      setStatus(Status.RESOLVED);
      setError(null);

      if (page < totalPage) {
        setShowButton(true);
        page += 1;
      } else {
        setShowButton(false);
      }
    } catch (error) {
      setError(error);
      setStatus(Status.REJECTED);
      setShowButton(false);
    }
  });

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    page = 1;
    setImages([]);
    setStatus(Status.PENDING);
    setShowButton(false);
    handleQuery.current(searchQuery);
  }, [searchQuery]);

  const handleButtonClick = () => {
    setStatus(Status.PENDING);
    setShowButton(false);
    handleQuery.current(searchQuery);
  };

  const handleImageGaleryItemClick = largePicture => {
    setLargePicture(largePicture);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(state => !state);
  };

  return (
    <div className={css.app}>
      <Searchbar onSubmit={handleFormSubmit} />

      {status === Status.RESOLVED && (
        <ImageGallery
          images={images}
          onImageClick={handleImageGaleryItemClick}
        />
      )}

      {showButton && <Button onButton={handleButtonClick} />}

      {status === Status.PENDING && <Loader />}

      {status === Status.REJECTED && <p>{error.message}</p>}

      {showModal && <Modal onClose={toggleModal} largePicture={largePicture} />}
    </div>
  );
};
