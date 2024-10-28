import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigate, } from "@remix-run/react";
import invariant from "tiny-invariant";

import { z } from 'zod'

import { getContact, updateContact } from "../data";
import fetchData from "utils/fetchData";

export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const contact = await getContact(params.contactId);
    const getPosts = async () => {
        const posts = await fetchData({
          url: 'https://rickandmortyapi.com/api/character',
          method: 'GET',
        });
        console.log('Ricky', posts);
      };
    getPosts()
    if (!contact) {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ contact });
};

const subscriberSchema = z.object({
    first: z.string().min(1, "Projects need a first name."),
    last: z.string().min(1, 'Peoject need last name'),
})

export const action = async ({
    params,
    request,
}: ActionFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    try {
        const newSubscriber = subscriberSchema.parse(updates)
        console.log('Enter Try', newSubscriber);
        await updateContact(params.contactId, updates);
        return redirect(`/contacts/${params.contactId}`);
    } catch (error) {
        console.error(`form not submitted ${error}`)
        return json({ error });
    }
};


export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const data: any = useActionData();

    return (
        <Form key={contact.id} id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    defaultValue={contact.first}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@jack"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    defaultValue={contact.notes}
                    name="notes"
                    rows={6}
                />
            </label>
            {data && data?.['error'] && (<p>{JSON.stringify(data.error)}</p>)}
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    );
}
