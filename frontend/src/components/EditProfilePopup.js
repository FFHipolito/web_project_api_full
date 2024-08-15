import { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      name,
      about,
    });
  };

  return (
    <PopupWithForm
      isOpen={isOpen}
      title="Editar Perfil"
      name="popup"
      onClose={onClose}
      onSubmit={handleSubmit}
      button="Salvar"
    >
      <>
        <input
          className="popup__input-text"
          id="name-input"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          type="text"
          name="name"
          placeholder="Nome"
          minLength={2}
          maxLength={40}
          required
        />
        <span className="popup__error"></span>
        <input
          className="popup__input-text"
          id="about-input"
          value={about}
          onChange={(event) => {
            setAbout(event.target.value);
          }}
          type="text"
          name="about"
          placeholder="Sobre mim"
          minLength={2}
          maxLength={200}
          required
        />
        <span className="popup__error"></span>
      </>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
