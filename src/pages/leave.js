import { getSession } from "next-auth/client";
import ApplyLeave from "../views/apply-leave/applyLeave";

export default function Leave({ session, slackWebhookUrl }) {
  return <ApplyLeave session={session} slackWebhookUrl={slackWebhookUrl} />;
}

export const getServerSideProps = async (ctx) => {
  const res = await getSession(ctx);
  const slackWebhookUrl = process.env.slackWebhookUrl;
  console.log(slackWebhookUrl);
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
      slackWebhookUrl,
    },
  };
};
