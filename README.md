# AWS SAML Containers

This Firefox extension routes AWS SAML requests into their own containers so you can log in to multiple accounts/roles simultaneously.

## How It Works

When you select a role on the AWS SAML sign in page, and click "Sign in", the request is intercepted and the extension creates a new container tab with the SAML login request. 
The container it uses is specific to the account/role you selected, and is named `<ACCOUNT_NAME>/<ROLE_NAME>`.
The extension then replaces the current tab with the new tab. 

## FAQs

### Can I change what icons and colors are used for containers?

Colors and icons are randomly selected when creating a new container for the first time. 
Going forward it is referenced via its name, and so you can change the icon and color by using the built-in "Manage Containers" feature in Firefox.

## Thanks
Thanks to the following repos for inspiration:
* https://github.com/sjakthol/aws-saml-autologin - used as a basis for interacting with the AWS SAML page.
* https://github.com/pyro2927/AWS_SSO_Containers - used as inspiration for intercepting the AWS SAML request and spawning a container.
* https://github.com/honsiorovskyi/open-url-in-container - Referenced by AWS_SSO_Containers for the majority of the container code.
