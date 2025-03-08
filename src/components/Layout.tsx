import { ReactNode } from 'react';
import Navigation from './Navigation';
import SuggestedCauses from './SuggestedCauses';
import Stories from './Stories';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-3">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1 sticky top-0 h-screen md:flex flex-col hidden"
        >
          <Navigation />
        </motion.div>
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 pb-16 md:pb-0"
        >
          <Stories />
          {children}
        </motion.main>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1 sticky top-0 h-screen hidden md:block"
        >
          <SuggestedCauses />
        </motion.div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation mobile />
      </div>
    </div>
  );
};

export default Layout;
