export class Message{
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
        const wrapper = document.querySelector("#wrapper");
        const content = 
        `
            <h2>Notification</h2>
            <p>${message}</p>
            <button id="confirmation-button">Ok</button>
        `;
        messageContainer.innerHTML = content;
        wrapper.appendChild(messageContainer);
    }
}