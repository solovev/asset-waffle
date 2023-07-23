import { MainPage, LoginPage } from "@/pages";
import { useAccessContext } from "./providers";

function App() {
  const { hasAccess } = useAccessContext();
  return hasAccess ? <MainPage /> : <LoginPage />;
}

export default App;
