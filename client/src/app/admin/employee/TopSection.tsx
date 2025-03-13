'use client';

import { SearchInput } from '../SearchInput';
import CreateAccountModal from './CreateAccountModal';

export default function TopSection() {
  return (
    <div className="flex justify-between">
      <SearchInput placeholder="Search employee" />
      <div>
        <CreateAccountModal />
      </div>
    </div>
  );
}
