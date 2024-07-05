// useGlobalMessage.js
import { useContext, useEffect } from 'react';
import { GlobalMsgContext } from 'Context/globalMessage';
import { toast } from 'react-toastify';

const useGlobalMessage = () => {
    let { globalMsg, setGlobalMsg } = useContext(GlobalMsgContext);

  useEffect(() => {
    if (globalMsg) {
      toast(globalMsg, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: 'colored',
        type: 'success',
        onClose: () => {
          setGlobalMsg('');
        },
      });
    }
  }, [globalMsg, setGlobalMsg]);

  return { setGlobalMsg };
};

export default useGlobalMessage;
