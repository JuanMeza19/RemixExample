import { Outlet } from "@remix-run/react";

export default function Index() {
    return (
      <><p id="index-page">
            This is a demo for Remix Contact.
            <br />
            Check out{" "}
            <a href="https://remix.run">the docs at remix.run</a>.
        </p><Outlet></Outlet></>
    );
}
