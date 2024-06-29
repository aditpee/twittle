import { useRef } from "react";
import { useEffect } from "react";

const useOutsideClick = (callbackOutside, callbackInside) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackOutside();
      } else {
        callbackInside();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callbackOutside, callbackInside, ref]);

  return ref;
};

export default useOutsideClick;
