import Link from "next/link";

import { LazyHeroShader } from "@/components/effects/LazyHeroShader";
import { site } from "@/data/site";
import { TextAnimate } from "@/components/ui/text-animate";

import styles from "@/styles/home-hero.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-heading">
      <LazyHeroShader className={styles.shader} />
      <div className={styles.copy}>
        <h1 id="home-hero-heading" className={styles.heading}>
          <TextAnimate animation="blurInUp" by="character" once>
            Building brand systems, marketing, and websites for the world.
          </TextAnimate>
        </h1>
        <p className={styles.body}>{site.mediumBio}</p>
        <div className={styles.actions} aria-label="Primary actions">
          <Link href="/work" className={styles.primaryCta}>
            View selected work
          </Link>
          <Link href="/contact" className={styles.secondaryCta}>
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
