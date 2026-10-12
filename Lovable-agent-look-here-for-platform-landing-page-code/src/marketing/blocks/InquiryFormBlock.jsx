/**
 * InquiryFormBlock -- TheApp's own prospect contact form, rendered as a
 * marketing page block.
 *
 * Block schema (migration 20260806000002 -- 'inquiry_form'): every
 * user-facing string is a block prop authored in the CMS. This
 * component reads those props and never hardcodes copy -- labels,
 * placeholders, help text, inquiry-type options, submit/submitting
 * labels, success and error messages, the required-field hint, and the
 * published phone number all come from `block`. Missing props fall back
 * to empty strings (the field simply renders without that optional
 * copy) rather than an inlined default, keeping the CMS the single
 * source of truth for wording.
 *
 * The form submits to the public platform inquiries endpoint via
 * submitInquiry (marketing stays a zero-auth bundle). name, email,
 * phone, and message are all required; validation runs client-side for
 * immediate feedback and is re-enforced by the backend. A hidden
 * honeypot field ("website") traps bots.
 *
 * Accessibility: each input has an associated <label>; errors are
 * programmatically linked via aria-describedby and announced through a
 * role="alert" live region; the submit result is announced via an
 * aria-live region; invalid fields carry aria-invalid. Focus moves to
 * the first invalid field on a failed submit.
 *
 * @module marketing/blocks/InquiryFormBlock
 */

import React from "react";
import styled from "styled-components";
import { Section, SectionInner } from "./_section.js";
import { submitInquiry, InquirySubmitError } from "../cms/submitInquiry.js";

const Header = styled.div`
  text-align: center;
  margin: 0 auto var(--brand-space-8);
  max-width: var(--brand-size-proseMax);
`;

const Eyebrow = styled.p`
  text-transform: uppercase;
  letter-spacing: var(--brand-letterSpacing-wide);
  font-size: var(--brand-fontSize-sm);
  font-weight: var(--brand-fontWeight-semibold);
  color: var(--brand-color-primary600);
  margin: 0 0 var(--brand-space-2);
`;

const Heading = styled.h2`
  font-size: var(--brand-fontSizeFluid-heading);
  line-height: var(--brand-lineHeight-tight);
  margin: 0 0 var(--brand-space-3);
  color: var(--brand-color-neutral900);
`;

const Subheading = styled.p`
  font-size: var(--brand-fontSize-lg);
  line-height: var(--brand-lineHeight-relaxed);
  color: var(--brand-color-neutral700);
  margin: 0;
`;

const Card = styled.div`
  max-width: var(--brand-size-panelMax);
  margin: 0 auto;
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-neutral200);
  border-radius: var(--brand-radius-xl);
  box-shadow: var(--brand-shadow-card);
  padding: var(--brand-space-8);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-4);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--brand-space-2);
`;

const Label = styled.label`
  font-size: var(--brand-fontSize-sm);
  font-weight: var(--brand-fontWeight-semibold);
  color: var(--brand-color-neutral900);
`;

const RequiredMark = styled.span`
  color: var(--brand-color-danger700);
  margin-left: var(--brand-space-1);
`;

const controlStyles = `
  font: inherit;
  width: 100%;
  padding: var(--brand-space-3);
  color: var(--brand-color-neutral900);
  background: var(--brand-color-neutral0);
  border: var(--brand-borderWidth-hairline) solid
    var(--brand-color-neutral300);
  border-radius: var(--brand-radius-md);
  &:focus {
    outline: var(--brand-borderWidth-thick) solid
      var(--brand-color-primary500);
    outline-offset: var(--brand-focusRing-offset);
    border-color: var(--brand-color-primary500);
  }
  &[aria-invalid="true"] {
    border-color: var(--brand-color-danger500);
  }
`;

const Input = styled.input`
  ${controlStyles}
`;

const Select = styled.select`
  ${controlStyles}
`;

const Textarea = styled.textarea`
  ${controlStyles}
  min-height: var(--brand-space-24);
  resize: vertical;
`;

const FieldError = styled.p`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-danger700);
  margin: 0;
`;

const RequiredHint = styled.p`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
  margin: 0;
`;

const HelpText = styled.p`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-neutral500);
  margin: 0;
`;

