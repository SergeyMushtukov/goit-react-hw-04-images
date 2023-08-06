import { useState } from 'react';
import css from './Searchbar.module.css';
import PropTypes from 'prop-types';
import { ReactComponent as SearchIcon } from '../icons/search.svg';

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleQueryChange = evt => {
    setSearchQuery(evt.currentTarget.value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (searchQuery.trim() === '') {
      return;
    }
    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.searchForm} onSubmit={handleSubmit}>
        <button type="submit" className={css.searchFormButton}>
          <SearchIcon width="20" height="20" />
        </button>

        <input
          className={css.searchForminput}
          type="text"
          name="searchQuery"
          value={searchQuery}
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleQueryChange}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
