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
import { signIn, getSession, options } from "next-auth/client";
import { useRouter } from "next/router";
import axios from "axios";

import GoogleIcon from "../../public/google-icon.svg";
import TimelyIcon from "../../public/timely-icon.svg";
import styles from "./Login.module.css";
import Checkmark from "../../components/checkmark/checkmark";
import Cookies from 'universal-cookie';

export default function Login({ timelyApplicationId, timelyClientSecret }) {
  const [error, setError] = useState("");
  //   const [googleLoader, setGoogleLoader] = useState(false);
  const [isGoogleCheckmarkActive, setIsGoogleCheckmarkActive] = useState(false);
  const [isTimelyCheckmarkActive, setIsTimelyCheckmarkActive] = useState(false);
  const [isBtnEnabled, setIsBtnEnabled] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();

  useEffect(() => {
    getSession().then((session) => {
      //To check if provided email is from proximity
      if (session) {
        if (
          session.user.email
            .match(/(?<=\@)\w+/gi)
            .join("")
            .toLowerCase() !== "proximity"
        ) {
          setError("Please login via Proximity email id");
        } else {
          setIsGoogleCheckmarkActive(true);
          setError("");
        }
      }
    });
  }, []);

  // useEffect(() => {
  //   if (isGoogleCheckmarkActive && window.localStorage.getItem("timelyToken")) {
  //     router.push("/leave");
  //   }
  // }, [isGoogleCheckmarkActive]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    console.log(params);
    if (params.code) {
      setIsTimelyCheckmarkActive(true);
      getAccessToken(params.code);
    }
  }, []);

  const onGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: 'https://proximity-leave-portal-nlt8fqbws-pmihir.vercel.app/',
      redirect: true,
    });
  };

  const getTimelyAuthCode = () => {
    const redirectUri = window.location.origin;
    const applicationId = timelyApplicationId;
    const authCodeUrl = `https://api.timelyapp.com/1.1/oauth/authorize?response_type=code&redirect_uri=${redirectUri}&client_id=${applicationId}`;
    //redirecting to timely to get auth code
    location.href = authCodeUrl;
  };

  const getAccessToken = async (authCode) => {
    const redirectUri = window.location.origin;
    const authUrl = "https://api.timelyapp.com/1.1/oauth/token";
    const bodyFormData = new FormData();
    bodyFormData.append("client_id", timelyApplicationId);
    bodyFormData.append("client_secret", timelyClientSecret);
    bodyFormData.append("redirect_uri", redirectUri);
    bodyFormData.append("code", authCode);
    bodyFormData.append("grant_type", "authorization_code");

    const response = await axios({
      method: "post",
      url: authUrl,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response?.data?.access_token) {
      // window.localStorage.setItem(
      //   "timelyToken",
      //   JSON.stringify(response.data.access_token)
      // );
      console.log(response.data.access_token);
      cookies.set('timeToken', JSON.stringify(response.data.access_token, null, null));
    }
  };

  const onSignIn = () => {
    router.push("/leave");
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
                variant="contained"
                disabled={continueDisabled()}
                style={{
                  backgroundColor: continueDisabled() ? "" : "#192030e0",
                }}
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
