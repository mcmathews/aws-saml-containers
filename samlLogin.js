const accounts = [...document.querySelectorAll("fieldset > .saml-account")];
const roles = [];
for (const account of accounts) {
    const accountTitle = account.querySelector(".saml-account-name").textContent;
    const [_, accountName, accountId] = accountTitle.match(/ (.+) \((.+)\)/);
    roles.push(...[...account.querySelectorAll("input[type=radio]")]
        .map(roleInput => ({
            accountId,
            accountName,
            roleArn: roleInput.value,
            roleName: roleInput.value.split("/")[1],
        }))
    );
}

browser.storage.local.set({ roles });
