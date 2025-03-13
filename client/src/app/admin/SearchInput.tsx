import * as React from 'react';

import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = React.useState<string>(
      searchParams.get('q') || ''
    );

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    };

    return (
      <form onSubmit={handleSearch} className="flex gap-2 relative">
        <Input
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          ref={ref}
          {...props}
        />
        <SearchIcon className="absolute top-1/2 transform -translate-y-1/2 right-2 h-5 w-5 text-gray-500" />
      </form>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
