import React from 'react';
import CategoryGrid from './index';

export default { title: 'Molecules|CategoryGrid' };

const categories = [
  { name: 'Trucks', image: '/static/images/category/Trucks.svg', url: '#' },
  { name: 'Buses', image: '/static/images/category/Buses.svg', url: '#' },
  { name: 'PUP', image: '/static/images/category/PUP.svg', url: '#' },
  { name: 'PPV/SUV', image: '/static/images/category/PPV.svg', url: '#' },
  { name: 'P-Car', image: '/static/images/category/P-car.svg', url: '#' },
  { name: 'Construction & heavy machinery', image: '/static/images/category/Construction.svg', url: '#' },
  { name: 'Agriculture machinery', image: '/static/images/category/Agriculture.svg', url: '#' },
  { name: 'Boats', image: '/static/images/category/Boats.svg', url: '#' },
  { name: 'Parts', image: '/static/images/category/Parts.svg', url: '#' },
  { name: 'Tires', image: '/static/images/category/Tires.svg', url: '#' },
];

export const Standard = () => <CategoryGrid categories={categories} />;
