import Message from "./Message";

class DeleteMessage extends Message{
    constructor(title, message, confirmationButton, cancelButton) {
        super(title, message, confirmationButton, cancelButton);
        this.confirmationButton = confirmationButton;
        this.cancelButton = cancelButton;
      }

    getConfirmationButton() {
        return this.confirmationButton;
    }

    setConfirmationButton(confirmationButton){
        this.confirmationButton = confirmationButton;
    }

    getCancelButton() {
        return this.cancelButton;
    }

    setCancelButton(cancelButton){
        this.cancelButton = cancelButton;
    }


}