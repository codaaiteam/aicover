import { useLanguage } from "@/contexts/language";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-6 py-12 lg:py-16">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Mochi 1 Preview
              </span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {t.footerDescription || 'Create beautiful AI-generated videos in seconds'}
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
              {t.contact || 'Contact'}
            </h2>
            <ul className="text-gray-600 dark:text-gray-400">
              <li className="mb-4">
                <span className="font-medium">Email:</span> contact@mochi1preview.com
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              2024{" "}
              <a href="/" className="hover:underline">
                Mochi 1 Preview
              </a>
              . {t.allRightsReserved || 'All Rights Reserved'}
            </span>
            <div className="flex space-x-4 mt-2 sm:mt-0 sm:ml-4">
              <a
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {t.terms || 'Terms'}
              </a>
              <a
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                {t.privacy || 'Privacy'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
