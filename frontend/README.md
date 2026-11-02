# Zanzibar Ride

A responsive Zanzibar tourist transportation website built with React, React Router and Vite. Visitors can explore services and destination guides, then send a transfer inquiry directly through WhatsApp without creating an account.

## Run locally

```sh
npm install
npm run dev
```

## Configure contact details

Copy `.env.example` to `.env.local` and set the business contact channels:

- `VITE_WHATSAPP_NUMBER`: business WhatsApp number in international format, digits only (for example, country code followed by the number).
- `VITE_PHONE_NUMBER`: optional phone number for the call link.
- `VITE_CONTACT_EMAIL`: optional email address.
- `VITE_SITE_URL`: canonical site origin used by metadata and structured data.

The WhatsApp button and floating contact link appear once a business WhatsApp number is configured. The inquiry form asks the business to confirm availability and pricing; submitting does not confirm a booking.

## Production build

```sh
npm run build
npm run preview
```
