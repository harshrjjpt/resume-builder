"use client";

import { GripVertical } from "lucide-react";
import { forwardRef } from "react";

export const DragHandle = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button ref={ref} {...props} className={`cursor-grab inline-flex ${props.className || ""}`}>
      <GripVertical size={13} />
    </button>
  )
);

DragHandle.displayName = "DragHandle";
