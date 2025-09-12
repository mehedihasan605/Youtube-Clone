import PropTypes from 'prop-types';
import Loading from '../components/ui/loading/Loading';
import { useLayoutContext } from '../hooks/context/useLayoutContext';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {
  const { currentUser, currentUserLoading, setOpenLogin } = useLayoutContext();
  const location = useLocation();

  if (currentUserLoading) return <Loading />;

  if (currentUser) return children;

  setOpenLogin(true);

  return <Navigate to="/" state={{ from: location }} replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.element,
};

export default PrivateRoute;
