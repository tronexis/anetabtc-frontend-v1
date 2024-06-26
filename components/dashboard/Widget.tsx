import { ReactNode, useEffect, useState } from "react";
import styles from "../../styles/widget.module.scss";
import Link from "next/link";
import { Cip30Wallet } from "@cardano-sdk/dapp-connector";
import useWindowSize from "../../hooks/useResponsive";
import { classNames } from "../../utils/Classnames";
import Tooltip from "../Tooltip";
import { numberFormat } from "../../utils/format";
import Image from "next/image";

interface WidgetProps {
  dailyChangePrice?: string;
  price?: string;
  miniPrice?: string;
  token?: string;
  icon?: string;
  title?: string;
  buttonTitle?: string;
  buttonClick?: () => void;
  buttonDisabled?: boolean;
  buttonLink?: string;
  buttonExternal?: boolean;
  button2Title?: string;
  button2Click?: () => void;
  button2Disabled?: boolean;
  button2Link?: string;
  button2External?: boolean;
  headerButtonTitle?: string;
  headerButtonClick?: (() => void) | string;
  noPrice?: boolean;
  noHeaderPrice?: boolean;
  titleLg?: boolean;
  titleLeft?: boolean;
  titleCenter?: boolean;
  timerStart?: string | number | Date;
  currentDate?: string | number | Date;
  timerInterval?: number;
  text?: string;
  textLg?: boolean;
  textXl?: boolean;
  text2?: string;
  title2?: string;
  noMargin?: boolean;
  walletMeta?: Cip30Wallet | null;
  walletBalance?: string | null;
  onWalletBtnClick?: () => void;
  colSpan?: boolean;
  colSpanMd?: boolean;
  colSpanSm?: boolean;
  colSpanValue?: number;
  colSpanMdValue?: number;
  colSpanSmValue?: number;
  order?: number;
  paddingTop?: string;
  tooltip?: ReactNode;
  titleTooltip?: ReactNode;
  titleTooltipPosition?: "top" | "bottom" | "left" | "right";
  title2Tooltip?: ReactNode;
  title2TooltipPosition?: "top" | "bottom" | "left" | "right";
  miniText?: string;
  miniText2?: string;
  miniTextLg?: boolean;
  miniTextXl?: boolean;
  textRow?: boolean;
  assets?: any;
  tokenTitle?: string;
  tokenTitleTooltip?: ReactNode;
  tokenTitleTooltipPosition?: "top" | "bottom" | "left" | "right";
  buttonGroup?: boolean;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
}

