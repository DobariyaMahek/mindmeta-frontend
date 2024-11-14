// STYLED COMPONENT
import { useContext } from "react";
import { SettingsContext } from "@/contexts/settingsContext";
import { RootStyle } from "./styles";
export default function LoaderWithLogo() {
  const { settings } = useContext(SettingsContext);

  return (
    <RootStyle className="loading-wrapper">
      <div className="logo">
        {settings.theme == "dark" ? (
          <img src="/static/logo/logo-svg.svg" alt="essence" />
        ) : (
          <img src="/static/logo/logo-svg-dark.svg" alt="essence" />
        )}
      </div>

      <div className="loading-content"></div>
    </RootStyle>
  );
}
