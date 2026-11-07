import { useEffect, useState } from "react";
import "./ContactUs.css";
import { API_ROOT_URL, authenticatedFetch } from "./api";

const initialFormData = {
    subject: "",
    message: ""
};

function ContactUs({ onNavigate }) {
    const [formData, setFormData] = useState(initialFormData);
    const [user, setUser] = useState(null);
    const [feedback, setFeedback] = useState({ type: "", text: "" });
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let isCurrent = true;

        const loadUser = async () => {
            try {
                const response = await authenticatedFetch("/profile");
                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    onNavigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load your account details.");
                }

                if (isCurrent) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Contact form user details could not be loaded:", error);
                if (isCurrent) {
                    setFeedback({
                        type: "error",
                        text: error.message || "Unable to connect to the server."
                    });
                }
            } finally {
                if (isCurrent) {
                    setIsLoadingUser(false);
                }
            }
        };

        loadUser();
        return () => {
            isCurrent = false;
        };
    }, [onNavigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFeedback({ type: "", text: "" });
        setIsSubmitting(true);

        try {
            const response = await authenticatedFetch("/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }, API_ROOT_URL);
            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem("token");
                onNavigate("/login");
                return;
            }

            if (!response.ok) {
                setFeedback({
                    type: "error",
                    text: data.message || "Your message could not be sent. Please try again."
                });
                return;
            }

            setFormData(initialFormData);
            setFeedback({
                type: "success",
                text: data.message || "Thanks for reaching out. Your message has been received."
            });
        } catch (error) {
            console.error("Contact form submission failed:", error);
            setFeedback({
                type: "error",
                text: "Unable to connect to the server. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="contact-page">
            <section className="contact-card" aria-labelledby="contact-title">
                <button
                    className="contact-home-link"
                    type="button"
                    onClick={() => onNavigate("/dashboard")}
                >
                    Back to dashboard
                </button>
                <h1 id="contact-title">Contact Us</h1>
                <p className="contact-intro">Have a question? Send our team a message.</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <label htmlFor="contact-name">Name</label>
                    <input
                        id="contact-name"
                        type="text"
                        value={isLoadingUser ? "Loading..." : user?.full_name || ""}
                        readOnly
                        aria-busy={isLoadingUser}
                    />

                    <label htmlFor="contact-email">Email</label>
                    <input
                        id="contact-email"
                        type="email"
                        value={isLoadingUser ? "Loading..." : user?.email || ""}
                        readOnly
                        aria-busy={isLoadingUser}
                    />

                    <label htmlFor="contact-subject">Subject</label>
                    <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        maxLength={200}
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        maxLength={5000}
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />

                    <button
                        className="contact-submit"
                        type="submit"
                        disabled={isSubmitting || isLoadingUser || !user}
                    >
                        {isSubmitting ? "Sending..." : "Submit"}
                    </button>
                    {feedback.text && (
                        <p
                            className={`contact-feedback ${feedback.type}`}
                            role={feedback.type === "error" ? "alert" : "status"}
                        >
                            {feedback.text}
                        </p>
                    )}
                </form>
            </section>
        </main>
    );
}

export default ContactUs;
