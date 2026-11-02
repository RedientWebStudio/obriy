import { useEffect, useRef } from "react";
import {
  type Reference,
  type ReferenceInputProps,
  unset,
  useFormValue,
} from "sanity";

function publishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

/**
 * Keeps the default Subcategory reference UI, but unsets the value when
 * Category changes so an orphaned reference cannot linger.
 */
export function ProductSubcategoryInput(props: ReferenceInputProps) {
  const category = useFormValue(["category"]) as Reference | undefined;
  const categoryKey = category?._ref ? publishedId(category._ref) : "";
  const previousCategoryKey = useRef(categoryKey);
  const { value, onChange } = props;

  useEffect(() => {
    if (previousCategoryKey.current === categoryKey) return;
    previousCategoryKey.current = categoryKey;
    if (value) {
      onChange(unset());
    }
  }, [categoryKey, onChange, value]);

  return props.renderDefault(props);
}
