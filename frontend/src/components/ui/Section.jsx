import React from 'react';
import { cn } from '../../lib/utils';

const Section = ({ 
  id, 
  className = '', 
  containerClassName = '',
  children 
}) => {
  return (
    // scroll-mt only matters (and only applies any spacing) when this
    // section is actually an anchor-jump target - clears the floating nav
    // (~64-80px tall) so e.g. #why-us doesn't land with its heading tucked
    // under the navbar on hash navigation (see Home.jsx's hash-scroll
    // effect and Header.jsx's /#why-us, /#packages links).
    <section id={id} className={cn('py-16 md:py-24', id && 'scroll-mt-24', className)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;