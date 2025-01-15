// WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const phoneNumber = '5491123668703'; // 5491123668703
    const message = '¡Hola! Necesito informacion para canjear mis puntos';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    return (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
            <FaWhatsapp className="whatsapp-icon" />
        </a>
    )
}

export default WhatsAppButton;