import React from 'react';
import { cn } from '../../lib/utils';

const Section = ({ 
  id, 
  className = '', 
  containerClassName = '',
  children 
}) => {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;