const SubmitButton = styled.button`
  font: inherit;
  font-weight: var(--brand-fontWeight-semibold);
  padding: var(--brand-space-3) var(--brand-space-6);
  color: var(--brand-color-onPrimary);
  background: var(--brand-color-primary600);
  border: none;
  border-radius: var(--brand-radius-md);
  cursor: pointer;
  &:hover:not(:disabled) {
    background: var(--brand-color-primary700);
  }
  &:focus-visible {
    outline: var(--brand-borderWidth-thick) solid var(--brand-color-primary500);
    outline-offset: var(--brand-focusRing-offset);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  font-size: var(--brand-fontSize-sm);
  color: var(--brand-color-danger700);
  background: var(--brand-color-danger50);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-danger200);
  border-radius: var(--brand-radius-md);
  padding: var(--brand-space-3);
`;

const SuccessPanel = styled.div`
  text-align: center;
  background: var(--brand-color-success50);
  border: var(--brand-borderWidth-hairline) solid var(--brand-color-success200);
  border-radius: var(--brand-radius-md);
  padding: var(--brand-space-8);
`;

const SuccessHeading = styled.h3`
  font-size: var(--brand-fontSize-xl);
  color: var(--brand-color-success700);
  margin: 0 0 var(--brand-space-3);
`;

const SuccessMessage = styled.p`
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral700);
  margin: 0;
`;

const PhoneLine = styled.p`
  font-size: var(--brand-fontSize-base);
  color: var(--brand-color-neutral700);
  text-align: center;
  margin: var(--brand-space-6) 0 0;
`;

