import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  homeLabel?: string;
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  homeLabel = 'Accueil',
  separator = <ChevronRight size={16} className="mx-2 text-neutral-500" />,
  className = ''
}) => {
  const pathname = usePathname();
  
  // Generate breadcrumbs based on the current pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: homeLabel, href: '/' }
    ];
    
    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ label, href });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav 
      aria-label="Fil d'Ariane" 
      className={`flex items-center text-sm text-neutral-600 dark:text-neutral-300 ${className}`}
    >
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && separator}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-neutral-900 dark:text-white font-semibold">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href || '#'}
              className="hover:text-primary-600 transition-colors flex items-center"
            >
              {index === 0 ? <Home size={16} className="mr-2" /> : item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;