import { motion, HTMLMotionProps } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type Props = {
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<"button">;

export default function Button({ children, className, ...props }: Props) {
  return (
    <motion.button
      className={`start-btn ${className ?? ""}`}
      whileTap={{ scale: 0.975 }}
      whileHover={{ scale: 1.025 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
