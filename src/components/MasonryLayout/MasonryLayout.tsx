import React from 'react';
import { IPinModel } from '@/types/pin';
import Masonry from 'react-masonry-css';
import Pin from '@/components/Pin';

interface IProps {
  pins: IPinModel[];
}

const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout: React.FC<IProps> = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointObj}>
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
