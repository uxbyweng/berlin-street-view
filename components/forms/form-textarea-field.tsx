import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type FormTextareaFieldProps<TFormValues extends FieldValues> = {
  name: FieldPath<TFormValues>;
  label: string;
  rows: number;
  control: Control<TFormValues>;
  placeholder?: string;
};

export function FormTextareaField<TFormValues extends FieldValues>({
  name,
  label,
  rows,
  control,
  placeholder,
}: FormTextareaFieldProps<TFormValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-xl" htmlFor={field.name}>
            {label}
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              {...field}
              id={field.name}
              rows={rows}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              className="bg-gray-800! text-lg!"
            />
            <InputGroupAddon align="block-end">
              <InputGroupText className="tabular-nums">
                {(field.value ?? "").length}/1000
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
