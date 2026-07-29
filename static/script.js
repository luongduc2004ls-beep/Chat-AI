const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const sendButton = document.getElementById("send-button");

chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage("Bạn", message, "user-message");

    messageInput.value = "";
    messageInput.focus();

    sendButton.disabled = true;
    sendButton.textContent = "Đang gửi...";

    const loadingElement = addMessage(
        "AI",
        "Đang suy nghĩ...",
        "bot-message loading-message"
    );

    try {
        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        loadingElement.remove();

        if (!response.ok) {
            throw new Error(data.error || "Có lỗi xảy ra.");
        }

        addMessage(
            "AI",
            data.answer,
            "bot-message"
        );
    } catch (error) {
        loadingElement.remove();

        addMessage(
            "Lỗi",
            error.message,
            "bot-message error-message"
        );
    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Gửi";
        messageInput.focus();
    }
});


function addMessage(sender, content, className) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${className}`;

    const labelElement = document.createElement("div");
    labelElement.className = "message-label";
    labelElement.textContent = sender;

    const contentElement = document.createElement("div");
    contentElement.className = "message-content";
    contentElement.textContent = content;

    messageElement.appendChild(labelElement);
    messageElement.appendChild(contentElement);

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageElement;
}


// Nhấn Enter để gửi, Shift + Enter để xuống dòng
messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});