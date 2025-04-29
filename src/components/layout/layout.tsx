import React from 'react';
import Headerochek from '../headerochek/header';
import Footerochek from '../footerochek/footer';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: string;
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout: () => void;
}

const Layoutchek: React.FC<LayoutProps> = ({
  children,
  userRole,
  isAuthenticated,
  userEmail,
  onLogout
}) => {
    return (
        <>
     <Headerochek 
       userRole={userRole}
       isAuthenticated={isAuthenticated}
       userEmail={userEmail}
       onLogout={onLogout}
     />
     <main>
        {children}
     </main>
     <Footerochek/>
        </>
    )
};

export default Layoutchek;
