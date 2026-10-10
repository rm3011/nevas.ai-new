import { Medusae } from "antigravity-particle";
import "antigravity-particle/medusae.css";

export default function ParticleCanvas() {
  // Configuration to match your NEVAS.AI theme
  const customConfig = {
    particles: {
      // 65 particles as you requested
      count: 65, 
      // Map to your cyber theme: Cyan, Purple, Pink
      colorBase: "#a855f7", // Purple (dormant)
      colorOne: "#00f0ff",  // Cyan (primary active)
      colorTwo: "#ec4899",  // Pink (secondary active)
      // Slightly larger particles for better visibility
      baseSize: 0.018,
      activeSize: 0.05,
    },
    cursor: {
      // How strongly the swarm follows the cursor
      strength: 4.0,
      // How quickly it responds
      dragFactor: 0.02,
    },
    // Set the background to transparent so your page's 
    // gradient/glow shows through
    background: {
      color: "transparent",
    },
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
      <Medusae config={customConfig} />
    </div>
  );
}