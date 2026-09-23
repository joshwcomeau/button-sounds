import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  id?: string;
  children: React.ReactNode;
  parent?: HTMLElement;
}

const InPortal = ({ id, children, parent }: Props) => {
  const [hostElement, setHostElement] = React.useState<Element | null>(null);

  React.useEffect(() => {
    const actualParent = parent || document.body;

    const elm = id
      ? document.querySelector(`#${id}`)
      : document.createElement('div');

    if (!elm) {
      return;
    }

    setHostElement(elm);

    if (!id) {
      actualParent.appendChild(elm);
    }

    return () => {
      if (!id) {
        actualParent.removeChild(elm);
      }
    };
  }, [parent, id]);

  if (!hostElement) {
    return null;
  }

  return ReactDOM.createPortal(children, hostElement);
};

export default InPortal;
