import React from 'react';

interface IProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<IProps> = () => {
  return <div>Search</div>;
};

export default Search;
