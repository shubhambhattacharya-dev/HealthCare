import { getDoctorsBySpecialty } from '@/actions/doctorListing';
import PageHeader from '@/components/pageHeader';
import { redirect } from 'next/navigation'; 
import DoctorCard from '@/components/doctorCard';
import React from 'react';

const SpecialityPage = async ({ params }) => {
  const { speciality } = await params;

  if (!speciality) {
    redirect('/doctors');
  }

  // Handle URL encoding, plus-signs, and trailing spaces
  const specialityLabel = decodeURIComponent(speciality).replace(/\+/g, ' ').trim();
  const { doctors, error } = await getDoctorsBySpecialty(specialityLabel);

  if (error) {
    console.error("Error fetching doctors:", error);
    redirect("/doctors"); 
  }


  return (
    <div className='space-y-6'>
      <PageHeader
        title={specialityLabel}
        backLink="/doctors"
        backLabel="All Specialities"
      />

      {doctors && doctors.length > 0 ? (
        <>
          {/* Result count badge */}
          <p className='text-sm text-muted-foreground'>
            Showing{' '}
            <span className='text-emerald-400 font-semibold'>{doctors.length}</span>{' '}
            verified doctor{doctors.length !== 1 ? 's' : ''} in{' '}
            <span className='text-white font-medium'>{specialityLabel}</span>
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} /> 
            ))}
          </div>
        </>
      ) : (
        
        <div className='flex flex-col items-center justify-center py-20 text-center border border-emerald-900/20 rounded-2xl bg-white/[0.02]'>
          <div className='w-16 h-16 rounded-2xl bg-emerald-900/20 border border-emerald-800/30 flex items-center justify-center mb-5'>
            <svg className='w-7 h-7 text-emerald-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}
                d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-white mb-2'>No Doctors Available</h3>
          <p className='text-muted-foreground text-sm max-w-sm leading-relaxed'>
            There are currently no verified doctors in{' '}
            <span className='text-emerald-400'>{specialityLabel}</span>.
            Please check back later or choose another speciality.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpecialityPage;