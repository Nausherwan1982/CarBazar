"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!/^92\d{10}$/.test(phone)) {
      setMessage("Enter your phone number in the format 92XXXXXXXXXX.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage(result.error || "Could not send your verification code.");
        return;
      }
      setSent(true);
    } catch {
      setMessage("Could not send your verification code. Please try again.");
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setVerifying(true);
    try {
      const result = await signIn("phone-otp", {
        phone,
        code,
        redirect: false,
      });
      if (result?.error) {
        setMessage("The code is invalid or has expired. Request a new code.");
        return;
      }
      router.push("/my-ads");
      router.refresh();
    } catch {
      setMessage("Sign-in failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Sign in to CarBazar</h1>
      <p className="mt-2 text-sm text-gray-600">
        Verify your phone number to manage your ads and messages.
      </p>
      <form
        className="mt-5 space-y-4"
        onSubmit={sent ? verifyOtp : sendOtp}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">Phone number</span>
          <input
            className="input"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="92XXXXXXXXXX"
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
            required
            disabled={sent}
          />
        </label>
        {sent && (
          <label className="block space-y-1">
            <span className="text-sm font-medium">Verification code</span>
            <input
              className="input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              placeholder="6-digit code"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              required
            />
          </label>
        )}
        {message && (
          <p role="alert" className="text-sm text-red-600">
            {message}
          </p>
        )}
        <button
          className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
          type="submit"
          disabled={sending || verifying}
        >
          {sent
            ? verifying
              ? "Verifying..."
              : "Verify and sign in"
            : sending
              ? "Sending code..."
              : "Send verification code"}
        </button>
        {sent && (
          <button
            className="w-full text-sm text-gray-600 underline"
            type="button"
            onClick={() => {
              setSent(false);
              setCode("");
              setMessage("");
            }}
            disabled={verifying}
          >
            Use a different phone number
          </button>
        )}
      </form>
    </section>
  );
}
