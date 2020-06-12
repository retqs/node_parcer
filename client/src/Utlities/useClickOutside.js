import {useEffect} from 'react';

function useClickOutside(ref, cb) {
  const handleClick = (e) => {
    if (ref && !ref.current.contains(e.target)) cb();
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}

export default useClickOutside;
