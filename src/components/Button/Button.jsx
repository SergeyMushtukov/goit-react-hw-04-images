import PropTypes from 'prop-types';
import css from './Button.module.css';

export const Button = ({ onButton }) => {
  return (
    <button type="button" className={css.button} onClick={onButton}>
      Load more
    </button>
  );
};

Button.propTypes = {
  onButton: PropTypes.func.isRequired,
};
