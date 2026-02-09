import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400">
              TuCita
            </span>
            <p className="mt-4 text-sm text-gray-400">
              Tu plataforma de reservas de belleza más confiable. Conectamos profesionales con clientes.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-rose-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-rose-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-rose-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-lg font-semibold text-white">Enlaces Rápidos</span>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-rose-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm hover:text-rose-400 transition-colors">
                  Buscar Profesionales
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-sm hover:text-rose-400 transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-rose-400 transition-colors">
                  Mi Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <span className="text-lg font-semibold text-white">Servicios</span>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm">Peluquería</span>
              </li>
              <li>
                <span className="text-sm">Barbería</span>
              </li>
              <li>
                <span className="text-sm">Manicura</span>
              </li>
              <li>
                <span className="text-sm">Maquillaje</span>
              </li>
              <li>
                <span className="text-sm">Estética Facial</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-lg font-semibold text-white">Contacto</span>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-rose-400" />
                <span className="text-sm">info@tucita.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-rose-400" />
                <span className="text-sm">3223318724</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                <span className="text-sm">San José del Guaviare</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © 2026 TuCita. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;