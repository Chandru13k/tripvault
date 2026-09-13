import React from 'react';

const Footer = () => {
  const githubUrl = import.meta.env.VITE_GITHUB_URL || 'https://github.com/Chandru13k/TripVault';

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-copyright">
          © {new Date().getFullYear()} TripVault. Built with ❤️ for MERN Travel Journal Application.
        </p>
        <div className="footer-links">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <span>⭐</span> GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
