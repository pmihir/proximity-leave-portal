import React from "react";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";

import Login from "../views/login/login";

export default function LoginPage({
  session,
  timelyApplicationId,
  timelyClientSecret,
}) {
  const router = useRouter();
  React.useEffect(() => {
    const token = window.localStorage.getItem("timelyToken");
    if (token && session) {
      router.push("/leave");
    }
  }, [session, router]);

  return (
    <Login
      session={session}
      timelyClientSecret={timelyClientSecret}
      timelyApplicationId={timelyApplicationId}
    />
  );
}

export const getServerSideProps = async (ctx) => {
  const res = await getSession(ctx);
  // if (res) {
  //   return {
  //     redirect: {
  //       destination: "/leave",
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: {
      session: res,
      timelyApplicationId: process.env.timelyApplicationId,
      timelyClientSecret: process.env.timelyClientSecret,
    },
  };
};
