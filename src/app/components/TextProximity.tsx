import { useRef } from 'react';
import VariableProximity from './ui/TextProxi';
const VariableProximityDemo = () => {
  const containerRef = useRef(null);
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
        rel="stylesheet"
      />
      <div className="flex items-center justify-center p-8">
        <div
          ref={containerRef}
          style={{ position: 'relative' }}
          className="text-4xl font-semibold"
        >
          <VariableProximity
            label={'Hey'}
            className={'text-center'}
            fromFontVariationSettings="'wght' 400, 'opsz' 12"
            toFontVariationSettings="'wght' 900, 'opsz' 144"
            containerRef={containerRef}
            radius={120}
            falloff='linear'
          />
        </div>
      </div>
    </>
  );
};
export default VariableProximityDemo;