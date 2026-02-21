import React, { useEffect, useState } from "react";

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const beforeInstallHandler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    const appInstalledHandler = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);
    window.addEventListener("appinstalled", appInstalledHandler);

    // Hide button if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", appInstalledHandler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("App installed");
    }

    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <button
      onClick={installApp}
      className="w-full py-2 mt-4 rounded-lg font-semibold transition 
                 bg-yellow-400 hover:bg-yellow-500 
                 text-black 
                 dark:bg-yellow-500 dark:hover:bg-yellow-400"
    >
      📲 Install Resume_IQ App
    </button>
  );
}

export default InstallButton;
