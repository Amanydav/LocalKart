import React from 'react';
import ServicePageLayout from '../ServicePageLayout';

const groceriesImages = [
 'https://thumbs.dreamstime.com/b/groceries-delivery-man-green-uniform-food-box-hands-130686606.jpg',
 'https://img.freepik.com/free-photo/woman-checking-her-delivery-groceries_23-2149950085.jpg?semt=ais_hybrid&w=740',
 'https://img.freepik.com/free-photo/young-woman-buys-groceries-supermarket-with-phone-her-hands_169016-5030.jpg?semt=ais_hybrid&w=740',
 'https://static.vecteezy.com/system/resources/thumbnails/025/500/459/small/shopping-cart-full-of-groceries-in-a-supermarket-shallow-depth-of-field-groceries-in-a-shopping-cart-inside-a-blurry-supermarket-ai-generated-free-photo.jpg',
];

const Groceries = () => (
  <ServicePageLayout
    title="Groceries"
    description="Order fresh groceries, vegetables, and essentials delivered to your doorstep quickly."
    images={groceriesImages}
    features={[
      'Daily Essentials Delivery',
      'Fresh Vegetables & Fruits',
      'Contactless Payments',
      'Scheduled Delivery Options',
    ]}
    serviceName="Groceries"
  />
);

export default Groceries;
