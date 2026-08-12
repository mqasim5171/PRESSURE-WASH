import { motion } from "framer-motion";

/**
 * Reveal
 * -------
 * Wraps a section so it fades/slides in once as it enters the viewport.
 * Drop-in — doesn't touch the wrapped component's internals, so it's a
 * safe way to give every homepage section the same entrance animation.
 *
 *   <Reveal><Services /></Reveal>
 */
export default function Reveal({ children, delay = 0, y = 28 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
