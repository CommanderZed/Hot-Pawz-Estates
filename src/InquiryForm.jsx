import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const INQUIRY_EMAIL = "Zachary.polio@gmail.com";
const fieldClass =
  "w-full rounded-lg border border-stonewarm-300 bg-white px-3 py-2 text-sm text-slateink-800 outline-none ring-ambergold-500/40 placeholder:text-slateink-500/70 focus:border-ambergold-600 focus:ring-2";
const radioClass =
  "inline-flex cursor-pointer items-center rounded-lg border border-stonewarm-300 bg-white px-3 py-1.5 text-sm font-medium text-slateink-700 transition has-[:checked]:border-ambergold-600 has-[:checked]:bg-ambergold-500/10 has-[:checked]:text-slateink-800";

export default function InquiryForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      area: "",
      overview: "",
      timeline: "",
      propertyType: "",
      smoke: "",
      moisture: "",
      notes: ""
    }
  });

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [photos, setPhotos] = useState([]);

  const photoList = watch("photos");

  useEffect(() => {
    const files = photoList ? Array.from(photoList) : [];
    const next = files.map((file) => ({
      file,
      url: /\.(heic|heif)$/i.test(file.name) ? "" : URL.createObjectURL(file)
    }));
    setPhotos((prev) => {
      prev.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
      return next;
    });
  }, [photoList]);

  function removePhoto(index) {
    const current = photoList ? Array.from(photoList) : [];
    const dt = new DataTransfer();
    current.forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    setValue("photos", dt.files);
  }

  async function onSubmit(values) {
    setStatus("idle");
    setErrorMessage("");
    const body = new FormData();
    body.append("_subject", "Hot Pawz Estates inquiry");
    body.append("_template", "table");
    body.append("_captcha", "false");
    body.append("Full name", values.fullName);
    body.append("Email", values.email);
    body.append("Phone", values.phone);
    body.append("Neighborhood / area", values.area);
    body.append("Overview", values.overview);
    body.append("Timeline", values.timeline);
    body.append("Property type", values.propertyType);
    body.append("Smoke exposure", values.smoke);
    body.append("Mold / moisture / pests", values.moisture);
    body.append("Additional notes", values.notes || "None");
    const files = values.photos ? Array.from(values.photos) : [];
    files.forEach((file) => body.append("attachment", file));

    const response = await fetch(`https://formsubmit.co/ajax/${INQUIRY_EMAIL}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === "false") {
      setStatus("error");
      setErrorMessage(result.message || "Something went wrong. Please try again or email us directly.");
      return;
    }
    reset();
    setValue("photos", undefined);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="mt-4 rounded-xl border border-slateink-800/15 bg-white p-4 shadow-card" role="status">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ambergold-600">Inquiry received</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-slateink-800">Thank you. We have your details.</h3>
        <p className="mt-3 text-sm leading-relaxed text-slateink-600">
          Your consultation request is in. We typically reply within 24 to 48 hours. There is no charge and no obligation to proceed.
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-slateink-800 px-5 py-2 text-sm font-semibold text-stonewarm-50 transition hover:bg-slateink-700"
          onClick={() => setStatus("idle")}
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset className="space-y-3">
        <legend className="font-display text-base font-semibold text-slateink-800">Primary contact</legend>
        <div className="grid gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Full name *</span>
            <input className={fieldClass} autoComplete="name" {...register("fullName", { required: "Please add your name." })} />
            {errors.fullName && <p className="mt-1 text-sm text-ambergold-700">{errors.fullName.message}</p>}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Email address *</span>
            <input
              type="email"
              className={fieldClass}
              autoComplete="email"
              {...register("email", {
                required: "Please add an email.",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email." }
              })}
            />
            {errors.email && <p className="mt-1 text-sm text-ambergold-700">{errors.email.message}</p>}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Phone number *</span>
            <input className={fieldClass} type="tel" autoComplete="tel" {...register("phone", { required: "Please add a phone number." })} />
            {errors.phone && <p className="mt-1 text-sm text-ambergold-700">{errors.phone.message}</p>}
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Durham neighborhood / general area *</span>
            <input className={fieldClass} placeholder="Trinity Park, Hope Valley, North Durham" {...register("area", { required: "Please add a general area." })} />
            {errors.area && <p className="mt-1 text-sm text-ambergold-700">{errors.area.message}</p>}
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="font-display text-base font-semibold text-slateink-800">Scope</legend>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slateink-700">What do you have? *</span>
          <textarea
            rows="3"
            className={fieldClass}
            placeholder="Item types, rough quantity, and whether this is a full house or a focused collection."
            {...register("overview", { required: "Please share a short overview." })}
          />
          {errors.overview && <p className="mt-1 text-sm text-ambergold-700">{errors.overview.message}</p>}
        </label>
        <div className="grid gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Preferred timeline *</span>
            <select className={fieldClass} {...register("timeline", { required: "Please choose a timeline." })}>
              <option value="">Select a timeline</option>
              <option value="Urgent: 1-2 weeks">Urgent: 1-2 weeks</option>
              <option value="Standard: 30-45 days">Standard: 30-45 days</option>
              <option value="Early planning: 60+ days">Early planning: 60+ days</option>
            </select>
            {errors.timeline && <p className="mt-1 text-sm text-ambergold-700">{errors.timeline.message}</p>}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">Property type *</span>
            <select className={fieldClass} {...register("propertyType", { required: "Please choose a property type." })}>
              <option value="">Select property type</option>
              <option value="Single family">Single family</option>
              <option value="Condo / townhome">Condo / townhome</option>
              <option value="Storage facility">Storage facility</option>
              <option value="Commercial">Commercial</option>
            </select>
            {errors.propertyType && <p className="mt-1 text-sm text-ambergold-700">{errors.propertyType.message}</p>}
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-base font-semibold text-slateink-800">Condition</legend>
        <div>
          <p className="mb-2 text-sm font-medium text-slateink-700">Has the collection or property experienced cigarette or tobacco smoke? *</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["No (Smoke-free)", "No (Smoke-free)"],
              ["Yes", "Yes"],
              ["Unsure", "Unsure"]
            ].map(([label, value]) => (
              <label key={value} className={radioClass}>
                <input className="sr-only" type="radio" value={value} {...register("smoke", { required: "Please choose one." })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {errors.smoke && <p className="mt-2 text-sm text-ambergold-700">{errors.smoke.message}</p>}
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-slateink-700">Is there any known mold, dampness, moisture intrusion, or active pest exposure? *</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["No mold / Dry", "No mold / Dry"],
              ["Minor / past dampness", "Minor / past dampness"],
              ["Yes / Active", "Yes / Active"]
            ].map(([label, value]) => (
              <label key={value} className={radioClass}>
                <input className="sr-only" type="radio" value={value} {...register("moisture", { required: "Please choose one." })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {errors.moisture && <p className="mt-2 text-sm text-ambergold-700">{errors.moisture.message}</p>}
        </div>
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-slateink-700">
              Additional notes <span className="font-normal text-slateink-500">(optional)</span>
            </span>
            <textarea rows="2" className={fieldClass} {...register("notes")} />
        </label>
      </fieldset>

      <fieldset>
        <legend className="font-display text-base font-semibold text-slateink-800">Photos</legend>
        <p className="mt-1 text-sm text-slateink-600">JPG, PNG, WEBP, or HEIC. Optional, but helpful.</p>
        <label
          className="mt-2 block w-full cursor-pointer rounded-xl border-2 border-dashed border-stonewarm-300 bg-white px-4 py-5 text-center transition hover:border-ambergold-500 hover:bg-ambergold-500/5"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (event.dataTransfer.files?.length) setValue("photos", event.dataTransfer.files, { shouldValidate: true });
          }}
        >
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
            multiple
            {...register("photos")}
          />
          <p className="text-sm font-medium text-slateink-800">Tap to add photos</p>
          <p className="mt-1 text-sm text-slateink-500">or drop files here</p>
        </label>
        <p className="mt-2 inline-flex items-center rounded-full bg-stonewarm-200 px-3 py-1 text-xs font-semibold text-slateink-700">
          {photos.length === 1 ? "1 photo" : `${photos.length} photos`}
        </p>
        {photos.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((item, index) => (
              <li key={`${item.file.name}-${index}`} className="relative overflow-hidden rounded-lg border border-stonewarm-200 bg-stonewarm-200">
                {item.url ? (
                  <img src={item.url} alt="" className="h-20 w-full object-cover" />
                ) : (
                  <div className="flex h-20 items-center justify-center px-2 text-center text-[11px] font-medium text-slateink-600">
                    {item.file.name}
                  </div>
                )}
                <button
                  type="button"
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slateink-800/85 text-sm font-semibold leading-none text-white hover:bg-slateink-800"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => removePhoto(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div>
        <p className="text-sm leading-relaxed text-slateink-500">
          Consultations are free and confidential. We typically reply within 24 to 48 hours.
        </p>
        {status === "error" && <p className="mt-3 text-sm text-ambergold-700">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 w-full rounded-lg bg-ambergold-600 px-5 py-2.5 text-sm font-semibold text-stonewarm-50 shadow-lift transition hover:bg-ambergold-700 disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? "Sending..." : "Request free consultation"}
        </button>
      </div>
    </form>
  );
}
