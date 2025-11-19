import { Panel } from "@/components/common/Panel";
import styles from "./about.module.scss";

const timeline = [
  {
    era: "2020",
    entry: "Platform concept developed to create a modern marketplace solution.",
  },
  {
    era: "2022",
    entry: "First version launched with core features and user authentication.",
  },
  {
    era: "2024",
    entry: "Major redesign implementing clean, minimal interface with enhanced calculator.",
  },
  {
    era: "Today",
    entry: "Continuously improving with user feedback and modern design principles.",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <h1>About Our Platform</h1>
      <p>
        We built this platform to provide a streamlined marketplace experience with powerful tools for users.
        Our focus is on clean design, intuitive interfaces, and providing value through smart features like 
        our advanced calculator and analytics dashboard.
      </p>
      <div className={styles.timeline}>
        {timeline.map((item) => (
          <Panel key={item.era} accent="magenta">
            <p className={styles.era}>{item.era}</p>
            <p>{item.entry}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
