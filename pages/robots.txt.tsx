const robotsTemplate = `User-agent: *
Disallow: /admin
`;

const Robots = () => null;

export const getServerSideProps: GetServerSideProps = async function getServerSideProps(
  context
) {
  const { res } = context;
  res.setHeader("Content-Type", "text/plain");
  res.write(robotsTemplate);
  res.end();

  return { props: {} };
};

export default Robots;
import type { GetServerSideProps } from "next";
