/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createFormHook,
  createFormHookContexts,
  getBy as getByImpl,
  type DeepKeys,
  type FormValidateOrFn,
  type FormAsyncValidateOrFn,
  type DeepValue,
  type FormOptions,
} from "@tanstack/solid-form";
import type { FormValue } from "./Forms";
import { lazy } from "solid-js";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField: lazy(() => import("./fields/TextField")),
    TextAreaField: lazy(() => import("./fields/TextAreaField")),
    NumberField: lazy(() => import("./fields/NumberField")),
    ToggleField: lazy(() => import("./fields/ToggleField")),
    SelectField: lazy(() => import("./fields/SelectField")),
    RadioGroupField: lazy(() => import("./fields/RadioGroupField")),
    TabBoxField: lazy(() => import("./fields/TabBoxField")),
    ImageField: lazy(() => import("./fields/ImageField")),
    IdField: lazy(() => import("./fields/IdField")),
    TagsField: lazy(() => import("./fields/TagsField")),
    RawDescriptionField: lazy(() => import("./fields/RawDescriptionField")),
    IconSelectField: lazy(() => import("./fields/IconSelectField")),
    CheckboxListField: lazy(() => import("./fields/CheckboxListField")),
  },
  formComponents: {},
});
export const pseudoMainFormOption = {
  defaultValues: {} as FormValue,
} as const;

// MAGIC "SubForm" code provided by @realugi
// https://github.com/TanStack/form/discussions/1200#discussioncomment-13249123

// utility type
// we want to be able to accept any formOptions type
type AnyFormOptions = FormOptions<
  any,
  FormValidateOrFn<any> | undefined,
  FormValidateOrFn<any> | undefined,
  FormAsyncValidateOrFn<any> | undefined,
  FormValidateOrFn<any> | undefined,
  FormAsyncValidateOrFn<any> | undefined,
  FormValidateOrFn<any> | undefined,
  FormAsyncValidateOrFn<any> | undefined,
  FormValidateOrFn<any> | undefined,
  FormAsyncValidateOrFn<any> | undefined,
  FormAsyncValidateOrFn<any> | undefined,
  unknown
>;

// utility type
// this is the type of the subform prop that a component can accept
// it is designed to be unionized in order to accept multiple prefixes and multiple forms
// generic parameters:
// - TOpts for formOptions type
// - TPrefix for the prefix of the subform, must be included in TFormData
// - TFormData deduced from TOpts's defaultValues
// properties:
// - form, which has to be of TFormData
// - prefix, which can only be a valid prefix in TFormData
export type SubForm<
  TOpts extends AnyFormOptions,
  TPrefix extends DeepKeys<TFormData>,
  TFormData = NonNullable<TOpts["defaultValues"]>,
> = {
  form: any;
  // ReturnType<
  //   typeof useAppForm<
  //     TFormData,
  //     FormValidateOrFn<TFormData> | undefined,
  //     FormValidateOrFn<TFormData> | undefined,
  //     FormAsyncValidateOrFn<TFormData> | undefined,
  //     FormValidateOrFn<TFormData> | undefined,
  //     FormAsyncValidateOrFn<TFormData> | undefined,
  //     FormValidateOrFn<TFormData> | undefined,
  //     FormAsyncValidateOrFn<TFormData> | undefined,
  //     FormValidateOrFn<TFormData> | undefined,
  //     FormAsyncValidateOrFn<TFormData> | undefined,
  //     FormAsyncValidateOrFn<TFormData> | undefined,
  //     unknown
  //   >
  // >;
  prefix: TPrefix;
};

// utility function
// this one is a little tricky and does 2 things
// 1. if we would just plain do `subform.form`, the form field would have the following type/shape:
// FormApi<TFormData1, ...> | FromApi<TFormData2, ...> | ...
// this type/shape does not allow us to call functions like form.AppField or form.Field (you can try it out)
// rather, the type/shape needs to be something like this:
// FormApi<TFormData1 | TFormData2 | ..., ...>
// in order for us to be able to call `form.AppField` and `form.Field`
// 2. Furthermore, there also has to be a special consideration for
// same prefixes in multiple forms
// given the following example with two forms, TFormData would be the following:
// `{ address: { line1: string, line2: string} } | { address: { line1: string } }`
// they have same prefix `address`, but the second form is missing `line2` field.
// Due to the nature of DeepKeys (and therefore, the `name` prop of `form.Field`),
// when DeepKeys is called with this union, it would return `"address.line2"` as a possible name
// so we explicitly neverize all the primitive fields,
// which are not contained in every element of the union
// so in the above case the neverization would result in the following type:
// `{ address: { line1: {}, line2: never } }`
// Then we intersect it with the above union to get the following TFormData:
// `{ address: { line1: string, line2: never} } | { address: { line1: string, line2: never } }`
// this way, we get an error if we try to access the name `"address.line2"`
export function getSubForm<T extends SubForm<any, string>>(subForm: T) {
  type UnionToIntersection<U> = (
    U extends any ? (x: U) => void : never
  ) extends (x: infer I) => void
    ? I
    : never;
  type Indexify<T> = T & { [str: string]: undefined };
  type AllUnionKeys<T> = keyof UnionToIntersection<T>;
  type Neverized<T> = {
    [K in AllUnionKeys<T> & string as undefined extends Indexify<T>[K]
      ? UnionToIntersection<T>[K] extends object
        ? never
        : K
      : K]: Indexify<T>[K] extends Array<any>
      ? Neverized<Indexify<T>[K][number]>[]
      : Indexify<T>[K] extends object
      ? Neverized<Indexify<T>[K]>
      : undefined extends Indexify<T>[K]
      ? UnionToIntersection<T>[K] extends object
        ? unknown
        : never
      : unknown;
  };

  type FormDataUnion = NonNullable<T["form"]["options"]["defaultValues"]>;
  type NeverizedFormData = Neverized<FormDataUnion>;
  type FormData = FormDataUnion & NeverizedFormData;
  return subForm.form as ReturnType<
    typeof useAppForm<
      FormData,
      FormValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      FormAsyncValidateOrFn<FormData> | undefined,
      unknown
    >
  >;
}

/**
 * Make internal '@tanstack/solid-form' typed.
 * @param state
 * @param key
 * @returns
 */
export function getBy<
  T extends NonNullable<unknown>,
  const K extends DeepKeys<T>,
>(state: T, key: K): DeepValue<T, K> {
  return getByImpl(state, key);
}
