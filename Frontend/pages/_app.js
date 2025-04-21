import "../styles/globals.css";
import { HelmetProvider } from "react-helmet-async";

const MyApp = ({ Component }) => {
  return (
    <HelmetProvider>
      <div className="h-screen">
        <Component />
      </div>
    </HelmetProvider>
  );
};

export default MyApp;
