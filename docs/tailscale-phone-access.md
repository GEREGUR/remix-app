# Private Phone Access With Tailscale Serve

Use Tailscale Serve to open this local Remix app from your phone without exposing it to the public internet or the wider LAN.

The app listens on `127.0.0.1:44100` by default. Tailscale Serve publishes a private HTTPS URL for devices signed into the same tailnet and forwards it to that local address.

## Prerequisites

- Bun installed on the Mac.
- Tailscale installed and signed in on the Mac.
- Tailscale installed and signed in on the phone with the same tailnet account.
- MagicDNS enabled in Tailscale.

If the Tailscale CLI reports `Failed to load preferences`, open the macOS Tailscale app, sign in, and confirm it is connected before running the Serve commands again.

## Run The App

Install dependencies:

```sh
bun install
```

Start the local development server:

```sh
bun run dev
```

If Node watch mode reports `EMFILE: too many open files`, raise the shell's file descriptor limit and retry:

```sh
ulimit -n 20000
bun run dev
```

For the non-watch server, use:

```sh
bun run start
```

Verify the app locally on the Mac:

```sh
curl http://127.0.0.1:44100/
```

## Publish Privately To The Tailnet

In another terminal, enable Tailscale Serve:

```sh
bun run tailscale:serve
```

Check the active forwarding rule:

```sh
bun run tailscale:serve:status
```

The status should show HTTPS port `443` forwarding to `http://127.0.0.1:44100`.

On the phone, connect Tailscale VPN and open the HTTPS MagicDNS URL shown by `tailscale serve status`, for example:

```text
https://georges-macbook-pro.<tailnet>.ts.net/
```

The URL is private to devices in the same tailnet. This setup does not use Tailscale Funnel.

## Disable Access

Turn off the private HTTPS forwarding rule:

```sh
bun run tailscale:serve:off
```

Confirm it is gone:

```sh
bun run tailscale:serve:status
```
