import {
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import Link from "next/link";
import CoinwalaLogo from "../CoinWala";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black p-5 text-white lg:p-10">
      <div className="mx-auto w-full max-w-screen-xl lg:p-4  lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="bg-black border p-2 border-white/25 rounded-md shadow-inner shadow-white/55  flex items-center justify-center">
              <Image
                className="rounded-lg"
                src="/assets/images/images/symbolLogo.png"
                alt="logo"
                width={40}
                height={40}
                priority
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 font-semibold text-zinc-400">Resources</h2>
              <ul className="text-gray-500 text-sm dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">
                    Create CoinWala link
                  </Link>
                </li>
                <li className="mb-4">
                  <Link href="#" className="hover:underline">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    API reference
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 font-semibold text-zinc-400">Follow us</h2>
              <ul className="text-gray-500 text-sm dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="#" className="hover:underline ">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-zinc-400">
                Legal
              </h2>
              <ul className="text-gray-500 text-sm dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="sm:flex sm:items-center sm:justify-between mt-20">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 CoinWala All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <FaFacebook />
              <span className="sr-only">Facebook page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaDiscord />
              <span className="sr-only">Discord community</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaXTwitter />
              <span className="sr-only">Twitter page</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaGithub />
              <span className="sr-only">GitHub account</span>
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              <FaDribbble />
              <span className="sr-only">Dribbble account</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
