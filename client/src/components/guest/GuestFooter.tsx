function GuestFooter() {
  return (
    <div className="bg-white shadow border-t-2 mt-2 mx-0">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between text-center">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{' '}
          <a href="" className="hover:underline">
            MoF Hotel™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex justify-center items-center mt-3 space-x-4 text-sm font-medium text-gray-500 md:mt-0">
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GuestFooter;
