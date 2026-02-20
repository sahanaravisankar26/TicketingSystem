import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  QuestionMarkCircleIcon,
  UserMinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Routes } from "../../Contants/routes";

const navigation = [
  { name: "Dashboard", href: Routes.Dashboard },
  { name: "Submit Issue", href: Routes.Issue },
  { name: "History", href: Routes.History },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const href = location.pathname.substring(1);

  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-500 after:pointer-events-none after:absolute after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto max-w-8xl px-1 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Couchbase" src={logo} className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.href ? "page" : undefined}
                    className={classNames(
                      item.href == href
                        ? "bg-gray-950/50 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium",
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-2 sm:static sm:inset-auto sm:ml-6 sm:p-0 space-x-1">
            <a href="https://docs.couchbase.com/" target="_blank">
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-400 hover:text-white"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Help</span>
                <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
              </button>
            </a>
            <button
              type="button"
              className="relative rounded-full p-1 text-gray-400 hover:text-white"
              onClick={onLogout}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Logout</span>
              <UserMinusIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.href ? "page" : undefined}
              className={classNames(
                item.href == href
                  ? "bg-gray-950/50 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
