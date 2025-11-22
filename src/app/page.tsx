'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { dictionaries, type Dictionary } from "../dictionaries";

type ThemeOption = "auto" | "light" | "dark";
type Language = "en" | "zh";
type Unit = "px" | "rem" | "pt";
type RowState = "enter" | "idle" | "exit";

type ConversionRow = {
  id: number;
  px: string;
  rem: string;
  pt: string;
  state: RowState;
};

const DEFAULTS = {
  remInPx: 16,
  pxInPt: 0.75
};

const NUMERIC_PATTERN = /^\d*\.?\d*$/;

const formatValue = (value: number) => {
  if (!Number.isFinite(value)) {
    return "";
  }
  const fixed = value.toFixed(4);
  return fixed.replace(/\.?0+$/, "") || "0";
};

const convertFromPx = (pxValue: number, pxPerRem: number, ptPerPx: number) => {
  const remValue = pxValue / pxPerRem;
  const ptValue = pxValue * ptPerPx;
  return {
    px: formatValue(pxValue),
    rem: formatValue(remValue),
    pt: formatValue(ptValue)
  };
};

const convertFromRem = (remValue: number, pxPerRem: number, ptPerPx: number) =>
  convertFromPx(remValue * pxPerRem, pxPerRem, ptPerPx);

const convertFromPt = (ptValue: number, pxPerRem: number, ptPerPx: number) =>
  convertFromPx(ptValue / ptPerPx, pxPerRem, ptPerPx);

const createRow = (
  id: number,
  pxValue: number,
  pxPerRem: number,
  ptPerPx: number,
  state: RowState = "idle"
): ConversionRow => ({
  id,
  state,
  ...convertFromPx(pxValue, pxPerRem, ptPerPx)
});

const recalcRow = (
  row: ConversionRow,
  pxPerRem: number,
  ptPerPx: number
): ConversionRow => {
  if (row.px.trim()) {
    const numeric = Number(row.px);
    return Number.isFinite(numeric)
      ? { ...row, ...convertFromPx(numeric, pxPerRem, ptPerPx) }
      : row;
  }
  if (row.rem.trim()) {
    const numeric = Number(row.rem);
    return Number.isFinite(numeric)
      ? { ...row, ...convertFromRem(numeric, pxPerRem, ptPerPx) }
      : row;
  }
  if (row.pt.trim()) {
    const numeric = Number(row.pt);
    return Number.isFinite(numeric)
      ? { ...row, ...convertFromPt(numeric, pxPerRem, ptPerPx) }
      : row;
  }
  return row;
};

const THEME_ICONS: Record<ThemeOption, string> = {
  auto: "bi-circle-half",
  light: "bi-sun",
  dark: "bi-moon-stars"
};

