import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface Props {
  in?: boolean;
  children: React.ReactNode;
}

const Fade: React.FC<Props> = (props) => {
  const nodeRef = React.useRef(null);

  return (
    <CSSTransition in={props.in} nodeRef={nodeRef} classNames="transition-fade" timeout={250} unmountOnExit>
      <div ref={nodeRef} className="inline-block">
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default Fade;
