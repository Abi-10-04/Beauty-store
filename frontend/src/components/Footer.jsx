import React from 'react'
import {FaFacebookF, FaInstagram, FaTwitter} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="footer mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-md-4">
            <h4 className="fw-bold text-white">Beauty Store</h4>
            <p className="text-light">
              Discover premium beauty products that make you glow
            </p>

            {/* Social Icons */}

            <div className="d-flex gap-3 mt-3">
              <FaFacebookF className="footer-icon" />
              <FaInstagram className="footer-icon" />
              <FaTwitter className="footer-icon" />
            </div>
          </div>

          {/* Links */}
          <div className="col-md-4">
            <h5 className="text-white">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/offers"> Offers</a></li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="col-md-4">

            <p className="text-light small mt-3">
              info@beautystore.com <br />
              +1-800-6846-123
            </p>
          </div>

        </div>

        {/* Bottom */}
        <hr className="border-light mt-4" />

        <div className="text-center text-light small">
          © 2026 Beauty Store • Made with Love 💖
        </div>
      </div>
    </footer>
  )
}