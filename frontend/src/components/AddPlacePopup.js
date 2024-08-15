import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlaceSubmit }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPlaceSubmit({
      name,
      link,
    });
    setName("");
    setLink("");
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      title="Novo Local"
      name="popup-add"
      onClose={onClose}
      onSubmit={handleSubmit}
      button="Criar"
    >
      <>
        <input
          className="popup__input-text popup__input-text_title"
          id="title-input"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          type="text"
          name="title"
          placeholder="Título"
          minLength={2}
          maxLength={30}
          required
        />
        <span className="popup__error"></span>
        <input
          className="popup__input-text popup__input-text_url"
          id="url-input"
          value={link}
          onChange={(event) => {
            setLink(event.target.value);
          }}
          type="url"
          name="url"
          placeholder="Link da imagem"
          required
        />
        <span className="popup__error"></span>
      </>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
