import { useState, useRef, useEffect, useCallback } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

type NumberInputProps = Omit<NumericFormatProps, "value" | "onValueChange"> & {
  stepper?: number;
  thousandSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  showUpDown?: boolean;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  stepper,
  thousandSeparator,
  placeholder,
  defaultValue,
  min = -Infinity,
  max = Infinity,
  onValueChange,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  value: controlledValue,
  showUpDown = false,
  ...props
}) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<number | undefined>(
    controlledValue ?? defaultValue,
  );

  const handleIncrement = useCallback(() => {
    setValue((prev) =>
      prev === undefined
        ? (stepper ?? 1)
        : Math.min(prev + (stepper ?? 1), max),
    );
  }, [stepper, max]);

  const handleDecrement = useCallback(() => {
    setValue((prev) =>
      prev === undefined
        ? -(stepper ?? 1)
        : Math.max(prev - (stepper ?? 1), min),
    );
  }, [stepper, min]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === internalRef.current) {
        if (e.key === "ArrowUp") handleIncrement();
        else if (e.key === "ArrowDown") handleDecrement();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleIncrement, handleDecrement]);

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const handleChange = ({ floatValue }: { floatValue?: number }) => {
    const newValue = floatValue ?? undefined;
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  const handleBlur = () => {
    if (value !== undefined) {
      if (value < min) setValue(min);
      else if (value > max) setValue(max);
    }
  };

  return (
    <div className="flex items-center">
      <NumericFormat
        value={value}
        onValueChange={handleChange}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={min < 0}
        valueIsNumericString
        onBlur={handleBlur}
        max={max}
        min={min}
        suffix={suffix}
        prefix={prefix}
        customInput={Input}
        placeholder={placeholder}
        className="relative rounded-r-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        getInputRef={internalRef}
        {...props}
      />
      {showUpDown && (
        <div className="flex flex-col">
          <Button
            aria-label="Increase value"
            className="h-5 rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:relative"
            variant="outline"
            onClick={handleIncrement}
            disabled={value === max}
          >
            <ChevronUp size={15} />
          </Button>
          <Button
            aria-label="Decrease value"
            className="h-5 rounded-l-none rounded-tr-none border-l-0 border-t-[0.5px] border-input px-2 focus-visible:relative"
            variant="outline"
            onClick={handleDecrement}
            disabled={value === min}
          >
            <ChevronDown size={15} />
          </Button>
        </div>
      )}
    </div>
  );
};
