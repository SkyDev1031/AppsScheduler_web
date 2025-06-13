import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { Outlet, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "../../components";
import { AdminNavbar, UserNavbar } from "../../config";
import { useGlobalContext } from "../../contexts";
import { useAuth } from "../../hooks";

const MainContainer = () => {
  const { isAdmin } = useAuth();
  const { pathname: location } = useLocation();
  const { loading } = useGlobalContext();

  const _role_prefix = isAdmin ? '/admin' : '/user';
  const subNav = (isAdmin ? AdminNavbar : UserNavbar).find(item => location.startsWith(`${_role_prefix}/${item.prefix || item.link}`));
  const isSubItem = subNav?.items?.length > 0;

  return (
    <>
      <Header
        isSubItem={isSubItem}
        location={location}
        subNav={subNav}
      />
      <section className={`dashboard-section body-collapse pt-120 ${isSubItem ? 'mt-30' : ''}`}>
        {loading && <div className="preloader react-preloader"></div>}
        <Outlet />
      </section>
    </>
  )
};

export default MainContainer;