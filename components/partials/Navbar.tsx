import Image from "next/image";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";

import useCardanoWallet from "../../hooks/useCardanoWallet";
import styles from "../../styles/navbar.module.scss";
import ConnectWallet from "./navbar/ConnectWallet";
import LoggedInWallet from "./navbar/LoggedInWallet";
import useWindowSize from "../../hooks/useResponsive";

import Setting from "./navbar/Setting";
import { AppContext } from "../../pages/_app";
import { GlobalContext } from "../GlobalContext";
import { numberFormat, numberToFixed } from "../../utils/format";
import Leftbar from "./Leftbar";
import useAssetsApi from "../../hooks/useAssetsApi";

const Navbar = () => {
  const [isWalletShowing, setIsWalletShowing] = useState(false);
  const appContext = useContext(AppContext);
  const { state } = appContext ?? { state: null };

  const { width } = useWindowSize();
  const isSmall = width < 850;
  const isMobile = width < 720;
  const isTablet = width <= 1100;

  const { walletMeta, disconnectWallet } = useCardanoWallet();

  const [openSetting, setOpenSetting] = useState(false);
  const [openLeftbar, setOpenLeftbar] = useState(false);
  const [display, setDisplay] = useState(false);

  const { data, loading } = useAssetsApi();

  const handleClickSetting = () => {
    if (display) {
      setOpenSetting(false);
      setTimeout(() => {
        setDisplay(false);
      }, 500);
    } else {
      setDisplay(true);
      setTimeout(() => {
        setOpenSetting(true);
      }, 50);
    }
  };

  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const handleInfoClick = () => {
    isOpenInfo ? setIsOpenInfo(false) : setIsOpenInfo(true);
  };

  const handleDashClick = () => {
    setOpenLeftbar(!openLeftbar);
  };

  useEffect(() => {
    if (isOpenInfo || openLeftbar) {
      const handleClickOutside = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        if (
          (isOpenInfo &&
            !target.closest(`.${styles.info}`) &&
            !target.closest(`.${styles.minted}`)) ||
          (openLeftbar &&
            !target.closest(`#leftbar`) &&
            !target.closest(`.${styles.btnDashboard}`))
        ) {
          setIsOpenInfo(false);
          setOpenLeftbar(false);
        }
      };
      document.addEventListener("pointerdown", handleClickOutside);
      return () =>
        document.removeEventListener("pointerdown", handleClickOutside);
    }
  }, [isOpenInfo, openLeftbar]);

  const { config } = useContext(GlobalContext);
  let linkcBtc = "";

  if (config.network === "Mainnet") {
    linkcBtc = `https://cardanoscan.io/token/${config.cbtcAssetId}`;
  } else {
    linkcBtc = `https://preprod.cardanoscan.io/token/${config.cbtcAssetId}`;
  }

  return (
    <header className={styles.main}>
      <div className={styles.navGroup}>
        <Link href="/" className={styles.logo}>
          {!isSmall ? (
            state?.darkMode ? (
              <Image
                src="/images/logo/logo_dark.png"
                alt="logo aneta"
                width={146}
                height={30}
                priority
              ></Image>
            ) : (
              <Image
                src="/images/logo/logo.png"
                alt="logo aneta"
                width={146}
                height={30}
                priority
              ></Image>
            )
          ) : (
            <Image
              src="/images/logo/angel.png"
              alt="logo aneta"
              width={30}
              height={30}
              priority
            ></Image>
          )}
        </Link>
        {
          <>
            {isMobile ? (
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.btn} ${styles.info}`}
                  onClick={handleInfoClick}
                >
                  Info
                  <div
                    className={`${styles.iconArrow} ${
                      isOpenInfo ? styles.active : ""
                    }`}
                  >
                    <svg width="10" height="10" id="icon">
                      <use href="/images/icons/chevron-down.svg#icon"></use>
                    </svg>
                  </div>
                </button>
                {isOpenInfo && (
                  <button className={`${styles.btn} ${styles.minted}`}>
                    <Link
                      href={linkcBtc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {"cBTC Minted: "}
                      {loading ? (
                        <div className={styles.value}>
                          <div className={styles.loader}></div>
                        </div>
                      ) : (
                        <p className={styles.value}>
                          {" "}
                          {data ? numberToFixed(data.quantity) : 0}
                        </p>
                      )}
                    </Link>
                  </button>
                )}
              </div>
            ) : (
              <>
                <button className={styles.btn}>
                  <Link
                    href={linkcBtc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {"cBTC Minted: "}
                    {loading ? (
                      <div className={styles.value}>
                        <div className={styles.loader}></div>
                      </div>
                    ) : (
                      <p className={styles.value}>
                        {" "}
                        {data ? numberToFixed(data.quantity) : 0}
                      </p>
                    )}
                  </Link>
                </button>
                {/*           <button className={styles.btn}>
            BTC in Vault: <p className={styles.value}>---</p>
          </button> */}
              </>
            )}
            {isTablet && (
              <div className={styles.leftbarContainer}>
                <button
                  onClick={handleDashClick}
                  className={styles.btnDashboard}
                >
                  <svg
                    width="20"
                    height="20"
                    id="icon"
                    className={styles.dashboard}
                  >
                    <use href="/images/icons/grid.svg#icon"></use>
                  </svg>
                </button>
                {openLeftbar && <Leftbar />}
              </div>
            )}
          </>
        }
      </div>

      <section className={styles.nav}>
        {/* <SelectNetwork /> */}

        {walletMeta ? (
          <LoggedInWallet
            disconnectWallet={disconnectWallet}
            walletMeta={walletMeta}
          />
        ) : (
          <button
            onClick={() =>
              isWalletShowing
                ? setIsWalletShowing(false)
                : setIsWalletShowing(true)
            }
            className={styles.connectWallet}
          >
            <p>Connect Wallet</p>
          </button>
        )}
        <ConnectWallet
          isOpen={isWalletShowing}
          setIsOpen={setIsWalletShowing}
        />

        <div className={`${styles.setting}`} id="setting">
          <svg
            width="20"
            height="20"
            id="icon"
            className={styles.gear}
            onClick={handleClickSetting}
          >
            <use href="/images/icons/gear.svg#icon"></use>
          </svg>
          {openSetting && (
            <Setting
              openSetting={openSetting}
              setOpenSetting={setOpenSetting}
              display={display}
              setDisplay={setDisplay}
            />
          )}
        </div>
      </section>
    </header>
  );
};

export default Navbar;
