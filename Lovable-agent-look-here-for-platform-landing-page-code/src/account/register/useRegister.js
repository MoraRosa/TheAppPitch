/**
 * useRegister -- form state machine for the merchant sign-up surface.
 *
 * Owns store-name/email/password/confirm input state, the per-field
 * touch + Zod-validation lifecycle, the live password strength
 * snapshot, the show/hide-password toggles, and submission against
 * the backend's merchant registration endpoint.
 *
 * Backend contract: POST /api/v1/merchants/register uses the service
 * role to atomically create the tenant + user pair and triggers the
 * verification email. The endpoint is unauthenticated by design, so
 * this hook calls it via raw fetch rather than the apiClient (which
 * would attach a bearer token the route does not accept).
 *
 * The request includes verifyRedirectTo: the absolute URL Supabase
 * should land the recipient on after consuming the verification link.
 * The backend re-validates it against its own platform/merchant origin
 * allow-list before embedding it in the email, so a tampered value
 * cannot redirect off-host.
 *
 * On success the user has no session yet -- they must verify the email
 * link first. We navigate same-host to /verify-email?email=... so the
 * "check your inbox" surface can render the address and drive the
 * resend-verification action. The query param is preserved across the
 * navigation so refresh-and-resend works without depending on router
 * state.
 *
 * @module account/register/useRegister
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  merchantRegistrationSchema,
  checkPasswordStrength,
  validateField,
  emailSchema,
  passwordSchema,
  storeNameSchema,
} from "@theapp/config/validation";
import { emailVerifiedRedirectUrl } from "../emailVerifiedPath.js";
import {
  readIntentFromParams,
  stashIntent,
  appendIntentToUrl,
} from "../_signupIntent.js";

const INITIAL_FORM = {
  storeName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const INITIAL_STRENGTH = { score: 0, feedback: [], strength: "weak" };

const SUCCESS_REDIRECT_DELAY_MS = 2000;

export function useRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(INITIAL_STRENGTH);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signup intent (plan/price/interval/currency) arrives from the
  // marketing pricing CTAs cross-host. Stash it once so it survives
  // same-host nav (verify-email, login, select-business); the bounce
  // page on the merchant host re-reads it after handoff to drive the
  // checkout-session POST.
  const intent = useMemo(
    () => readIntentFromParams(searchParams),
    [searchParams],
  );
  useEffect(() => {
    if (intent) stashIntent(intent);
  }, [intent]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength(INITIAL_STRENGTH);
    }
  }, [formData.password]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [fieldErrors],
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      let validation = null;
      if (name === "email") validation = validateField(emailSchema, value);
      else if (name === "password")
        validation = validateField(passwordSchema, value);
      else if (name === "storeName")
        validation = validateField(storeNameSchema, value);
      else if (name === "confirmPassword") {
        validation =
          value === formData.password
            ? { valid: true, error: null }
            : { valid: false, error: "Passwords do not match" };
      }

      if (!validation) return;
      if (!validation.valid) {
        setFieldErrors((prev) => ({ ...prev, [name]: validation.error }));
      } else {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    },
    [formData.password],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setFieldErrors({});

      if (formData.password !== formData.confirmPassword) {
        setFieldErrors({ confirmPassword: "Passwords do not match" });
        setError("Please fix the errors below");
        return;
      }

      try {
        merchantRegistrationSchema.parse({
          email: formData.email,
          password: formData.password,
          storeName: formData.storeName,
        });
      } catch (validationError) {
        if (validationError.errors) {
          const errors = {};
          validationError.errors.forEach((err) => {
            errors[err.path[0]] = err.message;
          });
          setFieldErrors(errors);
          setError("Please fix the errors below");
        }
        return;
      }

      setLoading(true);

      try {
        const apiUrl = (
          import.meta.env.VITE_API_BASE_URL ||
          import.meta.env.VITE_API_URL ||
          "http://localhost:4000"
        ).replace(/\/$/, "");
        const response = await fetch(`${apiUrl}/api/v1/merchants/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            storeName: formData.storeName,
            verifyRedirectTo: emailVerifiedRedirectUrl(intent),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.errors && Array.isArray(data.errors)) {
            const errors = {};
            data.errors.forEach((err) => {
              errors[err.field] = err.message;
            });
            setFieldErrors(errors);
            setError(data.message || "Please fix the errors below");
          } else {
            setError(data.message || "Failed to create account");
          }
          setLoading(false);
          return;
        }

        setSuccess(
          "Account created successfully! Please check your email to verify your account.",
        );

        setTimeout(() => {
          const verifyHref = appendIntentToUrl(
            `/verify-email?email=${encodeURIComponent(formData.email)}`,
            intent,
          );
          navigate(verifyHref, { replace: true });
        }, SUCCESS_REDIRECT_DELAY_MS);
      } catch (err) {
        setError(err?.message || "Failed to create account");
        setLoading(false);
      }
    },
    [formData, navigate, intent],
  );

  return {
    formData,
    fieldErrors,
    touched,
    error,
    success,
    loading,
    passwordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
