import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

interface BreadcrumbsProps {
  path: { id: string; name: string }[];
}

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = ({ path }) => {
  const router = useRouter();

  return (
    <div className="breadcrumbs">
      {path.map((crumb, index) => (
        <span key={crumb.id}>
          <button onClick={() => router.push(`/${crumb.id}`)}>
            {crumb.name}
          </button>
          {index < path.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
