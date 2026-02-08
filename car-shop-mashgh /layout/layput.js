// layout/layout.js
import React from 'react';
import Header from './header';
import Foter from './foter';

const Layout = ({ children }) => {
    return (
        <div className='bg-gray-900 min-h-screen'> 
            <Header/>
            {children}
            <Foter/>
        </div>
    );
}

export default Layout;