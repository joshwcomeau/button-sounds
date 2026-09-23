import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
  children: React.ReactNode;
}

const VisuallyHidden = ({ children, ...delegated }: Props) => {
  return <Wrapper {...delegated}>{children}</Wrapper>;
};

const Wrapper = styled.span`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  padding: 0;
  border: 0;
`;

export default VisuallyHidden;
