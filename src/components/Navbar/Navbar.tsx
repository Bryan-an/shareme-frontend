import React from 'react';

interface IProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<IProps> = () => {
  return <div>Navbar</div>;
};

export default Navbar;
