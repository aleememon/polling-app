import { BrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    </div>
  );
};

export default App;
