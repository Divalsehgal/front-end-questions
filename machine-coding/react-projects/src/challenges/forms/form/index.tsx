import { useActionState, useState } from "react";


async function submitAction(prevState, formData) {
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
    };
    console.log(data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return data;
}

export default function MyForm() {
    const [state, action, pending] = useActionState(submitAction, {
        name: "",
        email: "",


    });




    return (
        <form action={action}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={state.name}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={state.email}
            />

            <button type="submit">     {pending ? "Submitting..." : "Submit"}</button>
        </form>
    );
}