const UnitField = ({
  unit,
  label,
  value,
  onChange,
  dict
}: {
  unit: Unit;
  label: string;
  value: string;
  onChange: (value: string) => void;
  dict: Dictionary;
}) => {
  const abbreviation = unit.toUpperCase();
  return (
    <div className="col-12 col-lg-4">
      <div className="unit-field h-100">
        <div className="d-flex align-items-center gap-2 small text-muted mb-2">
          <span className={`unit-chip ${unit}`}>{abbreviation}</span>
          <span className="fw-semibold">{label}</span>
        </div>
        <label className="form-label text-secondary">{dict.enter} {label.toLowerCase()}</label>
        <div className="input-group">
          <input
            className="form-control form-control-lg"
            inputMode="decimal"
            aria-label={label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0"
          />
          <span className="input-group-text text-uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = ({
  theme,
  onChange,
  dict
}: {
  theme: ThemeOption;
  onChange: (theme: ThemeOption) => void;
  dict: Dictionary;
}) => {
  const themeLabels: Record<ThemeOption, string> = {
    auto: dict.themeAuto,
    light: dict.themeLight,
    dark: dict.themeDark
  };

  return (
    <div className="theme-toggle d-flex align-items-center gap-3 flex-wrap">
      <span className="text-secondary fw-semibold small text-uppercase letter-spacing-1">
        {dict.theme}
      </span>
      <div
        className="d-flex gap-2"
        role="group"
        aria-label="Switch theme between auto, light, and dark"
      >
        {(Object.keys(themeLabels) as ThemeOption[]).map((option) => (
          <button
            key={option}
            type="button"
            className={`btn btn-sm d-inline-flex align-items-center gap-2 ${option === theme ? "btn-primary" : "btn-outline-secondary"
              }`}
            onClick={() => onChange(option)}
          >
            <i className={`bi ${THEME_ICONS[option]}`} aria-hidden />
            <span>{themeLabels[option]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const LanguageToggle = ({
  language,
  onChange,
  dict
}: {
  language: Language;
  onChange: (lang: Language) => void;
  dict: Dictionary;
}) => {
  return (
    <div className="language-toggle d-flex align-items-center gap-3 flex-wrap">
      <span className="text-secondary fw-semibold small text-uppercase letter-spacing-1">
        {dict.language}
      </span>
      <div className="d-flex gap-2" role="group">
        <button
          type="button"
          className={`btn btn-sm d-inline-flex align-items-center gap-2 ${language === "en" ? "btn-primary" : "btn-outline-secondary"
            }`}
          onClick={() => onChange("en")}
        >
          <span>English</span>
        </button>
        <button
          type="button"
          className={`btn btn-sm d-inline-flex align-items-center gap-2 ${language === "zh" ? "btn-primary" : "btn-outline-secondary"
            }`}
          onClick={() => onChange("zh")}
        >
          <span>中文</span>
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [theme, setTheme] = useState<ThemeOption>("auto");
  const [language, setLanguage] = useState<Language>("en");
  const [remInPx, setRemInPx] = useState(DEFAULTS.remInPx.toString());
  const [pxInPt, setPxInPt] = useState(DEFAULTS.pxInPt.toString());

  const dict = dictionaries[language];

  useEffect(() => {
    const systemLang = navigator.language.toLowerCase();
    if (systemLang.startsWith("zh")) {
      setLanguage("zh");
    }
  }, []);

  const pxPerRem = useMemo(() => {
    const parsed = parseFloat(remInPx);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULTS.remInPx;
  }, [remInPx]);

  const ptPerPx = useMemo(() => {
    const parsed = parseFloat(pxInPt);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULTS.pxInPt;
  }, [pxInPt]);

  const rowIdRef = useRef(1);
  const [rows, setRows] = useState<ConversionRow[]>([
    createRow(
      rowIdRef.current,
      DEFAULTS.remInPx,
      DEFAULTS.remInPx,
      DEFAULTS.pxInPt,
      "enter"
    )
  ]);

  useEffect(() => {
    const root = document.documentElement;
    if (!root) return;
    if (theme === "auto") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const applyTheme = () =>
        root.setAttribute("data-bs-theme", media.matches ? "dark" : "light");
      applyTheme();
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
    root.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    setRows((previous) => previous.map((row) => recalcRow(row, pxPerRem, ptPerPx)));
  }, [pxPerRem, ptPerPx]);

  useEffect(() => {
    if (!rows.some((row) => row.state === "enter")) {
      return;
    }
    const timeout = setTimeout(() => {
      setRows((previous) =>
        previous.map((row) => (row.state === "enter" ? { ...row, state: "idle" } : row))
      );
    }, 350);
    return () => clearTimeout(timeout);
  }, [rows]);

  useEffect(() => {
    if (!rows.some((row) => row.state === "exit")) {
      return;
    }
    const timeout = setTimeout(() => {
      setRows((previous) => previous.filter((row) => row.state !== "exit"));
    }, 250);
    return () => clearTimeout(timeout);
  }, [rows]);

  const handleUnitChange = (rowId: number, unit: Unit, rawValue: string) => {
    const normalized = rawValue.replace(",", ".");
    if (normalized && !NUMERIC_PATTERN.test(normalized)) {
      return;
    }
    setRows((previous) =>
      previous.map((row) => {
        if (row.id !== rowId) return row;
        if (!normalized.trim()) {
          return { ...row, px: "", rem: "", pt: "" };
        }
        const numericValue = Number(normalized);
        if (!Number.isFinite(numericValue)) {
          return { ...row, [unit]: normalized };
        }
        if (unit === "px") {
          return { ...row, ...convertFromPx(numericValue, pxPerRem, ptPerPx) };
        }
        if (unit === "rem") {
          return { ...row, ...convertFromRem(numericValue, pxPerRem, ptPerPx) };
        }
        return { ...row, ...convertFromPt(numericValue, pxPerRem, ptPerPx) };
      })
    );
  };

  const addRow = () => {
    rowIdRef.current += 1;
    const newId = rowIdRef.current;
    setRows((previous) => [
      ...previous,
      createRow(newId, pxPerRem, pxPerRem, ptPerPx, "enter")
    ]);
  };

  const handleRemReferenceChange = (value: string) => {
    const normalized = value.replace(",", ".");
    if (!normalized || NUMERIC_PATTERN.test(normalized)) {
      setRemInPx(normalized);
    }
  };

  const handlePxReferenceChange = (value: string) => {
    const normalized = value.replace(",", ".");
    if (!normalized || NUMERIC_PATTERN.test(normalized)) {
      setPxInPt(normalized);
    }
  };

  const resetReferences = () => {
    setRemInPx(DEFAULTS.remInPx.toString());
    setPxInPt(DEFAULTS.pxInPt.toString());
  };

  const calculatedSummary = `1 pt = ${formatValue(
    1 / ptPerPx
  )} px | 1 px = ${formatValue(ptPerPx)} pt | 1 rem = ${formatValue(
    pxPerRem
  )} px = ${formatValue(pxPerRem * ptPerPx)} pt`;

  const removeRow = (rowId: number) => {
    setRows((previous) => {
      if (previous.length === 1) return previous;
      return previous.map((row) =>
        row.id === rowId && row.state !== "exit" ? { ...row, state: "exit" } : row
      );
    });
  };

  return (
    <main className="converter-shell">
      <div className="container-xl">
        <section className="hero-card glass-surface p-4 p-md-5 text-center mb-4 bg-body">
          <p className="text-primary fw-semibold text-uppercase small mb-2 tracking-wide">
            {dict.title}
          </p>
          <h1 className="display-5 fw-bold mb-3">{dict.heroTitle}</h1>
          <p className="lead text-secondary mb-0">
            {dict.heroDescription}
          </p>
        </section>

        <section className="glass-surface bg-body p-4 p-md-5 shadow-sm mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h2 className="h4 fw-bold mb-1">{dict.conversionTitle}</h2>
              <p className="mb-0 text-secondary">
                {dict.conversionDescription}
              </p>
            </div>
            <div className="d-flex flex-column gap-3 align-items-end">
              <ThemeToggle theme={theme} onChange={setTheme} dict={dict} />
              <LanguageToggle language={language} onChange={setLanguage} dict={dict} />
            </div>
          </div>

          {rows.map((row) => (
            <div
              key={row.id}
              className={`conversion-row mb-4 ${row.state === "enter" ? "row-enter" : row.state === "exit" ? "row-exit" : ""
                }`}
            >
              <button
                type="button"
                className="btn btn-outline-danger btn-sm remove-row-btn"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                aria-label="Remove this conversion row"
              >
                <i className="bi bi-x-lg" aria-hidden />
              </button>
              <div className="row g-4">
                <UnitField
                  unit="px"
                  label={dict.pixels}
                  value={row.px}
                  onChange={(value) => handleUnitChange(row.id, "px", value)}
                  dict={dict}
                />
                <UnitField
                  unit="rem"
                  label={dict.rootEm}
                  value={row.rem}
                  onChange={(value) => handleUnitChange(row.id, "rem", value)}
                  dict={dict}
                />
                <UnitField
                  unit="pt"
                  label={dict.points}
                  value={row.pt}
                  onChange={(value) => handleUnitChange(row.id, "pt", value)}
                  dict={dict}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-row-dashed w-100 fw-semibold"
            onClick={addRow}
          >
            {dict.addRow}
          </button>
        </section>

        <section className="reference-card p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h3 className="h5 fw-bold mb-1">{dict.referenceTitle}</h3>
              <p className="mb-0 text-secondary">
                {dict.referenceDescription}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm fw-semibold"
              onClick={resetReferences}
            >
              {dict.resetDefault}
            </button>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-secondary mb-2">
                {dict.remEquals}
              </label>
              <div className="input-group">
                <input
                  className="form-control form-control-lg"
                  inputMode="decimal"
                  value={remInPx}
                  onChange={(event) => handleRemReferenceChange(event.target.value)}
                  placeholder="16"
                />
                <span className="input-group-text">px</span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold text-secondary mb-2">
                {dict.pxEquals}
              </label>
              <div className="input-group">
                <input
                  className="form-control form-control-lg"
                  inputMode="decimal"
                  value={pxInPt}
                  onChange={(event) => handlePxReferenceChange(event.target.value)}
                  placeholder="0.75"
                />
                <span className="input-group-text">pt</span>
              </div>
            </div>
          </div>
          <div className="calculated-pill mt-4 text-primary">
            {dict.calculated}: {calculatedSummary}
          </div>
        </section>
      </div>
    </main>
  );
}
