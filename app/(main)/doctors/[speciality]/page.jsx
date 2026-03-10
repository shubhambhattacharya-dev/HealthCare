import PageHeader from '@/components/pageHeader';
import React from 'react';

const SpecialityPage = async ({ params }) => {
  const { speciality } = await params; // 

  return (
    <div>
      <PageHeader
        title={speciality ? decodeURIComponent(speciality) : 'Speciality'} 
        backLink="/doctors"
        backLabel="All Specialities"
      />
    </div>
  );
};

export default SpecialityPage;