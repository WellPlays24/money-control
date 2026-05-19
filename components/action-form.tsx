"use client";

import { useActionState } from "react";

type ActionState = {
  error?: string;
  success?: string;
};

type ActionFormProps = {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  confirmMessage?: string;
  id?: string;
  successMessage?: string;
};

const initialState: ActionState = {};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "No se pudo completar la accion. Intentalo nuevamente.";
}

export function ActionForm({
  action,
  children,
  className,
  confirmMessage,
  id,
  successMessage = "Accion completada correctamente.",
}: ActionFormProps) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    async (_, formData) => {
      if (confirmMessage && !window.confirm(confirmMessage)) {
        return { error: "Accion cancelada." };
      }

      try {
        await action(formData);
        return { success: successMessage };
      } catch (error) {
        return { error: getErrorMessage(error) };
      }
    },
    initialState,
  );

  return (
    <form action={formAction} className={className} id={id}>
      {children}
      <input name="_pending" type="hidden" value={pending ? "1" : "0"} />
      {state.error ? <p className="form-message error-message">{state.error}</p> : null}
      {state.success ? <p className="form-message success-message">{state.success}</p> : null}
    </form>
  );
}
