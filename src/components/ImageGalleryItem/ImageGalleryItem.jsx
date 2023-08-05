import PropTypes from 'prop-types';
import css from './ImageGalleryItem.module.css';

export const ImageGalleryItem = ({ picture, largePicture, onImageClick }) => {
  return (
    <li
      className={css.imageGalleryItem}
      onClick={() => onImageClick(largePicture)}
    >
      <img src={picture} className={css.imageGalleryItemImage} alt="" />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  picture: PropTypes.string.isRequired,
  largePicture: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
};