const Widget = (props: WidgetProps) => {
  const { width } = useWindowSize();
  const isMobile = width <= 550;
  const isTablet =
    (width >= 551 && width <= 1000) || (width >= 1101 && width <= 1250);
  const calculateTimeLeft = () => {
    const intervalDays = (props.timerInterval ?? 5) * 24 * 60 * 60 * 1000;
    const currentTime = props.currentDate
      ? new Date(props.currentDate)
      : new Date();
    const difference = props.timerStart
      ? +new Date(
          intervalDays -
            (Math.abs(+currentTime - +new Date(props.timerStart)) %
              intervalDays)
        )
      : -1;

    if (difference <= 0) {
      // Timer has expired
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeLeft());

  // Update timer every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timerStart]); // Re-run useEffect when targetDate changes

  const { days, hours, minutes, seconds } = timeRemaining;
  return (
    <div
      className={styles.widget}
      style={{
        order: isMobile && props.order ? props.order : undefined,
        paddingTop: props.paddingTop ?? undefined,
        flexDirection: props.direction ? props.direction : "column",
        gridColumn: props.colSpanValue
          ? `span ${props.colSpanValue}`
          : undefined,
      }}
    >
      <div className={styles.content}>
        {props.title && (
          <div
            className={classNames(
              props.titleLg ? styles.titleLg : styles.title,
              props.titleLeft ? styles.titleLeft : "",
              props.titleCenter ? styles.titleCenter : ""
            )}
          >
            <div className={styles.titleWrapper}>
              <span>{props.title}</span>
              {props.titleTooltip && (
                <Tooltip
                  content={props.titleTooltip}
                  position={props.titleTooltipPosition ?? "top"}
                >
                  i
                </Tooltip>
              )}
            </div>
            {props.headerButtonTitle && (
              <div className={styles.btnGroup}>
                {typeof props.headerButtonClick === "string" ? (
                  <Link
                    className={styles.btnBtc}
                    href={props.headerButtonClick}
                    target="_blank"
                  >
                    <span className={styles.btnText}>
                      {props.headerButtonTitle}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      id="icon"
                      className={styles.icon}
                    >
                      <use href="/images/icons/arrow-right.svg#icon"></use>
                    </svg>
                  </Link>
                ) : (
                  <button
                    className={styles.btnBtc}
                    onClick={props.headerButtonClick}
                  >
                    <span className={styles.btnText}>
                      {props.headerButtonTitle}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      id="icon"
                      className={styles.icon}
                    >
                      <use href="/images/icons/arrow-right.svg#icon"></use>
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {!props.noHeaderPrice && props.token && (
          <div className={styles.headerPrice}>
            <div className={styles.token}>
              {props.icon &&
                (props.icon.includes(".svg") ? (
                  <svg width="22" height="22" id="icon">
                    <use href={props.icon}></use>
                  </svg>
                ) : (
                  <Image
                    alt={props.token}
                    src={props.icon}
                    width={22}
                    height={22}
                    style={{
                      borderRadius: "100%",
                    }}
                  />
                ))}
              {
                <div className={styles.tokenTitle}>
                  <span>{props.tokenTitle ?? props.token + " Price"}</span>
                  {props.tokenTitleTooltip && (
                    <Tooltip
                      content={props.tokenTitleTooltip}
                      position={props.tokenTitleTooltipPosition ?? "top"}
                    >
                      i
                    </Tooltip>
                  )}
                </div>
              }
            </div>
            {props.dailyChangePrice && (
              <p
                className={`${styles.changeDaily} ${
                  props.dailyChangePrice?.startsWith("-") ? styles.negative : ""
                }`}
              >
                {props.dailyChangePrice?.startsWith("-") ? undefined : "+"}
                {numberFormat(props.dailyChangePrice, 2)}%
              </p>
            )}
          </div>
        )}
        {props.price ? (
          <div className={styles.priceGroup}>
            <div className={styles.adaPrice}>{props.price}</div>
            <p className={styles.usdPrice}>{props.miniPrice}</p>
          </div>
        ) : !props.noPrice ? (
          <div className={styles.loaderPrice}>
            <div className={styles.loader}></div>
          </div>
        ) : undefined}
        {props.timerStart && (
          <div className={styles.timer}>
            <div className={styles.time}>
              <p className={styles.timeValue}>{days}</p>
              <p className={styles.timeUnit}>Days</p>
            </div>
            <div className={styles.time}>
              <p className={styles.timeValue}>{hours}</p>
              <p className={styles.timeUnit}>Hours</p>
            </div>
            <div className={styles.time}>
              <p className={styles.timeValue}>{minutes}</p>
              <p className={styles.timeUnit}>Minutes</p>
            </div>
          </div>
        )}

        {props.text ? (
          props.text !== "loading" ? (
            <div
              className={styles.textContainer}
              style={{
                display: "flex",
                flexDirection: props.textRow ? "row" : "column",
                alignItems: props.textRow ? "center" : undefined,
                gap: props.textRow ? "0.5rem" : undefined,
              }}
            >
              <p
                className={
                  props.textXl
                    ? styles.valueTextXl
                    : props.textLg
                    ? styles.valueTextLg
                    : styles.valueText
                }
              >
                {props.text}
              </p>
              <p
                className={
                  props.miniTextXl
                    ? styles.miniTextXl
                    : props.miniTextLg
                    ? styles.miniTextLg
                    : styles.miniText
                }
                style={{
                  marginTop: props.textRow ? "0.25rem" : undefined,
                }}
              >
                {props.miniText}
              </p>
            </div>
          ) : (
            <div className={styles.loaderPrice}>
              <div className={styles.loader}></div>
            </div>
          )
        ) : undefined}
        {props.title2 && (
          <div
            className={classNames(
              props.titleLg ? styles.titleLg : styles.title
            )}
          >
            <div className={styles.titleWrapper}>
              <span>{props.title2}</span>
              {props.title2Tooltip && (
                <Tooltip
                  content={props.title2Tooltip}
                  position={props.title2TooltipPosition ?? "top"}
                >
                  i
                </Tooltip>
              )}
            </div>
          </div>
        )}
        {props.text2 ? (
          props.text2 !== "loading" ? (
            <div className={styles.textContainer}>
              <p
                className={
                  props.textXl
                    ? styles.valueTextXl
                    : props.textLg
                    ? styles.valueTextLg
                    : styles.valueText
                }
              >
                {props.text2}
              </p>
              <p className={styles.miniText}>{props.miniText2}</p>
            </div>
          ) : (
            <div className={styles.loaderPrice}>
              <div className={styles.loader}></div>
            </div>
          )
        ) : undefined}

        {props.assets ? (
          <div
            className={styles.assetContainer}
            style={{
              visibility: props.text === "loading" ? "hidden" : "visible",
            }}
          >
            <div className={styles.assetTable}>
              <div className={styles.assetTableHeader}>
                <p>Token</p>
                <p>ADA Value</p>
                <p>USD Value</p>
              </div>
              {props.assets.table.map((asset: any) => (
                <div key={asset.token} className={styles.assetTableRow}>
                  <p>
                    {numberFormat(asset.amount, 4, 0, true)} {asset.token}
                  </p>
                  <p>{numberFormat(asset.adaValue, 0, 0)} ADA</p>
                  <p>${numberFormat(asset.usdValue, 2, 2)}</p>
                </div>
              ))}
            </div>
            {props.assets.wallets && (
              <div className={styles.btnGroup}>
                {props.assets.wallets.map((wallet: string, i: number) => (
                  <Link
                    key={i}
                    className={styles.btnBtc}
                    href={wallet}
                    target="_blank"
                  >
                    <span className={styles.btnText}>Wallet {i + 1}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : undefined}
        {<div />}
      </div>
      {(props.buttonTitle || props.button2Title) && (
        <div
          className={styles.btnGroupContainer}
          style={{
            width:
              props.direction === "row" &&
              props.buttonTitle &&
              props.button2Title
                ? "35%"
                : undefined,
          }}
        >
          {props.buttonTitle ? (
            props.buttonLink ? (
              <Link
                href={props.buttonLink}
                className={
                  styles.btn +
                  " " +
                  (props.buttonDisabled ? styles.disabled : "") +
                  " " +
                  (props.buttonGroup ? styles.group : styles.solo)
                }
                target={props.buttonExternal ? "_blank" : undefined}
              >
                {props.buttonTitle}
              </Link>
            ) : (
              <button
                disabled={props.buttonDisabled}
                onClick={props.buttonClick}
                className={
                  styles.btn +
                  " " +
                  (props.buttonGroup ? styles.group : styles.solo)
                }
              >
                {props.buttonTitle}
              </button>
            )
          ) : undefined}
          {props.button2Title ? (
            props.button2Link ? (
              <Link
                href={props.button2Link}
                className={
                  styles.btn +
                  " " +
                  (props.button2Disabled ? styles.disabled : "") +
                  " " +
                  (props.buttonGroup ? styles.group : styles.solo)
                }
                target={props.button2External ? "_blank" : undefined}
              >
                {props.button2Title}
              </Link>
            ) : (
              <button
                disabled={props.button2Disabled}
                onClick={props.button2Click}
                className={
                  styles.btn +
                  " " +
                  (props.buttonGroup ? styles.group : styles.solo)
                }
              >
                {props.button2Title}
              </button>
            )
          ) : undefined}
          {props.walletMeta ? (
            <div className={styles.balanceValue}>
              <svg width="25" height="25" id="icon">
                <use href={props.icon}></use>
              </svg>
              <p className={styles.text}>{props.token}</p>
              {props.walletBalance ? (
                <p className={styles.value}>{props.walletBalance}</p>
              ) : (
                <div className={styles.loaderPrice}>
                  <div className={styles.loader}></div>
                </div>
              )}
            </div>
          ) : undefined}
        </div>
      )}
      {!props.noMargin && <div className={styles.bottomMargin} />}
      {props.tooltip && (
        <div className={styles.tooltipWrapper}>
          <Tooltip content={props.tooltip} position={"top"}>
            i
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default Widget;
