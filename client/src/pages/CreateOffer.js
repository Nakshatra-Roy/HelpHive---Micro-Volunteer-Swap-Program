import React, { useState } from "react";

const CreateOffer = () => {
  const [form, setForm] = useState({
    offerTitle: "",
    offerDescription: "",
    offerDuration: "",
    offerCategory: "",
    availability: "",
    location: "",
    helpersRequired: 1,
    skillsRequiredInput: "",
    contactInfo: "",
  });

  const [notice, setNotice] = useState(null); // { type: 'success' | 'warning' | 'error', message }
  const [loading, setLoading] = useState(false);

  const show = (type, message) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 3000);
  };

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const required = [
      ["offerTitle", form.offerTitle],
      ["offerDescription", form.offerDescription],
      ["offerDuration", form.offerDuration],
      ["offerCategory", form.offerCategory],
      ["location", form.location],
    ];
    const missing = required.filter(([, v]) => !String(v || "").trim()).map(([k]) => k);
    if (missing.length) {
      show("warning", `Please fill: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      offerTitle: form.offerTitle,
      offerDescription: form.offerDescription,
      offerDuration: form.offerDuration,
      offerCategory: form.offerCategory,
      location: form.location,
      helpersRequired: Number(form.helpersRequired) || 1,
      skillsRequired: form.skillsRequiredInput, // keep as provided
      contactInfo: form.contactInfo,
      ...(form.availability.trim() ? { availability: form.availability.trim() } : {}),
    };

    try {
      setLoading(true);
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to create offer");
      }

      show("success", data?.message || "Offer created successfully");
      setForm({
        offerTitle: "",
        offerDescription: "",
        offerDuration: "",
        offerCategory: "",
        availability: "",
        location: "",
        helpersRequired: 1,
        skillsRequiredInput: "",
        contactInfo: "",
      });
    } catch (err) {
      show("error", err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const pillClass =
    notice?.type === "success"
      ? "pill easy"
      : notice?.type === "warning"
      ? "pill medium"
      : notice?.type === "error"
      ? "pill hard"
      : "pill";

  return (
    <>
      <div className="backdrop">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="grid-overlay" />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Create New Offer</h2>
          </div>

          {notice && (
            <div className={pillClass} role="status" aria-live="polite" style={{ marginBottom: 14, display: "inline-block" }}>
              {notice.message}
            </div>
          )}

          <div className="card glass">
            <form onSubmit={handleSubmit} className="offer-form">
              <div className="form-shell">
                <div className="field">
                  <label htmlFor="offerTitle" className="label">Offer Title</label>
                  <input
                    id="offerTitle"
                    placeholder="Choose a catchy title!"
                    className="input glass-input"
                    value={form.offerTitle}
                    onChange={(e) => onChange("offerTitle", e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="offerDescription" className="label">Description</label>
                  <textarea
                    id="offerDescription"
                    placeholder="Describe the offer in detail..."
                    className="input glass-input textarea"
                    value={form.offerDescription}
                    onChange={(e) => onChange("offerDescription", e.target.value)}
                  />
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label htmlFor="location" className="label">Location</label>
                    <input
                      id="location"
                      placeholder="Road, City / Area"
                      className="input glass-input"
                      value={form.location}
                      onChange={(e) => onChange("location", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="availability" className="label">Availability</label>
                    <input
                      id="availability"
                      placeholder="e.g., Weekdays, 9am–5pm, Flexible"
                      className="input glass-input"
                      value={form.availability}
                      onChange={(e) => onChange("availability", e.target.value)}
                    />
                    <p className="card-sub hint">Leave blank to use default "available"</p>
                  </div>
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label htmlFor="offerDuration" className="label">Duration</label>
                    <input
                      id="offerDuration"
                      placeholder="e.g., 2 weeks, 1 day, 5 hours"
                      className="input glass-input"
                      value={form.offerDuration}
                      onChange={(e) => onChange("offerDuration", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="offerCategory" className="label">Category</label>
                    <input
                      id="offerCategory"
                      placeholder="e.g., Education, Medical, Home"
                      className="input glass-input"
                      value={form.offerCategory}
                      onChange={(e) => onChange("offerCategory", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid cols-2 gap">
                  <div className="field">
                    <label htmlFor="helpersRequired" className="label">Helpers Required</label>
                    <input
                      id="helpersRequired"
                      type="number"
                      min={1}
                      className="input glass-input"
                      value={form.helpersRequired}
                      onChange={(e) =>
                        onChange("helpersRequired", Math.max(1, parseInt(e.target.value || "1", 10)))
                      }
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="skillsRequired" className="label">Skills Required</label>
                    <input
                      id="skillsRequired"
                      placeholder="Comma-separated (e.g., Gardening, DIY, Driving)"
                      className="input glass-input"
                      value={form.skillsRequiredInput}
                      onChange={(e) => onChange("skillsRequiredInput", e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="contactInfo" className="label">Contact Info</label>
                  <input
                    id="contactInfo"
                    placeholder="Email or phone, e.g., user@example.com, +880..."
                    className="input glass-input"
                    value={form.contactInfo}
                    onChange={(e) => onChange("contactInfo", e.target.value)}
                  />
                </div>

                <div className="actions">
                  <button type="submit" className="btn glossy primary" disabled={loading} style={{ opacity: loading ? 0.8 : 1 }}>
                    {loading ? "Creating..." : "Create Offer"}
                  </button>
                  <button
                    type="button"
                    className="btn glossy ghost"
                    onClick={() =>
                      setForm({
                        offerTitle: "",
                        offerDescription: "",
                        offerDuration: "",
                        offerCategory: "",
                        availability: "",
                        location: "",
                        helpersRequired: 1,
                        skillsRequiredInput: "",
                        contactInfo: "",
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <style>
        {`
          .offer-form .form-shell {
            padding: 16px;
          }

          .offer-form .field {
            margin-bottom: 14px;
          }

          .offer-form .label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
          }

          .offer-form .input.glass-input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px) saturate(120%);
            -webkit-backdrop-filter: blur(8px) saturate(120%);
            transition: box-shadow .2s ease, transform .1s ease, border-color .2s ease;
          }

          .offer-form .input.glass-input:focus {
            outline: none;
            border-color: rgba(16,185,129,0.5);
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
          }

          .offer-form .textarea {
            min-height: 120px;
            resize: vertical;
          }

          .offer-form .grid.cols-2.gap {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .offer-form .hint {
            margin-top: 6px;
          }

          .offer-form .actions {
            display: flex;
            gap: 12px;
            margin-top: 18px;
          }

          @media (max-width: 640px) {
            .offer-form .grid.cols-2.gap {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </>
  );
};

export default CreateOffer;