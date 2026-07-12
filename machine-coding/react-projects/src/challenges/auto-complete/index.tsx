import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

const queryDetails = {
  url: "https://newsapi.org/v2/everything",
  apiKey: import.meta.env.VITE_API_KEY,
};

const DEBOUNCE_MS = 300;

export default function App() {
  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <AutoComplete
        name={"Country Search"}
        buttonName={"Search"}
        queryDetails={queryDetails}
      />
    </div>
  );
}

type AutoCompleteProps = {
  name: string;
  buttonName: string;
  queryDetails: any;
};

function AutoComplete({
  name,
  buttonName,
  queryDetails,
}: Readonly<AutoCompleteProps>) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState("");
  const deferredQuery = useDeferredValue(debouncedQuery);
  const trimmedQuery = deferredQuery.trim();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      if (!trimmedQuery) {
        setData([]);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const newUrl = new URL(queryDetails?.url);
        newUrl.searchParams.set("q", trimmedQuery);
        newUrl.searchParams.set("apiKey", queryDetails.apiKey);
        const response = await fetch(newUrl.toString(), {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();
        if (result?.articles && Array.isArray(result.articles)) {
          setData(
            result.articles
              .map((article: any) => (article?.title ? String(article.title) : ""))
              .filter(Boolean),
          );
        } else {
          setData([]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setData([]);
          setError("Unable to load suggestions right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [trimmedQuery, queryDetails?.url, queryDetails?.apiKey]);

  const filteredData = useMemo(() => {
    if (!trimmedQuery) return data;

    const lowerQuery = trimmedQuery.toLowerCase();
    const startsWithMatches = data.filter((item) =>
      item.toLowerCase().startsWith(lowerQuery),
    );
    const includesMatches = data.filter(
      (item) =>
        !item.toLowerCase().startsWith(lowerQuery) &&
        item.toLowerCase().includes(lowerQuery),
    );

    return [...startsWithMatches, ...includesMatches];
  }, [trimmedQuery, data]);

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  const submitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      alert(trimmedQuery || query);
    },
    [trimmedQuery, query],
  );

  const showDropdown = Boolean(query && filteredData.length > 0);
  const showEmptyState = Boolean(query && !loading && filteredData.length === 0);

  return (
    <form
      onSubmit={submitHandler}
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        display: "grid",
        gap: "12px",
      }}
    >
      <TextLabel name={name} htmlFor="auto-complete" />

      <div style={{ position: "relative" }}>
        <TextFieldBase
          id="auto-complete"
          type="text"
          onChange={onChangeHandler}
          value={query}
          placeholder="Search news"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            fontSize: "15px",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
              maxHeight: "220px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {filteredData.map((item) => (
              <div
                key={item}
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {showEmptyState && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "12px",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
            }}
          >
            No results
          </div>
        )}
      </div>

      {loading && (
        <div style={{ color: "#6b7280", fontSize: "14px" }}>Loading suggestions...</div>
      )}
      {error && <div style={{ color: "#dc2626", fontSize: "14px" }}>{error}</div>}

      <Button
        aria-controls="auto-complete"
        type="submit"
        name={buttonName}
        style={{
          padding: "10px 14px",
          border: "none",
          borderRadius: "10px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 600,
        }}
      />
    </form>
  );
}

function TextLabel({
  name,
  required,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  name: string;
  required?: boolean;
}) {
  return (
    <label {...props} style={{ fontWeight: 600, color: "#111827" }}>
      {name}:{required ? "*" : ""}
    </label>
  );
}

function TextFieldBase(
  props: Readonly<React.InputHTMLAttributes<HTMLInputElement>>,
) {
  return <input {...props} />;
}

function Button(
  props: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>,
) {
  const { name, ...rest } = props;

  return <button {...rest}>{name}</button>;
}
