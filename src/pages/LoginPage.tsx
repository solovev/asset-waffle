import { useAccessContext } from "@/app/providers";
import { Button, TextInput, InlineLoading } from "@carbon/react";
import React, { ChangeEvent } from "react";

export const LoginPage = () => {
  const { loading, attempt, error, submitPassword } = useAccessContext();
  const [password, setPassword] = React.useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleSubmit = () => {
    if (!password) {
      document.getElementById("password")?.focus();
      return;
    }
    submitPassword(password);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="sm:w-96 w-full px-5">
        <TextInput
          value={password}
          id="password"
          type="password"
          labelText="Password"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <div className="mt-4">
          {renderLoading() || renderButton()}
          {renderTip()}
        </div>
      </div>
    </div>
  );

  function renderButton() {
    return (
      <Button
        kind={error ? "danger" : "primary"}
        size="sm"
        onClick={handleSubmit}
      >
        Log In
      </Button>
    );
  }

  function renderLoading() {
    if (!loading) {
      return null;
    }
    return <InlineLoading description="Logging in..." />;
  }

  function renderTip() {
    if (attempt <= 10) {
      return null;
    }
    return (
      <div className="mt-2 text-zinc-500">
        Tip:&nbsp;
        <span className="text-sm text-zinc-400">
          {import.meta.env.VITE_TIP}
        </span>
      </div>
    );
  }
};
