// Abstract class
class Message{
    constructor(title, content) {
        this.title = title;
        this.content = content;
      }

    getTitle () {
        return this.title;
    }

    setTitle(title){
        title.this = title;
    }

    getContent () {
        return this.content;
    }

    setContent(content){
        content.this = content;
    }

    renderMessage(message){
        const messageContainer = document.createElement("div");
        messageContainer.id = "message-container";
        const wrapper = document.querySelector("#wrapper");
        const content = 
        `
            <h2>${message.title}</h2>
            <p>${message.content}</p>
            <button id="confirmation-button">Ok</button>
        `;
        messageContainer.innerHTML = content;
        wrapper.appendChild(messageContainer);

        const confirmationButton = document.querySelector("#confirmation-button");
        confirmationButton.addEventListener('click', ()=> {
            if(document.querySelector("#message-container")){
                wrapper.removeChild(messageContainer);
                destroyOverlay();
            }
        })

        setTimeout(()=>{
            if(document.querySelector("#message-container")){
                wrapper.removeChild(messageContainer);
                destroyOverlay();
            }
        }, 3000)
    }
}


// Inherits from Message class
class ConfirmationMessage extends Message{
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


// Inherits from Message class
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

    // Morphs the render message method to display something different
    renderMessage(message){
        const messageContainer = document.createElement("div");
        messageContainer.id = "delete-message-container";
        const wrapper = document.querySelector("#wrapper");
        
        const content = 
        `
            <h2>${message.title}</h2>
            <p>${message.content}</p>
            <div id="message-buttons">
                <button id="message-confirmation-button">${message.confirmationButton}</button>
                <button id="message-cancel-button">${message.cancelButton}</button>
            </div>
        `;
        messageContainer.innerHTML = content;
        wrapper.appendChild(messageContainer);
    }

}