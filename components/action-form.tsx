"use client";

import { useActionState, useEffect } from "react";
import Swal from "sweetalert2";

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
      if (confirmMessage) {
        const result = await Swal.fire({
          title: "Confirmar accion",
          text: confirmMessage,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d7772f",
          cancelButtonColor: "#68746d",
          confirmButtonText: "Si, continuar",
          cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) {
          return {};
        }
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

  useEffect(() => {
    if (state.success) {
      void Swal.fire({
        title: "Listo",
        text: state.success,
        icon: "success",
        confirmButtonColor: "#d7772f",
      });
    }

    if (state.error) {
      void Swal.fire({
        title: "No se pudo completar",
        text: state.error,
        icon: "error",
        confirmButtonColor: "#d7772f",
      });
    }
  }, [state.error, state.success]);

  return (
    <form action={formAction} className={className} id={id}>
      {children}
      <input name="_pending" type="hidden" value={pending ? "1" : "0"} />
    </form>
  );
}
