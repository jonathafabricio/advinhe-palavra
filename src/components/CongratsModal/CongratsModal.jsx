import './CongratsModal.css'
import React from 'react'

const CongratsModal = ({ onClose }) => (
  <div className="modal">
    <div className="modal-content">
      <h2>Parabéns!</h2>
      <p>Você acertou!</p>
      <button onClick={onClose}>Próxima Palavra</button>
    </div>
  </div>
)

export default CongratsModal
