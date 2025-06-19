import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import { Outlet, useLocation } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "../../components";
import { AdminNavbar, UserNavbar } from "../../config";
import { useGlobalContext } from "../../contexts";
import { useAuth } from "../../hooks";
import NotificationsSocket from '../../NotificationSocket';
import { toast_success, toast_error } from '../../utils';

const MainContainer = () => {
  const { isAdmin, _user } = useAuth();
  const { pathname: location } = useLocation();
  const { loading, addNotification, triggerStudyManagementRefresh } = useGlobalContext();

  const _role_prefix = isAdmin ? '/admin' : '/user';
  const subNav = (isAdmin ? AdminNavbar : UserNavbar).find(item => location.startsWith(`${_role_prefix}/${item.prefix || item.link}`));
  const isSubItem = subNav?.items?.length > 0;

  return (
    <>
      <NotificationsSocket
        userId={_user.id}
        onMessage={(res) => {
          // Add notification to global context
          addNotification(res.message);

          // Truncate content if it's too long
          const truncatedContent = res?.message?.content?.length > 50
            ? `${res.message.content.substring(0, 50)}...`
            : res.message.content;

          // Show toast notification with title and truncated content
          toast_success(`${res?.message?.title || 'Untitled'} - ${truncatedContent}`);

          if (res?.message?.type === 'invitation-approved' || res?.message?.type === 'invitation-declined' ||
            res?.message?.title === 'Invitation Approved' || res?.message?.title === 'Invitation Declined'
          ) {
            // Trigger refresh for StudyManagement component
            triggerStudyManagementRefresh();
          }

        }}
      />

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