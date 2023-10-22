import { useIntl } from "react-intl";
import { useCallback } from "react";
import { type TranslationKey } from "../../lang/flattenMessages";

export const useTranslate = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { formatMessage } = useIntl();
  // Define a function called t that takes in a key of type TranslationKey and zero or more arguments of the same type as formatMessage's parameters.
  const t = useCallback(
    (key: TranslationKey) =>
      // Call formatMessage with an object that has an id property set to the given key, as well as any additional arguments passed in.
      formatMessage({ id: key }),
    [formatMessage],
  );

  return { t };
};
