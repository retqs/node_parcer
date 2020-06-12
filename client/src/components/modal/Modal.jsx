import React from 'react';
import {useOfContext} from '../../context';

function Modal({title, body}) {
  const {toggleModal} = useOfContext();

  return (
    <article className='modal'>
      <div className='overlay' onClick={() => toggleModal()}></div>
      <div className='modalBody'>
        <h2 className='modalTitle'>{title}</h2>
        <p className='modalText'>{body}</p>
      </div>
    </article>
  );
}

export default Modal;
