"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "./field";
import type { Option } from "@/lib/bank-config";

export function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = "Select…",
  required,
  hint,
  className,
}: {
  label: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <Field
      label={label}
      htmlFor={id}
      required={required}
      hint={hint}
      className={className}
    >
      <Select id={id} value={value} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger className="h-8">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
