import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useGlobalContext } from "../../contexts";

const BaseContainer = () => {
  const { loading } = useGlobalContext();
  return (
    <>
      <Outlet />
      {loading && <div className="preloader react-preloader"></div>}
    </>
  )
};

export default BaseContainer;