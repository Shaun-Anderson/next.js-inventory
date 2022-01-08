import { Loader, Select, SelectItem, SelectProps } from "@mantine/core";
import {
  ForwardedRef,
  ReactNode,
  FC,
  useState,
  useEffect,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import { supabase } from "../utils/supabaseClient";

interface AsyncSelectProps<T> {
  url: string;
  label: string;
  labelProp: string;
  valueProp: string;
  placeholder: string;
  required: boolean;
  onChange?: any;
  error?: ReactNode;
  itemComponent: ForwardRefExoticComponent<T>;
  rightSection: JSX.Element;
  searchable: boolean;
  maxDropdownHeight?: number;
  filter: (value: string, item: SelectItem) => boolean;
  defaultValue?: string;
}
export function AsyncSelect<T extends Record<string, unknown>>(
  props: AsyncSelectProps<T>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load data async
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    // const user = supabase.auth.user();
    const { data: returnedData, error } = await supabase
      .from(props.url)
      .select("*");
    // add a value and label
    const finalData: T[] = returnedData
      ? returnedData.map((element: T) => {
          return {
            ...element,
            value: element[props.valueProp].toString(),
            label: element[props.labelProp].toString(),
          };
        })
      : [];
    if (error) throw error.message;
    setData(finalData);
    setLoading(false);
  }
  return (
    <Select
      label={props.label}
      required={props.required}
      onChange={props.onChange}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      transition="pop-top-left"
      transitionDuration={80}
      transitionTimingFunction="ease"
      rightSection={loading ? <Loader size="xs" /> : null}
      itemComponent={props.itemComponent}
      data={data}
      error={props.error}
      searchable={props.searchable}
      maxDropdownHeight={props.maxDropdownHeight}
      nothingFound="No data found"
      filter={props.filter}
    />
  );
}
