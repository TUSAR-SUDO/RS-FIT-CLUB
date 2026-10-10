import { forwardRef, useRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../utils/cx';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import styles from './Button.module.css';
import { useMagnetic } from './useMagnetic';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Internal route. Renders a router <Link>. */
  to?: string;
  /** External URL. Renders an <a target="_blank" rel="noreferrer">. */
  href?: string;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  block?: boolean;
  /** Subtle cursor-attraction on desktop pointers only. */
  magnetic?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  /** Announced by screen readers when it differs from the visible label. */
  ariaLabel?: string;
  'data-analytics'?: string;
}

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    icon,
    iconPosition = 'end',
    block,
    magnetic = false,
    className,
    onClick,
    type = 'button',
    disabled,
    ariaLabel,
    ...rest
  },
  forwardedRef,
) {
  const localRef = useRef<HTMLElement | null>(null);
  useMagnetic(localRef, magnetic && variant !== 'ghost');

  const classNames = cx(
    styles.btn,
    styles[`btn--${variant}`],
    size !== 'md' && styles[`btn--${size}`],
    block && styles['btn--block'],
    disabled && styles['btn--disabled'],
    className,
  );

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const label = (
    <span className={styles.btn__label}>
      {icon && iconPosition === 'start' ? <Icon name={icon} size={18} /> : null}
      <span>{children}</span>
      {icon && iconPosition === 'end' ? <Icon name={icon} size={18} /> : null}
    </span>
  );

  const backdrop = <span className={styles.btn__bg} aria-hidden="true" />;

  if (to && !disabled) {
    return (
      <Link
        to={to}
        ref={setRefs as React.Ref<HTMLAnchorElement>}
        className={classNames}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        {...rest}
      >
        {backdrop}
        {label}
      </Link>
    );
  }

  if (href && !disabled) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        ref={setRefs as React.Ref<HTMLAnchorElement>}
        className={classNames}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        aria-label={ariaLabel}
        {...rest}
      >
        {backdrop}
        {label}
      </a>
    );
  }

  return (
    <button
      type={type}
      ref={setRefs as React.Ref<HTMLButtonElement>}
      className={classNames}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {backdrop}
      {label}
    </button>
  );
});