const PhoneLink = styled.a`
  color: var(--brand-color-primary700);
  font-weight: var(--brand-fontWeight-semibold);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// Off-screen honeypot: hidden from humans and assistive tech, but a
// bot that auto-fills every input will populate it, marking the
// submission for the backend to drop.
const Honeypot = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = true;
  if (!values.email.trim() || !EMAIL_RE.test(values.email)) errors.email = true;
  if (!values.phone.trim()) errors.phone = true;
  if (!values.message.trim()) errors.message = true;
  return errors;
}

export default function InquiryFormBlock({ block }) {
  const inquiryTypes = Array.isArray(block.inquiry_types)
    ? block.inquiry_types
    : [];

  const [values, setValues] = React.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiry_type: inquiryTypes[0]?.value || "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState("idle");
  const [submitError, setSubmitError] = React.useState("");

  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const phoneRef = React.useRef(null);
  const messageRef = React.useRef(null);
  const refs = {
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
    message: messageRef,
  };

  function update(key) {
    return (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstInvalid = ["name", "email", "phone", "message"].find(
      (k) => nextErrors[k],
    );
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await submitInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        company: values.company.trim() || undefined,
        inquiry_type: values.inquiry_type || undefined,
        message: values.message.trim(),
        source_page: block.source_page || undefined,
        website: values.website,
      });
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      const rateLimited =
        err instanceof InquirySubmitError && err.status === 429;
      setSubmitError(
        rateLimited && block.rate_limit_message
          ? block.rate_limit_message
          : block.error_message || "",
      );
    }
  }

  if (status === "success") {
    return (
      <Section>
        <SectionInner $max="narrow">
          <Card>
            <SuccessPanel role="status" aria-live="polite">
              {block.success_heading ? (
                <SuccessHeading>{block.success_heading}</SuccessHeading>
              ) : null}
              {block.success_message ? (
                <SuccessMessage>{block.success_message}</SuccessMessage>
              ) : null}
            </SuccessPanel>
            {block.phone_number ? (
              <PhoneLine>
                {block.phone_number_label ? `${block.phone_number_label} ` : ""}
                <PhoneLink
                  href={`tel:${block.phone_number.replace(/\s+/g, "")}`}
                >
                  {block.phone_number}
                </PhoneLink>
              </PhoneLine>
            ) : null}
          </Card>
        </SectionInner>
      </Section>
    );
  }

  return (
    <Section>
      <SectionInner $max="narrow">
        {(block.eyebrow || block.heading || block.subheading) && (
          <Header>
            {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
            {block.heading ? <Heading>{block.heading}</Heading> : null}
            {block.subheading ? (
              <Subheading>{block.subheading}</Subheading>
            ) : null}
          </Header>
        )}
        <Card>
          <Form onSubmit={handleSubmit} noValidate>
            {submitError ? (
              <ErrorBanner role="alert">{submitError}</ErrorBanner>
            ) : null}

            {block.required_hint ? (
              <RequiredHint>{block.required_hint}</RequiredHint>
            ) : null}

            <Field>
              <Label htmlFor="inquiry-name">
                {block.name_label}
                <RequiredMark aria-hidden="true">*</RequiredMark>
              </Label>
              <Input
                id="inquiry-name"
                ref={nameRef}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update("name")}
                placeholder={block.name_placeholder || ""}
                required
                aria-invalid={errors.name ? "true" : undefined}
                aria-describedby={
                  errors.name ? "inquiry-name-error" : undefined
                }
              />
              {errors.name && block.name_error ? (
                <FieldError id="inquiry-name-error">
                  {block.name_error}
                </FieldError>
              ) : null}
            </Field>

            <Field>
              <Label htmlFor="inquiry-email">
                {block.email_label}
                <RequiredMark aria-hidden="true">*</RequiredMark>
              </Label>
              <Input
                id="inquiry-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update("email")}
                placeholder={block.email_placeholder || ""}
                required
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={
                  errors.email ? "inquiry-email-error" : undefined
                }
              />
              {errors.email && block.email_error ? (
                <FieldError id="inquiry-email-error">
                  {block.email_error}
                </FieldError>
              ) : null}
            </Field>

            <Field>
              <Label htmlFor="inquiry-phone">
                {block.phone_label}
                <RequiredMark aria-hidden="true">*</RequiredMark>
              </Label>
              <Input
                id="inquiry-phone"
                ref={phoneRef}
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={update("phone")}
                placeholder={block.phone_placeholder || ""}
                required
                aria-invalid={errors.phone ? "true" : undefined}
                aria-describedby={
                  [
                    errors.phone ? "inquiry-phone-error" : null,
                    block.phone_help ? "inquiry-phone-help" : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
              />
              {block.phone_help ? (
                <HelpText id="inquiry-phone-help">{block.phone_help}</HelpText>
              ) : null}
              {errors.phone && block.phone_error ? (
                <FieldError id="inquiry-phone-error">
                  {block.phone_error}
                </FieldError>
              ) : null}
            </Field>

            <Field>
              <Label htmlFor="inquiry-company">{block.company_label}</Label>
              <Input
                id="inquiry-company"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={update("company")}
                placeholder={block.company_placeholder || ""}
              />
            </Field>

            {inquiryTypes.length > 0 ? (
              <Field>
                <Label htmlFor="inquiry-type">{block.inquiry_type_label}</Label>
                <Select
                  id="inquiry-type"
                  value={values.inquiry_type}
                  onChange={update("inquiry_type")}
                >
                  {inquiryTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : null}

            <Field>
              <Label htmlFor="inquiry-message">
                {block.message_label}
                <RequiredMark aria-hidden="true">*</RequiredMark>
              </Label>
              <Textarea
                id="inquiry-message"
                ref={messageRef}
                rows={5}
                value={values.message}
                onChange={update("message")}
                placeholder={block.message_placeholder || ""}
                required
                aria-invalid={errors.message ? "true" : undefined}
                aria-describedby={
                  errors.message ? "inquiry-message-error" : undefined
                }
              />
              {errors.message && block.message_error ? (
                <FieldError id="inquiry-message-error">
                  {block.message_error}
                </FieldError>
              ) : null}
            </Field>

            <Honeypot aria-hidden="true">
              <label htmlFor="inquiry-website">
                Leave this field empty
                <input
                  id="inquiry-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={update("website")}
                />
              </label>
            </Honeypot>

            <SubmitButton type="submit" disabled={status === "submitting"}>
              {status === "submitting"
                ? block.submitting_label || block.submit_label
                : block.submit_label}
            </SubmitButton>
          </Form>

          {block.phone_number ? (
            <PhoneLine>
              {block.phone_number_label ? `${block.phone_number_label} ` : ""}
              <PhoneLink href={`tel:${block.phone_number.replace(/\s+/g, "")}`}>
                {block.phone_number}
              </PhoneLink>
            </PhoneLine>
          ) : null}
        </Card>
      </SectionInner>
    </Section>
  );
}
