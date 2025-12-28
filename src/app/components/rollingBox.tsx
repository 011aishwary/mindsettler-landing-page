import React from 'react';

interface RollingBoxProps {
  frontText: string;
  topText: string;
  /* Accepts Tailwind classes (e.g. "bg-red-500" or "bg-gradient-to-r...") */
  frontClass?: string;
  topClass?: string;
}

const RollingBox: React.FC<RollingBoxProps> = ({
  frontText,
  topText,
  // Default gradients
  frontClass = ' bg-white mx-auto  text-center px-4  h-fit rounded-full',
  topClass = 'bg-white mx-auto  text-center px-4 py-8 h-fit rounded-full ',
}) => {
  return (
    // SCENE: Outer container with perspective
    // h-16 is 4rem (64px). If you change this height, update the '2rem' below.
    <div className="group h-16 w-full  cursor-pointer  [perspective:1000px]">
      
      {/* BOX: The 3D container that rotates */}
      <div className="relative h-full w-screen flex items-center justify-center self-center mx-auto transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] [transform-style:preserve-3d] group-hover:[transform:rotateX(-90deg)]">
        
        {/* FRONT FACE */}
        {/* translateZ is 2rem (half of h-16) */}
        <div className={`absolute flex h-full min-w-[60vw] w-fit max-w-[90vw] items-center justify-center border border-black/10 text-lg font-bold text-Primary-purple  [backface-visibility:hidden] [transform:translateZ(2rem)] ${frontClass}`}>
          {frontText}
        </div>

        {/* TOP FACE */}
        {/* Rotated 90deg and pushed up by 2rem */}
            <div className={`absolute flex h-full min-w-[60vw] w-fit max-w-[90vw] items-center justify-center border border-black/10 text-md  text-gray-700 shadow-lg [backface-visibility:hidden] [transform:rotateX(90deg)_translateZ(2rem)] ${topClass}`}>
            {topText}
        </div>
        
      </div>
    </div>
  );
};

export default RollingBox;