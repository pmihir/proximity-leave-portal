import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const DEPARTMENTS = ["Engineering", "Design", "Admin"];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Leave Portal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Proximity Leave Portal</h1>
        <div className={styles.wrapper}>
        <form>
            <div className={styles.formInput}>
              <label for="name">Name</label>
              <input type="text" name="name" />
            </div>
            <div className={styles.formInput}>
              <label for="department">Department</label>
              <select name="department">
                {DEPARTMENTS.map((department) => (
                  <option value={department}>{department}</option>
                ))}
              </select>
            </div>
            <div className={styles.formInput}>
              <label for="fromDate">From Date</label>
              <input type="date" name="fromDate" />
            </div>
            <div className={styles.formInput}>
              <label for="toDate">From Date</label>
              <input type="date" name="toDate" />
            </div>
            <div className={styles.formInput}>
              <label for="reason">Reason</label>
              <textarea name="reason" />
            </div>
            <div>
              <button>Submit</button>
            </div>
        </form>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
