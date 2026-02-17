import { useEffect, useRef, useState } from "react";
import { FormValidator, formConfig } from "../utils/formValidator";
import closeIcon from "../images/close-icon.png";

function PopupWithForm({
  title,
  name,
  onSubmit,
  children,
  isOpen,
  onClose,
  button,
}) {
  const [open, setOpen] = useState(isOpen);
  const formRef = useRef();
  const overlayRef = useRef();

  function close() {
    setOpen(false);
    onClose();
    formRef.current.reset();
    resetValidation();
  }

  function handleCloseClick() {
    close();
  }

  function handleCloseClickOverlay(e) {
    if (e.target === overlayRef.current) {
      close();
    }
  }

  function enableValidation() {
    new FormValidator({
      formElement: formRef.current,
      config: formConfig,
    }).enableValidation();
  }

  function resetValidation() {
    new FormValidator({
      formElement: formRef.current,
      config: formConfig,
    }).resetValidation();
  }

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    enableValidation();
  }, []);

  return (
    <section
      className={`popup ${
        open ? "popup_opened" : "popup_closed"
      }  popup_${name}`}
      ref={overlayRef}
      onClick={handleCloseClickOverlay}
    >
      <div className="popup__container" id="cards-form">
        <button
          type="button"
          className="popup__close-button"
          onClick={handleCloseClick}
        >
          <img
            className="popup__close-button"
            src={closeIcon}
            alt="Ìcone para fechar o popup"
          />
        </button>
        <h2 className="popup__title">{title}</h2>
        <form
          name={name}
          className={`popup__form popup__form_${name}`}
          ref={formRef}
          noValidate=""
          onSubmit={onSubmit}
        >
          {children}
          <button type="submit" className="popup__input-submit">
            {button}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
