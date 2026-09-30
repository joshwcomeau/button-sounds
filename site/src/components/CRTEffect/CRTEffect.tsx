import ChromaticAberration from './ChromaticAberration';
import Scanlines from './Scanlines';
import Vignette from './Vignette';

interface Props {
  strength?: number;
}

function CRTEffect({ strength = 1 }: Props) {
  return (
    <>
      <Scanlines strength={strength} />
      <ChromaticAberration strength={strength / 2} />
      <Vignette strength={strength} />
    </>
  );
}

export default CRTEffect;
