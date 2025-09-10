import * as React from "react";

// Remove this interface if it's empty
// interface InputProps {}

export function Input(props: React.ComponentProps<"input">) {
  return <input {...props} />;
}