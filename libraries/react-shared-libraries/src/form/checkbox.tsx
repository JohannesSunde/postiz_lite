'use client';

import { ChangeEvent, forwardRef, useCallback } from 'react';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
export const Checkbox = forwardRef<
  HTMLInputElement,
  {
    checked?: boolean;
    disableForm?: boolean;
    name?: string;
    className?: string;
    label?: string;
    onChange?: (event: {
      target: {
        name?: string;
        value: boolean;
      };
    }) => void;
    variant?: 'default' | 'hollow';
  }
>((props, ref: any) => {
  const { checked, className, label, disableForm, variant } = props;
  const form = useFormContext();
  const register =
    disableForm || !props.name ? undefined : form.register(props.name);
  const watch = disableForm || !props.name ? undefined : form.watch(props.name);
  const val = Boolean(watch ?? checked);

  const setRef = useCallback(
    (element: HTMLInputElement | null) => {
      register?.ref(element);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [ref, register]
  );

  const changeStatus = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    props?.onChange?.({
      target: {
        name: props.name!,
        value: nextValue,
      },
    });
    if (!disableForm) {
      register?.onChange?.(event);
    }
  }, [disableForm, props, register]);
  return (
    <label className="flex gap-[10px] items-center">
      <input
        ref={setRef}
        type="checkbox"
        name={props.name}
        checked={val}
        onBlur={register?.onBlur}
        onChange={changeStatus}
        className="sr-only peer"
      />
      <span
        className={clsx(
          'cursor-pointer rounded-[4px] select-none w-[24px] h-[24px] justify-center items-center flex text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white',
          variant === 'default' || !variant
            ? 'bg-forth'
            : 'border-customColor1 border-2 bg-customColor2',
          className
        )}
      >
        {val && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </span>
      {!!label && <div>{label}</div>}
    </label>
  );
});
