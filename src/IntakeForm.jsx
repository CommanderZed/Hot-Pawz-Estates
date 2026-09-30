import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function IntakeForm({ contactEmail }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: "", email: "", phone: "", items: "", condition: "" }
  });
  const [status, setStatus] = useState("idle");
  const thanksRef = useRef(null);

  async function onSubmit(values) {
    setStatus("idle");
    const body = new FormData();
    body.append("_subject", "Hot Pawz Estates: new consignment inquiry");
    body.append("_template", "table");
    body.append("_captcha", "false");
    body.append("_replyto", values.email);
    body.append("Name", values.name);
    body.append("Email", values.email);
    body.append("Phone", values.phone || "Not provided");
    body.append("Items", values.items);
    body.append("Condition notes", values.condition || "None provided");
    Array.from(values.photos || []).forEach((file) => body.append("attachment", file));

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) === "false") throw new Error(result.message);
    } catch {
      setStatus("error");
      return;
    }

    reset();
    setStatus("sent");
    requestAnimationFrame(() => thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  if (status === "sent") {
    return (
      <div className="thanks" role="status" ref={thanksRef}>
        <p>
          <strong>Thank you.</strong> We will respond by email. Should photographs be absent from your submission, we
          will request them at that time.
        </p>
        <button type="button" className="btn" onClick={() => setStatus("idle")}>
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="intake-name">Your name</label>
        <input
          id="intake-name"
          type="text"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : undefined}
          {...register("name", { required: "Please enter your name." })}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="intake-email">Email</label>
        <input
          id="intake-email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          {...register("email", {
            required: "Please enter your email address.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a complete email address." }
          })}
        />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="intake-phone">
          Phone <span className="optional">(optional)</span>
        </label>
        <input id="intake-phone" type="tel" autoComplete="tel" {...register("phone")} />
      </div>

      <div className="field">
        <label htmlFor="intake-items">Describe your items</label>
        <textarea
          id="intake-items"
          placeholder="e.g., books, CDs, vinyl; approximate quantity"
          aria-invalid={errors.items ? "true" : undefined}
          {...register("items", { required: "Please share a brief description of your items." })}
        />
        {errors.items && <p className="field-error">{errors.items.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="intake-photos">
          Photographs <span className="optional">(optional)</span>
        </label>
        <input id="intake-photos" type="file" accept="image/*" multiple aria-describedby="intake-photos-hint" {...register("photos")} />
        <p className="hint" id="intake-photos-hint">
          They enable a faster assessment.
        </p>
      </div>

      <div className="field">
        <label htmlFor="intake-condition">
          Please note anything regarding condition <span className="optional">(optional)</span>
        </label>
        <textarea
          id="intake-condition"
          placeholder="Smoke, pests, mold, damage, or anything else we should know"
          {...register("condition")}
        />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          We were unable to send your submission. Please try again, or email us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      )}

      <button className="btn send" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
