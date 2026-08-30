import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub"
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram"
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Footer = () => {
  return (
    <footer className="mt-auto flex-shrink-0 py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          {/* Social Links */}
          <div className="flex space-x-6 mb-4">
            <a
              href="https://github.com/mattenarle10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/matthew-enarle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/mattenarle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-light">
            &copy; {new Date().getFullYear()} Matt Enarle. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
