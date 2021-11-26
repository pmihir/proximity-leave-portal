import { getSession } from "next-auth/client";
import ApplyLeave from "../views/apply-leave/applyLeave";

export default function Leave({ session }) {
  return <ApplyLeave session={session} />;
}

export const getServerSideProps = async (ctx) => {
  const res = await getSession(ctx);
  console.log(res);
  if (!res) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session: res,
    },
  };
};
