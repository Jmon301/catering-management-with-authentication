import Message from "./Message";

export default class ConfirmationMessage extends Message{
    constructor(title, message, confirmationButton) {
        super(title, message, confirmationButton);
        this.confirmationButton = confirmationButton;
      }

    getConfirmationButton() {
        return this.confirmationButton;
    }

    setConfirmationButton(confirmationButton){
        this.confirmationButton = confirmationButton;
    }
}