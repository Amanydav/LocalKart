import React from 'react';
import ServicePageLayout from '../ServicePageLayout';

const pestControlImages = [
  'https://img.freepik.com/free-vector/worker-pest-control-service-with-professional-equipment-domestic-disinfection-from-rodents-isometric-vector-illustration_1284-30235.jpg?semt=ais_hybrid&w=740',
  'https://img.freepik.com/premium-vector/pest-control-design-illustration-pest-control-service-vector_278713-464.jpg?semt=ais_hybrid',
  'https://img.freepik.com/premium-vector/exterminator-spraying-insecticide-pest-control_8071-32341.jpg?semt=ais_hybrid',
  'https://img.freepik.com/free-vector/home-pest-insects-control-abstract-concept-illustration-pest-insects-control-vermin-exterminator-service-insect-thrips-equipment-diy-solution-home-garden-protection_335657-215.jpg?semt=ais_hybrid&w=740',
];

const PestControl = () => (
  <ServicePageLayout
    title="Pest Control"
    description="Safe and effective pest control solutions to eliminate insects, rodents, and termites."
    images={pestControlImages}
    features={[
      'Cockroach & Ant Control',
      'Rodent Treatment',
      'Termite Solutions',
      'Child & Pet Safe Chemicals',
    ]}
    serviceName="Pest Control"
  />
);

export default PestControl;
