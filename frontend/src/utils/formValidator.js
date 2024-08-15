export class FormValidator {
  constructor({ config, formElement }) {
    this._config = config;
    this._formElement = formElement;
    this._inputList = Array.from(
      this._formElement.querySelectorAll(this._config.inputSelector)
    );
    this._buttonElement = this._formElement.querySelector(
      this._config.submitButtonSelector
    );
  }

  _showInputError(inputElement, errorMessage) {
    const errorElement = this._formElement.querySelector(
      `#${inputElement.id} + .${this._config.errorClass}`
    );
    inputElement.classList.add(this._config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._config.errorClassVisible);
  }

  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(
      `#${inputElement.id} + .${this._config.errorClass}`
    );
    inputElement.classList.remove(this._config.inputErrorClass);
    errorElement.classList.remove(this._config.errorClassVisible);
    errorElement.textContent = "";
  }

  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  }

  _toggleButtonState() {
    if (this._hasInvalidInput()) {
      this._buttonElement.classList.add(this._config.inactiveButtonClass);
      this._buttonElement.setAttribute("disabled", true);
    } else {
      this._buttonElement.classList.remove(this._config.inactiveButtonClass);
      this._buttonElement.removeAttribute("disabled");
    }
  }

  _setEventListeners() {
    this._toggleButtonState();
    this._inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        this._toggleButtonState();
        this._checkInputValidity(inputElement);
      });
    });
  }

  enableValidation() {
    this._formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    this._setEventListeners();
  }

  resetValidation() {
    this._inputList.forEach((inputElement) => {
      this._hideInputError(inputElement);
    });
    this._toggleButtonState();
  }
}

export const formConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input-text",
  submitButtonSelector: ".popup__input-submit",
  inactiveButtonClass: "popup__input-disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error",
  errorClassVisible: "popup__error_visible",
};

export const formConfigAuth = {
  formSelector: ".auth__form",
  inputSelector: ".auth__input",
  submitButtonSelector: ".auth__button",
  inactiveButtonClass: "auth__button-disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error",
  errorClassVisible: "popup__error_visible",
};
