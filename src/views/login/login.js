import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { signIn, useSession } from "next-auth/client";
import GoogleIcon from "../../public/google-icon.svg";
import styles from "./Login.module.css";

export default function Login() {
  const [session] = useSession();
  console.log(session);
  const onSignIn = () => {
    signIn("google", {
      callbackUrl: process.env.CALLBACK_URL,
    });
  };

  return (
    <div className={styles.layout}>
      <Card className={styles.container}>
        <CardHeader
          className={styles.header}
          title="Proximity Leave Application"
        />
        <CardContent>
          <div className={styles.imageContainer}>
            <Button onClick={onSignIn}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
