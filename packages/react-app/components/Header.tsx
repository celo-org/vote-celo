import useIsMobile from "@/hooks/useIsMobile";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Header() {
  const isMobile = useIsMobile();
  console.log("🚀 ~ file: Header.tsx:9 ~ Header ~ isMobile:", isMobile);
  return (
    <Disclosure as="nav" className="bg-gypsum ">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center sm:items-stretch sm:justify-start w-full">
                <div className="flex items-center ml-12 md:ml-0">
                  <Image
                    className={`block ${
                      isMobile ? "h-5" : "h-8"
                    } w-auto sm:block lg:block`}
                    src="/logo.svg"
                    width={isMobile ? "10" : "24"}
                    height={isMobile ? "10" : "24"}
                    alt="Celo Logo"
                  />
                </div>
                <div className="hidden w-full md:flex justify-center sm:space-x-12">
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-900"
                  >
                    Proposals
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-900"
                  >
                    Delegate
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center px-1 pt-1 text-sm font-bold text-gray-900"
                  >
                    New Proposal
                  </a>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 w-44">
                <ConnectButton
                  showBalance={{ smallScreen: true, largeScreen: false }}
                />
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-black"
              >
                Proposals
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-black"
              >
                Delegate
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block py-2 pl-3 pr-4 text-base font-medium text-black"
              >
                New proposal
              </Disclosure.Button>
              {/* Add here your custom menu elements */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
