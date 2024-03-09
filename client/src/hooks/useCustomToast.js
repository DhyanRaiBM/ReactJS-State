import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useCustomToast = () => {
    const notifyError = (message) => {
        toast.error(message, {
            autoClose: 2000,
        });
    };

    const notifySuccess = (message) => {
        toast.success(message, {
            autoClose: 2000,
        });
    };

    const notifyWarning = (message) => {
        toast.warning(message, {
            autoClose: 2000,
        });
    };

    const notifyInfo = (message) => {
        toast.info(message, {
            autoClose: 2000,
        });
    };

    return {
        notifyError,
        notifySuccess,
        notifyWarning,
        notifyInfo,
    };
};

export default useCustomToast;
