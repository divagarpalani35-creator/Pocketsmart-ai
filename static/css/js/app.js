function showResult(data) {

    const box =
        document.getElementById("result");


    if (!box) {
        return;
    }


    box.innerHTML = "";


    if (!data.items) {

        box.textContent =
            data.error ||
            "Something went wrong.";

        return;
    }


    const note =
        document.createElement("p");


    note.textContent =
        "Source: " +
        data.source;


    box.appendChild(note);


    data.items.forEach(item => {

        const div =
            document.createElement("div");


        div.className = "rec";


        div.innerHTML = `
            <strong>
                ${escapeHtml(
                    item.title ||
                    "Recommendation"
                )}
            </strong>

            <br>

            Platform:
            ${escapeHtml(
                item.platform || ""
            )}

            <br>

            Approx. price:
            ₹${Number(
                item.price || 0
            ).toLocaleString("en-IN")}

            <br>

            ${escapeHtml(
                item.reason || ""
            )}

            <br>

            <a
                href="${item.url}"
                target="_blank"
                rel="noopener"
            >
                Search on platform
            </a>
        `;


        box.appendChild(div);

    });

}


function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        character => {

            const map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };


            return map[character];

        }
    );
}


async function jsonPost(
    url,
    data
) {

    const response =
        await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(data)
            }
        );


    return response.json();
}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const registerForm =
            document.getElementById(
                "registerForm"
            );


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const formData =
                        new FormData(
                            registerForm
                        );


                    const data =
                        Object.fromEntries(
                            formData
                        );


                    const response =
                        await jsonPost(
                            "/register",
                            data
                        );


                    document
                        .getElementById(
                            "message"
                        )
                        .textContent =
                            response.message ||
                            response.error;


                    if (response.ok) {

                        location.href =
                            "/login";

                    }

                }
            );

        }


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                async event => {

                    event.preventDefault();


                    const formData =
                        new FormData(
                            loginForm
                        );


                    const data =
                        Object.fromEntries(
                            formData
                        );


                    const response =
                        await jsonPost(
                            "/login",
                            data
                        );


                    if (response.ok) {

                        localStorage.setItem(
                            "access_token",
                            response.access_token
                        );


                        document.cookie =
                            "access_token=" +
                            response.access_token +
                            "; path=/; SameSite=Lax";


                        location.href =
                            "/dashboard";

                    } else {

                        document
                            .getElementById(
                                "message"
                            )
                            .textContent =
                                response.error;

                    }

                }
            );

        }


        document
            .querySelectorAll(
                ".planner"
            )
            .forEach(form => {

                form.addEventListener(
                    "submit",
                    async event => {

                        event.preventDefault();


                        const endpoint =
                            form.dataset.endpoint;


                        const options = {
                            method: "POST",
                            headers: {}
                        };


                        if (
                            endpoint ===
                            "/generate-jewelry"
                        ) {

                            options.body =
                                new FormData(
                                    form
                                );

                        } else {

                            const formData =
                                new FormData(
                                    form
                                );


                            const data =
                                Object.fromEntries(
                                    formData
                                );


                            [
                                "budget",
                                "lights",
                                "fans",
                                "furniture",
                                "decor",
                                "guests"
                            ].forEach(
                                key => {

                                    if (
                                        key in data
                                    ) {

                                        data[key] =
                                            Number(
                                                data[key] ||
                                                0
                                            );

                                    }

                                }
                            );


                            options.headers[
                                "Content-Type"
                            ] =
                                "application/json";


                            options.body =
                                JSON.stringify(
                                    data
                                );

                        }


                        const response =
                            await fetch(
                                endpoint,
                                options
                            );


                        const data =
                            await response.json();


                        if (
                            response.status ===
                            401
                        ) {

                            location.href =
                                "/login";

                            return;

                        }


                        showResult(data);

                    }
                );

            });

    }
);