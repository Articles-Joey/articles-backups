import Image from "next/image";
import styles from "./page.module.css";

import "@/styles/pages/landing.scss"
import SimpleLineChart from "@/components/SimpleLineChart";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>

      <main className={styles.main}>

        <SimpleLineChart/>

        <ul>
          <li>
            Quickly view status of your backups
          </li>
          <li>
            Manage backups and templates
          </li>
          <li>
            Encryption, compression, and cloud uploading of backup data
          </li>
        </ul>

        <div className={styles.ctas}>
          <Link
            href="/docs"
            // target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read the docs
          </Link>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          View Source Code →
        </a>
        <a
          href="https://articles.media?utm_source=articles-backups-client&utm_campaign=articles-backups-client"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to articles.media →
        </a>
      </footer>

    </div>
  );
}
