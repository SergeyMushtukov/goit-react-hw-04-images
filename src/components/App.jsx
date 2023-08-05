import { Component } from 'react';
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

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    error: null,
    status: Status.IDLE,
    showButton: false,
    showModal: false,
    largePicture: '',
  };

  handleFormSubmit = searchQuery => {
    this.setState({ searchQuery });
  };

  handleQuery = async () => {
    try {
      const data = await imageAPI.fetchImages({
        whatToSearch: this.state.searchQuery,
        pageNumber: page,
        perPage: pageLimit,
      });
      const itemsForRender = data.hits;
      const totalItems = data.totalHits;
      const totalPage = Math.ceil(totalItems / pageLimit);
      this.setState(prevState => ({
        images: [...prevState.images, ...itemsForRender],
        status: Status.RESOLVED,
        error: null,
      }));
      if (page < totalPage) {
        this.setState({ showButton: true });
        page += 1;
      } else {
        this.setState({ showButton: false });
      }
    } catch (error) {
      this.setState({ error, status: Status.REJECTED, showButton: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevState.searchQuery;
    const nextQuery = this.state.searchQuery;

    if (prevQuery !== nextQuery) {
      page = 1;
      this.setState({ images: [], status: Status.PENDING, showButton: false });
      this.handleQuery();
    }
  }

  handleButtonClick = () => {
    this.setState({ status: Status.PENDING, showButton: false });
    this.handleQuery();
  };

  handleImageGaleryItemClick = largePicture => {
    this.setState({ largePicture });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { images, error, status, showButton, showModal, largePicture } =
      this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.handleFormSubmit} />

        {status === 'resolved' && (
          <ImageGallery
            images={images}
            onImageClick={this.handleImageGaleryItemClick}
          />
        )}

        {showButton && <Button onButton={this.handleButtonClick} />}

        {status === 'pending' && <Loader />}

        {status === 'rejected' && <p>{error.message}</p>}

        {showModal && (
          <Modal onClose={this.toggleModal} largePicture={largePicture} />
        )}
      </div>
    );
  }
}
