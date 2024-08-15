import { useRef } from "react";
import closeIconS from "../images/close-icon-s.png";

function ImagePopup({ card, onClose }) {
  const overlayRef = useRef();

  function handleCloseClickOverlay(e) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <>
      <section
        className={`popup popup-zoom-image ${card ? "popup_opened" : ""}`}
        ref={overlayRef}
        onClick={handleCloseClickOverlay}
      >
        <div className="popup-zoom-image__container">
          <button
            className="popup__close-button popup__close-button_image"
            onClick={onClose}
          >
            <img
              src={closeIconS}
              alt="Fechar janela da imagem"
              className="popup__image-button"
            />
          </button>
          <img
            className="popup__image"
            src={card ? card.link : ""}
            alt={card ? card.name : ""}
          />
          <p className="popup__image-name">{card ? card.name : ""}</p>
        </div>
      </section>
    </>
  );
}

export default ImagePopup;
