import { useRef, useCallback } from "react";
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
  thousandSeparator,
  placeholder,
  min = -Infinity,
  max = Infinity,
  onValueChange,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  value, // use controlled value directly
  stepper,
  showUpDown = false,
  ...props
}) => {
  const internalRef = useRef<HTMLInputElement>(null);

  const handleIncrement = useCallback(() => {
    const newValue =
      value === undefined
        ? (stepper ?? 1)
        : Math.min(value + (stepper ?? 1), max);
    if (onValueChange) onValueChange(newValue);
  }, [value, stepper, max, onValueChange]);

  const handleDecrement = useCallback(() => {
    const newValue =
      value === undefined
        ? -(stepper ?? 1)
        : Math.max(value - (stepper ?? 1), min);
    if (onValueChange) onValueChange(newValue);
  }, [value, stepper, min, onValueChange]);

  const handleChange = ({ floatValue }: { floatValue?: number }) => {
    const newValue = floatValue ?? undefined;
    if (onValueChange) onValueChange(newValue);
  };

  const handleBlur = () => {
    if (value !== undefined) {
      if (value < min && onValueChange) onValueChange(min);
      else if (value > max && onValueChange) onValueChange(max);
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
        className="relative [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
