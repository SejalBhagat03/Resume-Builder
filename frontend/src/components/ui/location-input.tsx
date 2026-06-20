import * as React from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCAL_CITIES = [
  "Nagpur, Maharashtra, India",
  "Mumbai, Maharashtra, India",
  "Pune, Maharashtra, India",
  "Bengaluru, Karnataka, India",
  "Delhi, NCR, India",
  "Hyderabad, Telangana, India",
  "Chennai, Tamil Nadu, India",
  "Kolkata, West Bengal, India",
  "Ahmedabad, Gujarat, India",
  "Jaipur, Rajasthan, India",
  "Gurugram, Haryana, India",
  "Noida, Uttar Pradesh, India",
  "New York, NY, USA",
  "San Francisco, CA, USA",
  "Seattle, WA, USA",
  "London, UK",
  "Berlin, Germany",
  "Toronto, ON, Canada",
  "Singapore",
  "Sydney, NSW, Australia",
  "Tokyo, Japan",
];

const apiCache = new Map<string, string[]>();

interface LocationInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  onLocationChange?: (value: string) => void; // for backwards compatibility
  icon?: boolean;
}

export function LocationInput({
  value,
  onChange,
  onLocationChange,
  className,
  icon = false,
  placeholder = "City, State, Country",
  ...props
}: LocationInputProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const triggerChange = (val: string) => {
    onChange(val);
    onLocationChange?.(val);
  };

  // Debounced live fetch
  React.useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    // Filter local list first
    const localMatches = LOCAL_CITIES.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase()),
    );

    setSuggestions(localMatches);

    // If query is in cache, load immediately
    const cacheKey = value.trim().toLowerCase();
    if (apiCache.has(cacheKey)) {
      const cached = apiCache.get(cacheKey) || [];
      setSuggestions((prev) => {
        const merged = [...prev, ...cached];
        return Array.from(new Set(merged)).slice(0, 6);
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=8`,
        );
        if (!res.ok) return;
        const data = await res.json();

        const apiSuggestions = data
          .map((item: any) => {
            const addr = item.address;
            if (!addr) return null;

            // Only pull resume-friendly components
            const city =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.municipality ||
              addr.suburb ||
              addr.city_district ||
              "";
            const state = addr.state || addr.region || addr.province || "";
            const country = addr.country || "";

            if (city && state) {
              return `${city}, ${state}${country ? `, ${country}` : ""}`;
            } else if (city && country) {
              return `${city}, ${country}`;
            } else if (state && country) {
              return `${state}, ${country}`;
            } else if (country) {
              return country;
            } else if (
              item.type === "administrative" ||
              item.class === "boundary" ||
              item.class === "place"
            ) {
              return item.display_name;
            }
            return null;
          })
          .filter((val): val is string => val !== null);

        // Store results in memory cache
        apiCache.set(cacheKey, apiSuggestions);

        // Merge suggestions and remove duplicates
        setSuggestions((prev) => {
          const merged = [...prev, ...apiSuggestions];
          return Array.from(new Set(merged)).slice(0, 6);
        });
      } catch (err) {
        console.warn("Failed to fetch locations", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value]);

  // Click outside listener
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectLocation(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectLocation = (loc: string) => {
    triggerChange(loc);
    setOpen(false);
    setActiveIndex(-1);
  };

  const inputId = props.id || "location-input";

  return (
    <div ref={containerRef} className="relative w-full">
      {icon ? (
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={inputId}
            value={value}
            onChange={(e) => {
              triggerChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("pl-9 h-11 rounded-xl", className)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={`${inputId}-suggestions-list`}
            aria-activedescendant={
              activeIndex >= 0 ? `${inputId}-suggestion-${activeIndex}` : undefined
            }
            {...props}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      ) : (
        <div className="relative">
          <Input
            id={inputId}
            value={value}
            onChange={(e) => {
              triggerChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn("h-11 rounded-xl", className)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={`${inputId}-suggestions-list`}
            aria-activedescendant={
              activeIndex >= 0 ? `${inputId}-suggestion-${activeIndex}` : undefined
            }
            {...props}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={`${inputId}-suggestions-list`}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-md animate-in fade-in-50 slide-in-from-top-1"
        >
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              id={`${inputId}-suggestion-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              onClick={() => selectLocation(suggestion)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs cursor-pointer rounded-lg hover:bg-accent hover:text-accent-foreground select-none",
                idx === activeIndex && "bg-accent text-accent-foreground",
              )}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
