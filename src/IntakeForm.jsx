import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const FORM_SUBMIT_EMAIL = "hotpawzestates@gmail.com";
const FORM_ACTION = `https://formsubmit.co/${FORM_SUBMIT_EMAIL}`;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export default function IntakeForm({ contactEmail = FORM_SUBMIT_EMAIL }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: { name: "", email: "", phone: "", items: "", condition: "" }
  });
  const formRef = useRef(null);
  const photoRef = useRef(null);
  const thanksRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [nextUrl, setNextUrl] = useState("/?inquiry=sent#start");
  const [sending, setSending] = useState(false);
  const replyTo = watch("email");

  useEffect(() => {
    setNextUrl(`${window.location.origin}/?inquiry=sent#start`);
    if (new URLSearchParams(window.location.search).get("inquiry") === "sent") {
      setStatus("sent");
      requestAnimationFrame(() => thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }, []);

  function onValid() {
    const form = formRef.current;
    const files = Array.from(photoRef.current?.files || []);
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_PHOTO_BYTES) {
      setErrorMessage("Please keep photographs under 10 MB in total so they can be emailed.");
      setStatus("error");
      return;
    }

    // FormSubmit emails files from native multipart posts, not from its AJAX endpoint.
    // One file per field named attachment, attachment2, … matches their upload docs.
    const picker = photoRef.current;
    if (picker && files.length > 1 && typeof DataTransfer !== "undefined") {
      picker.disabled = true;
      files.forEach((file, index) => {
        const input = document.createElement("input");
        input.type = "file";
        input.name = index === 0 ? "attachment" : `attachment${index + 1}`;
        input.hidden = true;
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        form.appendChild(input);
      });
    }

    setSending(true);
    HTMLFormElement.prototype.submit.call(form);
  }

  if (status === "sent") {
    return (
      <div className="thanks" role="status" ref={thanksRef}>
        <p>
          <strong>Thank you.</strong> We have received your inquiry, including any photographs you attached, and will
          respond by email.
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            window.history.replaceState({}, "", `${window.location.pathname}#start`);
            setStatus("idle");
          }}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={FORM_ACTION}
      method="POST"
      encType="multipart/form-data"
      acceptCharset="UTF-8"
      onSubmit={handleSubmit(onValid)}
      noValidate
    >
      <input type="hidden" name="_subject" value="Hot Pawz Estates: new consignment inquiry" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="text" name="_honey" className="honey" tabIndex="-1" autoComplete="off" aria-hidden="true" />

      <div className="field">
        <label htmlFor="intake-name">Your name</label>
        <input
          id="intake-name"
          type="text"
          name="name"
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
          name="email"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : undefined}
          {...register("email", {
            required: "Please enter your email address.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a complete email address." }
          })}
        />
        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>
      <input type="hidden" name="_replyto" value={replyTo} />

      <div className="field">
        <label htmlFor="intake-phone">
          Phone <span className="optional">(optional)</span>
        </label>
        <input id="intake-phone" type="tel" name="phone" autoComplete="tel" {...register("phone")} />
      </div>

      <div className="field">
        <label htmlFor="intake-items">Describe your items</label>
        <textarea
          id="intake-items"
          name="items"
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
        <input
          id="intake-photos"
          ref={photoRef}
          type="file"
          name="attachment"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic"
          multiple
          aria-describedby="intake-photos-hint"
        />
        <p className="hint" id="intake-photos-hint">
          They enable a faster assessment. JPG, PNG, or WEBP, under 10 MB total.
        </p>
      </div>

      <div className="field">
        <label htmlFor="intake-condition">
          Please note anything regarding condition <span className="optional">(optional)</span>
        </label>
        <textarea
          id="intake-condition"
          name="condition"
          placeholder="Smoke, pests, mold, damage, or anything else we should know"
          {...register("condition")}
        />
      </div>

      {status === "error" && (
        <p className="form-error" role="alert">
          {errorMessage || (
            <>
              We were unable to send your submission. Please try again, or email us at{" "}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </>
          )}
        </p>
      )}

      <button className="btn send" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
