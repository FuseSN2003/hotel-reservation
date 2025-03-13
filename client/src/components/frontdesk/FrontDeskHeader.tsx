'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useContext } from 'react';
import { FrontDesk } from '@/context/FrontDeskContext';

export default function FrontdeskHeader() {
  const {
    roomType,
    setRoomType,
    roomsTypeData,
    changeSelectedYear,
    changeSelectedMonth,
    prevYearSet,
    nextYearSet,
    arrayMonth,
    arrayYear,
    selectedYear,
    selectedMonth,
    startYearIndex,
    YearPerPage,
    setSearchCustomer,
    stateShowAll,
    setStateShowAll,
    onSearch,
    setSearchInput,
    searchInput,
  }: {
    roomType: string;
    setRoomType: (value: string) => void;
    roomsTypeData: string[];
    changeSelectedYear: (value: string) => void;
    changeSelectedMonth: (value: string) => void;
    prevYearSet: () => void;
    nextYearSet: () => void;
    arrayMonth: string[];
    arrayYear: string[];
    selectedYear: string;
    selectedMonth: string;
    startYearIndex: number;
    YearPerPage: number;
    setSearchCustomer: (value: string) => void;
    stateShowAll: boolean;
    setStateShowAll: (value: boolean) => void;
    onSearch: () => void;
    setSearchInput: (value: string) => void;
    searchInput: string;
  } = useContext(FrontDesk);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Front Desk</p>
        <a href="/">
          <Button className="font-bold bg-blue-800 hover:bg-blue-900 border-0">
            Add Booking
          </Button>
        </a>
      </div>

      <ToggleGroup
        variant="outline"
        type="single"
        className="p-0 m-0 gap-0 mt-3 border-0 rounded-tl-xl rounded-tr-xl"
        value={selectedYear || ''}
        onValueChange={(value) => {
          changeSelectedYear(value);
        }}
      >
        <ToggleGroupItem
          value="prev"
          className="font-bold rounded-none border  rounded-tl-xl"
          variant="outline"
          onClick={prevYearSet}
        >
          {'<'}
        </ToggleGroupItem>
        {arrayYear
          .slice(startYearIndex, startYearIndex + YearPerPage)
          .map((year: string) => (
            <ToggleGroupItem
              key={year}
              value={year.toString()}
              className="font-bold border  rounded-none flex-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[disabled]:bg-blue-600 data-[disabled]:text-white data-[disabled]:opacity-100"
              variant="outline"
              disabled={selectedYear === year.toString()}
            >
              {year}
            </ToggleGroupItem>
          ))}
        <ToggleGroupItem
          value="next"
          className="font-bold rounded-none border rounded-tr-lg"
          variant="outline"
          onClick={nextYearSet}
        >
          {'>'}
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        variant="outline"
        type="single"
        className="p-0 m-0 gap-0 border-0 rounded-bl-xl rounded-br-lg"
        value={selectedMonth.toString()}
        onValueChange={(value) => {
          changeSelectedMonth(value);
        }}
      >
        <ToggleGroupItem
          value="prev"
          className="font-bold border rounded-none rounded-bl-lg"
          variant="outline"
        >
          {'<'}
        </ToggleGroupItem>
        {arrayMonth.map((month: string, index: number) => (
          <ToggleGroupItem
            key={month}
            value={(index + 1).toString()}
            className="font-bold border  rounded-none flex-1 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[disabled]:bg-blue-600 data-[disabled]:text-white data-[disabled]:opacity-100"
            variant="outline"
            disabled={selectedMonth == (index + 1).toString()}
          >
            {month}
          </ToggleGroupItem>
        ))}
        <ToggleGroupItem
          value="next"
          className="font-bold border rounded-none rounded-br-lg"
          variant="outline"
        >
          {'>'}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex justify-between items-center mt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchCustomer(searchInput);
            onSearch();
          }}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
            <Input
              type="text"
              placeholder="Search for customer"
              className="pl-10 "
              value={searchInput}
              pattern="^[A-Za-zก-๏ ]{1,35}$"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <Button
              variant="outline"
              className="ml-2 text-white bg-blue-800 hover:bg-blue-900 hover:text-white"
              type="submit"
            >
              Search
            </Button>
            {stateShowAll && (
              <Button
                variant="outline"
                className="ml-2 text-white bg-blue-800 hover:bg-blue-900 hover:text-white"
                onClick={() => {
                  setSearchCustomer('');
                  setStateShowAll(false);
                }}
              >
                Show All
              </Button>
            )}
          </div>
        </form>
        <div className="relative flex items-center"></div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {roomType === 'all' ? 'RoomTypes ' : roomType}&nbsp;
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 right-10 left-9" align="start">
            <DropdownMenuLabel>Roomtypes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={roomType}
              onValueChange={(value) => setRoomType(value)}
            >
              <DropdownMenuRadioItem value="all">
                <div className="flex items-center justify-between">
                  <div>All</div>
                </div>
              </DropdownMenuRadioItem>
              {roomsTypeData?.map((type: string) => (
                <DropdownMenuRadioItem key={type} value={type}>
                  <div className="flex items-center justify-between">
                    <div>{type}</div>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
