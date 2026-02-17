import PopupWithForm from "./PopupWithForm";

export default function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirmationSubmit,
}) {
  function handleConfirmationSubmit(e) {
    e.preventDefault();
    return onConfirmationSubmit();
  }

  return (
    <PopupWithForm
      title="Tem certeza?"
      name="popup"
      button="Sim"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleConfirmationSubmit}
    />
  );
}
