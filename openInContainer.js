const port = browser.runtime.connect({ name: "open-in-container" })

port.postMessage({ action: "get-form-data" });
port.onMessage.addListener(({ formData }) => {
    const form = document.querySelector("form");
    for (const formElement in formData) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = formElement;
        input.value = formData[formElement][0];
        form.appendChild(input);
    }
    form.submit();
})
