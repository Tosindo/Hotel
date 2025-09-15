declare module "swarm-numberformat" {
  import type Decimal from "break_infinity.js";

  /**
   * Represents a number, a string representation of a number, or a decimal-like object
   * that the formatter can process.
   */
  type NumberLike = number | string | object;

  /**
   * Defines the structure for a "format", which primarily controls the suffix sets used.
   */
  export interface FormatOptions {
    suffixGroups?: { [key: string]: string[] };
    suffixFn?: (index: number) => string;
  }

  /**
   * Defines the structure for a "flavor", which are presets for common options like
   * significant figures and which suffix group to use.
   */
  export interface FlavorOptions {
    suffixGroup?: string;
    sigfigs?: number;
  }

  /**
   * Configuration options for creating a Formatter instance or for a single format operation.
   */
  export interface FormatterOptions {
    /**
     * The backend to use for calculations. 'native' uses standard JavaScript numbers,
     * while 'decimal.js' uses a provided Decimal.js-compatible library.
     * @default 'native'
     */
    backend?: "native" | "decimal.js";
    /**
     * A preset that modifies other options. Common values are 'full' and 'short'.
     * @default 'full'
     */
    flavor?: string;
    /**
     * An object defining custom flavors.
     */
    flavors?: { [key: string]: FlavorOptions };
    /**
     * The name of the number formatting system to use.
     * @default 'standard'
     */
    format?:
      | "standard"
      | "longScale"
      | "scientific"
      | "hybrid"
      | "engineering"
      | string;
    /**
     * An object defining custom formats.
     */
    formats?: { [key: string]: FormatOptions };
    /**
     * The name of the suffix group to use from the chosen format (e.g., 'full' or 'short').
     */
    suffixGroup?: string;
    /**
     * A custom function to determine the suffix based on the number's index (number of thousands).
     * `(index: number) => string | undefined`
     */
    suffixFn?: (index: number) => string | undefined;
    /**
     * The minimum value at which to start using suffixes (e.g., '100k' instead of '100,000').
     * @default 1e5
     */
    minSuffix?: number;
    /**
     * The maximum value to format as a simple number without applying significant figures rules.
     * @default 0
     */
    maxSmall?: number;
    /**
     * The number of significant figures to display.
     * @default 5 (for 'full' flavor), 3 (for 'short' flavor)
     */
    sigfigs?: number;
    /**
     * A reference to a Decimal.js-compatible constructor. Required if `backend` is 'decimal.js'.
     */
    Decimal?: Decimal;
  }

  /**
   * The main class for creating a persistent formatter with a default set of options.
   */
  export class Formatter {
    /**
     * @param options The default configuration options for this formatter instance.
     */
    constructor(options?: FormatterOptions);

    /**
     * The options this Formatter instance was configured with.
     */
    opts: FormatterOptions;

    /**
     * Formats a number according to the instance's settings or overridden options.
     * @param val The number to format.
     * @param options Override the instance's default options for this call only.
     * @returns The formatted number string.
     */
    format(val: NumberLike, options?: FormatterOptions): string;

    /**
     * A convenience method to format a number using the 'full' flavor.
     * @param val The number to format.
     * @param options Override the instance's default options.
     * @returns The formatted number string.
     */
    formatFull(val: NumberLike, options?: FormatterOptions): string;

    /**
     * A convenience method to format a number using the 'short' flavor.
     * @param val The number to format.
     * @param options Override the instance's default options.
     * @returns The formatted number string.
     */
    formatShort(val: NumberLike, options?: FormatterOptions): string;

    /**
     * Formats a number using a specific flavor.
     * @param val The number to format.
     * @param flavor The name of the flavor to use (e.g., 'short', 'full').
     * @param options Override the instance's default options.
     * @returns The formatted number string.
     */
    formatFlavor(
      val: NumberLike,
      flavor: string,
      options?: FormatterOptions
    ): string;

    /**
     * Calculates the suffix index for a given number (e.g., 1,000,000 has an index of 2).
     * @param val The number to analyze.
     * @param options Override the instance's default options.
     * @returns The suffix index.
     */
    index(val: NumberLike, options?: FormatterOptions): number;

    /**
     * Gets the suffix for a given number without the numeric part.
     * @param val The number to analyze.
     * @param options Override the instance's default options.
     * @returns The corresponding suffix string (e.g., "M", " billion").
     */
    suffix(val: NumberLike, options?: FormatterOptions): string | undefined;

    /**
     * Lists the names of all available formats.
     * @param options Override the instance's default options.
     * @returns An array of format names.
     */
    listFormats(options?: FormatterOptions): string[];
  }

  /**
   * Pre-defined format configurations.
   */
  export const Formats: {
    standard: FormatOptions;
    longScale: FormatOptions;
    scientific: FormatOptions;
    hybrid: FormatOptions;
    engineering: FormatOptions;
    [key: string]: FormatOptions;
  };

  /**
   * Formats a number using the default 'full' flavor options.
   * @param val The number to format.
   * @param options Options to override the defaults.
   * @returns The formatted number string.
   */
  export function format(val: NumberLike, options?: FormatterOptions): string;

  /**
   * Formats a number using the default 'full' flavor options.
   * @param val The number to format.
   * @param options Options to override the defaults.
   * @returns The formatted number string.
   */
  export function formatFull(
    val: NumberLike,
    options?: FormatterOptions
  ): string;

  /**
   * Formats a number using the default 'short' flavor options.
   * @param val The number to format.
   * @param options Options to override the defaults.
   * @returns The formatted number string.
   */
  export function formatShort(
    val: NumberLike,
    options?: FormatterOptions
  ): string;

  /**
   * A default, pre-instantiated Formatter instance. The standalone `format` functions are methods of this instance.
   */
  const numberformat: Formatter;

  export { numberformat };

  export default numberformat;
}
