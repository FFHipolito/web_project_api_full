import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Card({ cardData, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const { link, name, owner, likes } = cardData;

  const isOwn = owner._id === currentUser._id;

  const cardDeleteButtonClassName = `elements__button-trash ${
    isOwn && "elements__button-trash_hidden"
  }`;

  const isLiked = likes.some((like) => like === currentUser._id);

  const cardLikeButtonClassName = `elements__like-button ${
    isLiked && "active"
  }`;

  function handleCardClick() {
    onCardClick(cardData);
  }

  function handleLikeClick() {
    onCardLike(cardData);
  }

  function handleDeleteClick() {
    onCardDelete(cardData);
  }

  return (
    <>
      <div className="elements__card">
        <button
          id="button"
          type="button"
          className={cardDeleteButtonClassName}
          onClick={handleDeleteClick}
        ></button>
        <img
          className="elements__image"
          src={link}
          alt={name}
          onClick={handleCardClick}
        />
        <div className="elements__group">
          <h2 className="elements__title">{name}</h2>
          <button
            id="likeButton"
            className={cardLikeButtonClassName}
            name="like"
            type="button"
            onClick={handleLikeClick}
          ></button>
        </div>
        <span className="elements__like-count">{likes.length}</span>
      </div>
    </>
  );
}

export default Card;
