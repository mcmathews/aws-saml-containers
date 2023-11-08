// Container code mostly taken from
// https://github.com/honsiorovskyi/open-url-in-container
const availableContainerIcons = [
    "fingerprint",
    "briefcase",
    "dollar",
    "cart",
    "circle",
    "gift",
    "vacation",
    "food",
    "fruit",
    "pet",
    "tree",
    "chill",
    "fence"
];

const availableContainerColors = [
    "blue",
    "turquoise",
    "green",
    "yellow",
    "orange",
    "red",
    "pink",
    "purple",
]

async function prepareContainer(name) {
    const containers = await browser.contextualIdentities.query({ name });
    if (containers.length >= 1) {
        return containers[0];
    } else {
        return await browser.contextualIdentities.create({
            name: name,
            color: availableContainerColors[Math.random() * availableContainerColors.length | 0],
            icon: availableContainerIcons[Math.random() * availableContainerIcons.length | 0],
        });
    }
}

let globalFormDataHolder = null;

async function handleSamlLogin(formData, originalTabId) {
    const roleArn = formData.roleIndex[0];

    const { roles } = await browser.storage.local.get("roles");
    const { accountName, roleName } = roles.find(it => it.roleArn === roleArn);
    const container = await prepareContainer(`${accountName}/${roleName}`);
    const originalTab = await browser.tabs.get(originalTabId);
    globalFormDataHolder = formData;
    const newTab = await browser.tabs.create({
        cookieStoreId: container.cookieStoreId,
        index: originalTab.index,
        url: "/openInContainer.html",
    });
    browser.tabs.executeScript(newTab.id, {
        file: "/openInContainer.js",
        runAt: "document_start",
    });
    browser.tabs.remove(originalTabId);
}

browser.webRequest.onBeforeRequest.addListener(
    requestDetails => {
        if (requestDetails.method !== "POST" || requestDetails.originUrl !== "https://signin.aws.amazon.com/saml") {
            return {};
        }

        handleSamlLogin(requestDetails.requestBody.formData, requestDetails.tabId);

        return {
            cancel: true,
        };
    },
    {
        urls: ["https://signin.aws.amazon.com/saml"],
        types: ["main_frame"],
    },
    ["blocking", "requestBody"]
);

browser.runtime.onConnect.addListener(async port => {
    console.log("Received connection for port", port)
    port.onMessage.addListener(msg => {
        console.log("Received message from port", port, msg)
        if (msg.action === "get-form-data") {
            port.postMessage({ formData: globalFormDataHolder });
            globalFormDataHolder = null;
        }
    })
})
