import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
const MainLayout = () => {
  return (
    <div className='max-w-[1920px] p-5  items-center mx-auto min-h-screen'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
