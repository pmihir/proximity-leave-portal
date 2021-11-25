import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import GoogleIcon from "../../public/google-icon.svg";
import TimelyIcon from "../../public/timely-icon.svg";
import styles from "./Login.module.css";
import Checkmark from "../../components/checkmark/checkmark";

export default function Login() {
  const [error, setError] = useState("");
  //   const [googleLoader, setGoogleLoader] = useState(false);
  const [isGoogleCheckmarkActive, setIsGoogleCheckmarkActive] = useState(false);
  const [isTimelyCheckmarkActive, setIsTimelyCheckmarkActive] = useState(false);
  const [session] = useSession();
  const router = useRouter();
  console.log(session);

  useEffect(() => {
    if (session) {
      //To check if provided email is from proximity
      if (
        session.user.email
          .match(/(?<=\@)\w+/gi)
          .join("")
          .toLowerCase() !== "proximity"
      ) {
        setError("Please provide valid email");
      } else {
        setIsGoogleCheckmarkActive(true);
        setError("");
      }
    }
  }, [session]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    console.log(params);
    if (params.code) {
      setIsTimelyCheckmarkActive(true);
      window.localStorage.setItem("timelyCode", JSON.stringify(params.code));
    }
  }, []);

  const onGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: process.env.callbackUri,
    });
  };

  const getTimelyAuthCode = () => {
    const redirectUri = process.env.timely.redirectUri;
    const applicationId = process.env.timely.applicationId;
    const authCodeUrl = `https://api.timelyapp.com/1.1/oauth/authorize?response_type=code&redirect_uri=${redirectUri}&client_id=${applicationId}`;
    //redirecting to timely to get auth code
    location.href = authCodeUrl;
  };

  const onSignIn = () => {
    router.push("/apply-leave");
  };

  const continueDisabled = () => {
    return !(
      isGoogleCheckmarkActive &&
      isTimelyCheckmarkActive &&
      !error.length
    );
  };

  return (
    <React.Fragment>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className={styles.layout}>
        <Card className={styles.container}>
          <CardHeader
            className={styles.header}
            title="Proximity Leave Application"
          />
          <Typography className={styles.error}>{error}</Typography>
          <CardContent className={styles.content}>
            <div className={styles.imageContainer}>
              <Button
                variant="contained"
                onClick={onGoogleSignIn}
                className={styles.button}
              >
                <Image
                  src={GoogleIcon}
                  alt="google-signin"
                  width="25"
                  height="25"
                />
                <Typography className={styles.buttonName}>
                  Sign in with Google
                </Typography>
              </Button>
              {isGoogleCheckmarkActive && !error.length && <Checkmark />}
            </div>
            <div className={styles.imageContainer}>
              <Button
                variant="contained"
                onClick={getTimelyAuthCode}
                className={styles.button}
              >
                <Image
                  src={TimelyIcon}
                  alt="timely-signin"
                  width="25"
                  height="25"
                />
                <Typography className={styles.buttonName}>
                  Sign in with Timely
                </Typography>
              </Button>
              {isTimelyCheckmarkActive && <Checkmark />}
            </div>
            <div className={styles.imageContainer}>
              <Button
                onClick={onSignIn}
                className={styles.button}
                disabled={continueDisabled()}
              >
                <Typography className={styles.buttonName}>Continue</Typography>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
}
